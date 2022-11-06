const { default: mongoose } = require("mongoose");
const Review = require("../../model/Review");

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

exports.create = async (req, res, next) => {
  // Get Values
  const { order, product, rating, message, attachments } = req.body;

  try {
    // Store Review to DB
    const review = await Review.create({
      order,
      product,
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
