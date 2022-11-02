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
      `${user.fullName}, Your order placed successfully at Rayos!`
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
  const { status } = req.query;
  try {
    const order = await Order.findOne({
      _id: order_id,
    });

    const orderLines = await OrderLine.find({
      order: order_id,
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
          quantity: {
            $gte: this.quantity,
          },
        },
      },
    ]);
    console.log(order);
    console.log(orderLines);

    res.status(201).json({
      success: true,
      message: `Order ${order_id} updated to ${status} successfully`,
    });
    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
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
        .limit(limit),
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
        .limit(limit),
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