const mongoose = require("mongoose");

var variantSchema = new mongoose.Schema(
  {
    titleEn: {
      type: String,
      required: [true, "Please Provide Title"], // If Required
      trim: true,
    },
    titleBn: {
      type: String,
      trim: true,
      default: null,
    },
    descriptionEn: {
      type: String,
      default: null,
      trim: true,
    },
    descriptionBn: {
      type: String,
      trim: true,
      default: null,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Please Provide Product Id"],
    },
    quantity: {
      type: Number,
      // required: [true, "Please Provide Quantity"], // If Required
      default: 0,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Variant = mongoose.model("Variant", variantSchema);
module.exports = Variant;

/**
 * @swagger
 * components:
 *  schemas:
 *   Variant:
 *     type: object
 *     required:
 *        - titleEn
 *        - productId
 *     properties:
 *       titleEn:
 *         type: string
 *       titleBn:
 *         type: string
 *       descriptionEn:
 *         type: string
 *       descriptionBn:
 *         type: string
 *       quantity:
 *         type: integer
 *         default: 0
 */
