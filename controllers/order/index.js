const { default: mongoose } = require("mongoose");
const { sendSMS } = require("../../config/sms");
const Cart = require("../../model/Cart");
const Order = require("../../model/Order");
const OrderCache = require("../../model/OrderCache");
const OrderLine = require("../../model/OrderLine");
const OrderTimeline = require("../../model/OrderTimeLine");
const Variant = require("../../model/Variant");
const ErrorResponse = require("../../utils/errorResponse");
const { default: searchRegex } = require("../../utils/searchRegex");

exports.calculateOrder = async (req, res, next) => {
  const user = req.user;
  const { carts, paymentMethod, shipping, voucher } = req.body;
  try {
    const foundCarts = await Cart.find({
      _id: Array.from(carts, (cart) => cart.id),
      user: user._id,
    })
      .populate({
        path: "variant",
        match: {
          isActive: true,
        },
        select: "titleEn titleBn product quantity",
        populate: {
          path: "product",
          match: {
            isActive: true,
          },
          select: "titleEn titleBn image sellPrice",
        },
      })
      .select({
        variant: 1,
        quantity: 1,
      });

    let processingCarts = foundCarts || [];
    let sellPrice = 0;
    let shippingFee = 0;
    let discountPrice = 0;
    processingCarts?.map?.((cart) => {
      if (!cart.variant || !cart.variant?.product) {
        throw new ErrorResponse("Product not found", 404);
      }
      if (cart.quantity > cart.variant?.quantity)
        throw new ErrorResponse(
          `${cart.quantity} ${cart.variant?.product?.titleEn} is not available`,
          404
        );
      sellPrice += cart?.quantity * cart?.variant?.product?.price || 0;
    });

    await OrderCache.findOneAndReplace(
      {
        _id: user._id,
      },
      {
        _id: user._id,
        carts: Array.from(foundCarts, (c) => c._id),
        paymentMethod,
        shipping,
        shippingFee,
      },
      {
        upsert: true,
      }
    );

    res.status(201).json({
      success: true,
      message: "Order cached successfully",
      data: {
        carts: foundCarts,
        paymentMethod,
        shipping,
        voucher,
        sellPrice,
        shippingFee,
        total: sellPrice - discountPrice + shippingFee,
      },
    });
    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.getOrderCalculation = async (req, res, next) => {
  const user = req.user;
  try {
    const orderCache = await OrderCache.findById(user._id).populate({
      path: "carts",
      populate: {
        path: "variant",
        match: {
          isActive: true,
        },
        select: "titleEn titleBn product quantity",
        populate: {
          path: "product",
          match: {
            isActive: true,
          },
          select: "titleEn titleBn image sellPrice",
        },
      },
      select: "variant quantity",
    });
    if (!orderCache)
      res.status(200).json({
        success: false,
        message: "No order information found",
      });

    let processingCarts = orderCache.carts || [];
    var sellPrice = 0;
    var discountPrice = 0;
    processingCarts?.map?.((cart) => {
      if (!cart.variant || !cart.variant?.product) {
        throw new ErrorResponse("Product not found", 404);
      }
      if (cart.quantity > cart.variant?.quantity)
        throw new ErrorResponse(
          `${cart.quantity} ${cart.variant?.product?.titleEn} is not available`,
          404
        );
      sellPrice += cart?.quantity * cart?.variant?.product?.price || 0;
    });

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: {
        ...orderCache._doc,
        sellPrice,
        total: sellPrice - discountPrice + orderCache.shippingFee,
      },
    });
    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

/**
 * Place Order
 *
 * Description: Order Placed from Order Caches by, Uploading carts on orderlines & informations on orders.
 */
exports.createOrder = async (req, res, next) => {
  const user = req.user;
  try {
    const orderCache = await OrderCache.findById(user._id).populate({
      path: "carts",
      populate: {
        path: "variant",
        match: {
          isActive: true,
        },
        select: "titleEn titleBn product quantity",
        populate: {
          path: "product",
          match: {
            isActive: true,
          },
          select: "titleEn titleBn image sellPrice",
        },
      },
      select: "variant quantity",
    });
    if (!orderCache)
      res.status(200).json({
        success: false,
        message: "No order information found",
      });

    let processingCarts = orderCache.carts || [];
    var sellPrice = 0;
    var discount = 0;

    processingCarts?.map?.((cart) => {
      if (!cart.variant || !cart.variant?.product) {
        throw new ErrorResponse("Product not found", 404);
      }
      if (cart.quantity > cart.variant?.quantity)
        throw new ErrorResponse(
          `${cart.quantity} ${cart.variant?.product?.titleEn} is not available`,
          404
        );
      sellPrice += cart?.quantity * cart?.variant?.product?.price || 0;
    });

    const order = await Order.create({
      user: user._id,
      shipping: orderCache.shipping,
      paymentMethod: orderCache.paymentMethod,
      status: "Pending",
      totalSellPrice: sellPrice,
      shippingFee: orderCache.shippingFee,
      discount,
      total: sellPrice - discount + orderCache.shippingFee,
    });

    processingCarts?.map?.(async (cart) => {
      // decrease quantity from products
      await orderFromVariant(cart.variant?._id, cart.quantity);

      await OrderLine.create({
        order: order._id,
        product: cart.variant?.product?._id,
        variant: cart.variant?._id,
        quantity: cart.quantity,
        sellPrice: cart.variant?.product?.sellPrice,
        price: cart.variant?.product?.price,
        discount: cart.variant?.product?.discount || 0,
      });

      await Cart.deleteMany({
        _id: Array.from(processingCarts, (c) => c._id),
      });
    });

    await orderCache.delete();

    await OrderTimeline.create({
      order: order._id,
      status: "Pending",
    });

    await sendSMS(
      user.phone,
      `${user.fullName}, Your order is placed successfully at Rayos! For more details and tracking your order visit our website http://rayosbd.com.`
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
    });
    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

/**
 * Update Order
 *
 * Description: Update Order to Confirmed, Shipped, Delivered
 */
exports.updateOrder = async (req, res, next) => {
  const { order_id } = req.params;
  const { status, orderlines } = req.query;
  try {
    const order = await Order.findOne({
      _id: order_id,
    });

    if (!order) throw new ErrorResponse("No order found", 404);

    switch (status) {
      case "Pending":
        throw new ErrorResponse("Order can't be updated as pending", 400);
      case "Confirmed":
        switch (order.status) {
          case "Pending":
            order.status = "Confirmed";
            order.save();
            await OrderTimeline.create({
              order: order._id,
              status: "Confirmed",
            });
            break;
          default:
            throw new ErrorResponse(
              "Order can update as confirmed only from pending",
              400
            );
        }
        break;
      case "Shipped":
        switch (order.status) {
          case "Confirmed":
            order.status = "Shipped";
            order.save();
            await OrderTimeline.create({
              order: order._id,
              status: "Shipped",
            });
            break;
          default:
            throw new ErrorResponse(
              "Order can update as shipped only from confirmed",
              400
            );
        }
        break;
      case "Delivered":
        switch (order.status) {
          case "Shipped":
            order.status = "Delivered";
            order.save();
            await OrderTimeline.create({
              order: order._id,
              status: "Delivered",
            });
            break;
          default:
            throw new ErrorResponse(
              "Order can update as delivered only from shipped",
              400
            );
        }
        break;
      case "Canceled":
        switch (order.status) {
          case "Pending":
          case "Confirmed":
            await cancelOrderLine(order, orderlines, "Canceled");
            break;
          default:
            throw new ErrorResponse(
              "Order can be canceled from pending or confirmed",
              400
            );
        }
        break;
      case "Returned":
        switch (order.status) {
          case "Delivered":
          case "Shipped":
            await cancelOrderLine(order, orderlines, "Returned");
            break;
          default:
            throw new ErrorResponse(
              "Order can be returned from delivered or shipped",
              400
            );
        }
        break;
      case undefined:
        throw new ErrorResponse("Status is required", 400);
      default:
        throw new ErrorResponse("Status is not valid", 400);
    }

    res.status(201).json({
      success: true,
      message: `Order ${status.toLowerCase()} successfully`,
    });
    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

const cancelOrderLine = async (order, orderlinesIds, status) => {
  const orderLines = await OrderLine.find({
    ...(orderlinesIds && {
      _id: orderlinesIds.replace(" ", "").split(","),
    }),
    order: order.id,
  }).populate([
    {
      path: "product",
      select: "quantity isActive",
      match: {
        isActive: true,
      },
    },
    {
      path: "variant",
      select: "quantity isActive",
      match: {
        isActive: true,
      },
    },
  ]);

  var count = 0;
  orderLines?.map?.(async (orderline) => {
    count += orderline.quantity;
    orderline.canceledOrReturned = status;
    orderline.save();
    order.sellPrice -= orderline.price * orderline.quantity;
    order.total -= orderline.price * orderline.quantity;
    orderFromVariant(orderline.variant._id, -1 * orderline.quantity);
  });

  if (orderlinesIds)
    await OrderTimeline.create({
      order: order._id,
      status,
      message: `${count || 0} items ${status.toLowerCase()}`,
    });
  else {
    order.status = status;
    order.save();
    await OrderTimeline.create({
      order: order._id,
      status,
    });
  }
};

/**
 *
 * @param { Id } variantId
 * @param { Quantity } quantity
 *
 * Decrese quantity for variant when order confirmed
 */
const orderFromVariant = async (variantId, quantity) => {
  const variant = await Variant.findById(variantId);
  if (!variant) throw new ErrorResponse("Product not found", 404);

  variant.$inc("sold", quantity);
  variant.$inc("quantity", quantity * -1);
  variant.save();
};

exports.getAll = async (req, res, next) => {
  const { skip, limit, page } = req.pagination;
  const { status } = req.query;

  try {
    res.status(200).json({
      success: true,
      message: "Order list fetched successfully",
      data: await Order.find({
        // $or: searchRegex(req.search, "user.userName"),
        ...(status && { status }),
      })
        .populate([
          {
            path: "user",
            select: "userName image",
          },
        ])
        .select(
          "shipping paymentMethod status totalSellPrice shippingFee voucher discount total createdAt"
        )
        .skip(skip)
        .limit(limit),
      status: status || "All",
      total: await Order.count(),
      page,
      limit,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.getAllUser = async (req, res, next) => {
  const { skip, limit, page } = req.pagination;
  const { status } = req.query;
  const user = req.user;
  try {
    res.status(200).json({
      success: true,
      message: "Order list fetched successfully",
      data: await Order.find({
        // $or: searchRegex(req.search, "user.userName"),
        user: user._id,
        ...(status && { status }),
      })
        .skip(skip)
        .limit(limit)
        .select(
          "shipping paymentMethod status totalSellPrice shippingFee voucher discount total createdAt"
        ),
      status: status || "all",
      total: await Order.find({
        // $or: searchRegex(req.search, "user.userName"),
        user: user._id,
        ...(status && { status }),
      }).count(),
      page,
      limit,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.getAllUserId = async (req, res, next) => {
  const { userId } = req.params;
  const { skip, limit, page } = req.pagination;
  const { status } = req.query;

  try {
    res.status(200).json({
      success: true,
      message: "Order list fetched successfully",
      data: await Order.find({
        // $or: searchRegex(req.search, "user.userName"),
        user: userId,
        ...(status && { status }),
      })
        .skip(skip)
        .limit(limit)
        .select(
          "shipping paymentMethod status totalSellPrice shippingFee voucher discount total createdAt"
        ),
      status: status || "all",
      total: await Order.count(),
      page,
      limit,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.byID = async (req, res, next) => {
  // Get Values
  const { order_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!order_id || !mongoose.Types.ObjectId.isValid(order_id))
    return next(new ErrorResponse("Please provide valid order id", 400));

  try {
    const order = await Order.findById(order_id)
      .populate([
        {
          path: "user",
          select: "userName image phone email",
        },
        {
          path: "products",
          populate: [
            {
              path: "product",
              select:
                "titleEn titleBn image quantity sellPrice price discount isActive variantType slug",
            },
            {
              path: "variant",
              select: "titleEn titleBn quantity isActive",
            },
            {
              path: "review",
              select: "rating message attachments isActive -orderline",
            },
          ],
          select:
            "product variant quantity sellPrice price discount canceledOrReturned -order",
        },
        {
          path: "timeline",
          select: "status message createdAt -order",
          sort: "-createdAt",
        },
      ])
      .select(
        "shipping paymentMethod status totalSellPrice shippingFee voucher discount total"
      );

    if (!order) return next(new ErrorResponse("No order found", 404));

    res.status(200).json({
      success: true,
      data: order,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.productsByID = async (req, res, next) => {
  // Get Values
  const { order_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!order_id || !mongoose.Types.ObjectId.isValid(order_id))
    return next(new ErrorResponse("Please provide valid order id", 400));

  try {
    const order = await Order.findById(order_id).populate([
      {
        path: "user",
        select: "userName image",
      },
      {
        path: "products",
        populate: [
          {
            path: "product",
            select:
              "titleEn titleBn image quantity sellPrice price discount isActive variantType slug",
          },
          {
            path: "variant",
            select: "titleEn titleBn quantity isActive",
          },
        ],
        select:
          "product variant quantity sellPrice price discount canceledOrReturned -order",
      },
    ]);
    if (!order) return next(new ErrorResponse("No order found", 404));

    res.status(200).json({
      success: true,
      data: order?.products || [],
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.timelineByID = async (req, res, next) => {
  // Get Values
  const { order_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!order_id || !mongoose.Types.ObjectId.isValid(order_id))
    return next(new ErrorResponse("Please provide valid order id", 400));

  try {
    const order = await Order.findById(order_id).populate([
      {
        path: "user",
        select: "userName image",
      },
      {
        path: "timeline",
        select: "status message createdAt -order",
        sort: "-createdAt",
      },
    ]);
    if (!order) return next(new ErrorResponse("No order found", 404));

    res.status(200).json({
      success: true,
      data: order?.timeline || [],
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};