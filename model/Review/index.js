const mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Please Provide Order Id"],
    },
    orderline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderLine",
      required: [true, "Please Provide Orderline Id"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Please Provide Product Id"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "authorModel",
      required: [true, "Please Provide Author Id"],
    },
    authorModel: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    rating: {
      type: Number, // < 5
      min: [1, "Rating must be in 1 to 5"],
      max: [5, "Rating must be in 1 to 5"],
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
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

reviewSchema.set("toObject", { virtuals: true });
reviewSchema.set("toJSON", { virtuals: true });

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
 *        - rating
 *        - orderline
 *     properties:
 *       order:
 *         type: string
 *         description: order id
 *       orderline:
 *         type: string
 *         description: orderline id
 *       product:
 *         type: string
 *         description: product id
 *       rating:
 *         type: number
 *       message:
 *         type: string
 *       attachments:
 *         type: array
 *         items:
 *           type: string
 */
