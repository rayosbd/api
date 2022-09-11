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
    },
    descriptionEn: {
      type: String,
      required: [true, "Please Provide Title"], // If Required
      trim: true,
    },
    descriptionBn: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please Provide Category Id"],
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
 *       isActive:
 *         type: boolean
*/
