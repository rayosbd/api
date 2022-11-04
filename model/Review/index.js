const mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "Please Provide Order Id"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Please Provide Product Id"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please Provide Author Id"],
  },
  rating: {
    type: Number, // < 5
    required: [true, "Please Provide Rating"],
  },
  message: {
    type: String,
    default: null,
  },
  attachments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
      required: [true, "Please Provide Attachment Id"],
    },
  ],
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

/**
 * @swagger
 * components:
 *  schemas:
 *   Review:
 *     type: object
 *     required:
 *        - order
 *        - product
 *        - author
 *        - rating
 *     properties:
 *       order:
 *         type: string
 *         description: order id
 *       product:
 *         type: string
 *         description: product id
 *       author:
 *         type: string
 *         description: user id
 *       rating:
 *         type: number
 *       message:
 *         type: string
 *       attachments:
 *         type: array
 *         items:
 *           type: string
 */
