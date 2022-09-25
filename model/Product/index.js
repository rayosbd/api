const mongoose = require("mongoose");

var productSchema = new mongoose.Schema(
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
    slug: {
      type: String,
      slug: ["titleEn"],
      unique: true,
      // permanent: true,
      index: true,
    },
    descriptionEn: {
      type: String,
      required: [true, "Please Provide Description"], // If Required
      trim: true,
    },
    descriptionBn: {
      type: String,
      trim: true,
      default: null,
    },
    store: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please Provide Category Id"],
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      default: null,
      //   required: [true, "Please Provide Subcategory Id"],
    },
    buyPrice: {
      type: Number,
      required: [true, "Please Provide Buying Price"], // If Required
      //   default: 0,
    },
    sellPrice: {
      type: Number,
      required: [true, "Please Provide Selling Price"], // If Required
      //   default: 0,
    },
    variantType: {
      type: String,
      required: [true, "Please Provide Variant Type"], // If Required
      enum: ["Size", "Variant", "Color"],
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
      default: null,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

/**
 * @swagger
 * components:
 *  schemas:
 *   Product:
 *     type: object
 *     required:
 * #       - store
 *        - variantType
 *        - titleEn
 *        - descriptionEn
 *        - category
 *        - buyPrice
 *        - sellPrice
 *     properties:
 *       titleEn:
 *         type: string
 *       titleBn:
 *         type: string
 *       descriptionEn:
 *         type: string
 *       descriptionBn:
 *         type: string
 *       store:
 *         type: string
 *       category:
 *         type: string
 *         description: Category Id
 *       subcategory:
 *         type: string
 *         description: Sub Category Id
 *       buyPrice:
 *         type: number
 *       sellPrice:
 *         type: number
 * #      discount:
 * #        type: object
 * #        required:
 * #            - discountType
 * #            - amount
 * #        properties:
 * #            discountType:
 * #              type: string
 * #              enum: [Percentage, Amount]
 * #            amount:
 * #              type: number
 *       variantType:
 *         type: string
 *         enum: [Size, Variant, Color]
 *       image:
 *         type: string
 * #      multiImages:
 * #        type: array
 * #        items:
 * #          type: string
 * #      keywords:
 * #        type: array
 * #        items:
 * #          type: string
 * #      isActive:
 * #        type: boolean
 */
