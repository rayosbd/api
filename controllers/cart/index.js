const { default: mongoose } = require("mongoose");
const Cart = require("../../model/Cart");
const Variant = require("../../model/Variant");
const ErrorResponse = require("../../utils/errorResponse");

exports.getForUser = async (req, res, next) => {
  const user = req.user;
  try {
    res.status(200).json({
      success: true,
      message: "Cart list fetched successfully",
      data: await Cart.find({ user: user._id })
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
          user: 0,
        }),
      total: await Cart.find({ user: user._id }).lean().count(),
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.createCart = async (req, res, next) => {
  const user = req.user;
  const { variant_id } = req.params;

  try {
    if (!variant_id || !mongoose.Types.ObjectId.isValid(variant_id))
      return next(new ErrorResponse("Please provide valid variant id", 400));

    const variant = await Variant.findOne({
      _id: variant_id,
      isActive: true,
    });
    if (!variant) return next(new ErrorResponse("Product not found", 404));

    if (variant.quantity < (parseFloat(req.query?.quantity) || 0))
      return next(
        new ErrorResponse(
          `${parseFloat(req.query?.quantity) || 0} products are not available`,
          400
        )
      );

    await Cart.create({
      user: user._id,
      quantity: parseFloat(req.query?.quantity) || 0,
      variant: variant_id,
    });

    res.status(201).json({
      success: true,
      message: "Product added to the cart",
    });
    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.deleteCart = async (req, res, next) => {
  const user = req.user;
  const { cart_id } = req.params;
  try {
    if (!cart_id || !mongoose.Types.ObjectId.isValid(cart_id))
      return next(new ErrorResponse("Please provide valid cart id", 400));

    if (
      await Cart.findOneAndDelete({
        _id: cart_id,
        user: user._id,
      })
    )
      res.status(200).json({
        success: true,
        message: "Product removed from cart",
      });
    else next(new ErrorResponse("Cart item not found", 404));

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.updateCart = async (req, res, next) => {
  const user = req.user;
  const { cart_id } = req.params;
  try {
    if (!cart_id || !mongoose.Types.ObjectId.isValid(cart_id))
      return next(new ErrorResponse("Please provide valid cart id", 400));

    const cart = await Cart.findOne({
      _id: cart_id,
      user: user._id,
    }).populate("variant");

    if (!cart) return next(new ErrorResponse("Cart item not found", 404));

    if (cart.variant.quantity < (parseFloat(req.query?.quantity) || 0))
      return next(
        new ErrorResponse(
          `${parseFloat(req.query?.quantity) || 0} products are not available`,
          400
        )
      );

    if (!(parseFloat(req.query?.quantity) || 0))
      return this.deleteCart(req, res, next);

    if (
      await Cart.findOneAndUpdate(
        {
          _id: cart_id,
          user: user._id,
        },
        {
          quantity: parseFloat(req.query?.quantity) || 0,
        }
      )
    )
      res.status(201).json({
        success: true,
        message: "Cart updated successfully",
      });
    else next(new ErrorResponse("Cart item not found", 404));

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};
