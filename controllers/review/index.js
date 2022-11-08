const { default: mongoose } = require("mongoose");
const Review = require("../../model/Review");
const ErrorResponse = require("../../utils/errorResponse");

exports.getAll = async (req, res, next) => {
  const { skip, limit, page } = req.pagination;
  try {
    const review = await Review.find()
      .populate([
        {
          path: "order",
        },
        {
          path: "product",
        },
        {
          path: "author",
        },
      ])
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Review list fetched successfully",
      data: review,
      total: await Review.count(),
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
  const { review_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!review_id || !mongoose.Types.ObjectId.isValid(review_id))
    return next(new ErrorResponse("Please provide valid review id", 400));

  try {
    const review = await Review.findById(review_id).populate([
      {
        path: "order",
      },
      {
        path: "product",
      },
      {
        path: "author",
      },
    ]);

    if (!review) return next(new ErrorResponse("No review found", 404));

    res.status(200).json({
      success: true,
      data: review,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.byProductID = async (req, res, next) => {
  // Get Values
  const { product_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
    return next(new ErrorResponse("Please provide valid review id", 400));

  try {
    const review = await Review.find({
      product: product_id,
      isActive: true,
    }).populate([
      {
        path: "order",
      },
      {
        path: "author",
      },
    ]);

    if (!review) return next(new ErrorResponse("No review found", 404));

    res.status(200).json({
      success: true,
      data: review,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.byProductIDForAdmin = async (req, res, next) => {
  // Get Values
  const { product_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
    return next(new ErrorResponse("Please provide valid product id", 400));

  try {
    const review = await Review.find({
      product: product_id,
    }).populate([
      {
        path: "order",
      },
      {
        path: "author",
      },
    ]);

    if (!review) return next(new ErrorResponse("No review found", 404));

    res.status(200).json({
      success: true,
      data: review,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.byUserIDForAdmin = async (req, res, next) => {
  // Get Values
  const { user_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!user_id || !mongoose.Types.ObjectId.isValid(user_id))
    return next(new ErrorResponse("Please provide valid user id", 400));

  try {
    const review = await Review.find({
      author: user_id,
    }).populate([
      {
        path: "order",
      },
      {
        path: "product",
      },
    ]);

    if (!review) return next(new ErrorResponse("No review found", 404));

    res.status(200).json({
      success: true,
      data: review,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.create = async (req, res, next) => {
  // Get Values
  const { order, orderline, product, rating, message, attachments } = req.body;

  try {
    // Store Review to DB
    const review = await Review.create({
      order,
      product,
      orderline,
      author: req.user._id,
      authorModel: req.isAdmin ? "Admin" : "User",
      rating,
      message,
      attachments,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.activeInactive = async (req, res, next) => {
  // Get Values
  const { review_id } = req.params;

  if (!review_id || !mongoose.Types.ObjectId.isValid(review_id))
    return next(new ErrorResponse("Please provide valid review id", 400));

  try {
    // Update Review to DB
    const review = await Review.findById(review_id).select("+isActive");

    if (!review) return next(new ErrorResponse("No review found", 404));

    await review.updateOne({
      isActive: !review.isActive,
    });
    await review.save();

    res.status(200).json({
      success: true,
      message: `Review ${
        review.isActive ? "deactivated" : "activated"
      } successfully`,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};
