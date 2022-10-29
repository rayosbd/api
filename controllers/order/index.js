const Cart = require("../../model/Cart");
const ErrorResponse = require("../../utils/errorResponse");

exports.createOrder = async (req, res, next) => {
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
      sellPrice += cart?.variant?.product?.price || 0;
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
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
