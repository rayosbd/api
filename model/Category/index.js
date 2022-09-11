const mongoose = require("mongoose");

var categorySchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;

/**
 * @swagger
 * components:
 *  schemas:
 *   Category:
 *     type: object
 *     required:
 *        - titleEn
 *        - descriptionEn
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
 *       isActive:
 *         type: boolean
*/
