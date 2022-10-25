const { default: mongoose } = require("mongoose");
const Bookmark = require("../../model/Bookmark");
const ErrorResponse = require("../../utils/errorResponse");

exports.getForUser = async (req, res, next) => {
  const user = req.user;
  const { skip, limit, page } = req.pagination;
  try {
    res.status(200).json({
      success: true,
      message: "Bookmark list fetched successfully",
      data: await Bookmark.find({ user: user._id })
        .populate("product")
        .skip(skip)
        .limit(limit),
      total: await Bookmark.find({ user: user._id }).count(),
      page,
      limit,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.getForUserId = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    res.status(200).json({
      success: true,
      message: "Bookmark list fetched successfully",
      data: await Bookmark.find({ user: user_id }).populate("product"),
      total: await Bookmark.find({ user: user_id }).count(),
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.createOrDelete = async (req, res, next) => {
  const user = req.user;
  const { product_id } = req.params;

  if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
    next(new ErrorResponse("Please provide valid product id", 400));

  try {
    const bookmark = await Bookmark.findOneAndDelete({
      user: user._id,
      product: product_id,
    });

    if (!bookmark)
      await Bookmark.create({
        user: user._id,
        product: product_id,
      });

    res.status(200).json({
      success: true,
      message: `Product ${
        !bookmark ? "added to" : "removed from"
      } wishlist successfully`,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};
