const { default: mongoose } = require("mongoose");
const Review = require("../../model/Review");
const ErrorResponse = require("../../utils/errorResponse");
const { fieldsQuery, queryObjectBuilder } = require("../../utils/fieldsQuery");

exports.getAll = async (req, res, next) => {
  const { author, product, isActive } = req.query;
  try {
    res.status(200).json({
      success: true,
      message: "Review list fetched successfully",
      ...(await Review.paginate(
        {
          ...(req.search && {
            $or: [
              ...queryObjectBuilder(
                req.search,
                [
                  "message",
                  "product.titleEn",
                  "order.user.userName",
                  "order.user.fullName",
                  "order.user.phone",
                  "order.user.email",
                ],
                true
              ),
            ],
          }),
          ...fieldsQuery({
            author,
            product,
            isActive,
          }),
        },
        {
          ...req.pagination,
          populate: [
            {
              path: "order",
            },
            {
              path: "product",
            },
            {
              path: "author",
            },
          ],
          customLabels: {
            docs: "data",
            totalDocs: "total",
          },
        }
      )),
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
