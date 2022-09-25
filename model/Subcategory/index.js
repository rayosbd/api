const mongoose = require("mongoose");

var subcategorySchema = new mongoose.Schema(
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
      required: [true, "Please Provide Description"], // If Required
      trim: true,
    },
    descriptionBn: {
      type: String,
      trim: true,
      default: null,
    },
    icon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
      default: null,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please Provide Category Id"],
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const SubCategory = mongoose.model("Subcategory", subcategorySchema);
module.exports = SubCategory;

/**
 * @swagger
 * components:
 *  schemas:
 *   Subcategory:
 *     type: object
 *     required:
 *        - titleEn
 *        - descriptionEn
 *        - category
 *     properties:
 *       titleEn:
 *         type: string
 *       titleBn:
 *         type: string
 *       descriptionEn:
 *         type: string
 *       descriptionBn:
 *         type: string
 *       icon:
 *         type: string
 *       category:
 *         type: string
 *         description: Category Id
*/
