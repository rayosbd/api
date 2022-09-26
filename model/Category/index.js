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
      // required: [true, "Please Provide Category Id"],
    },
    // slang: {
    //   type: String,
    //   required: [true, "Please Provide Slang"], // If Required
    //   trim: true,
    // },
    slug: {
      type: String,
      slug: ["titleEn"],
      unique: true,
      // permanent: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

categorySchema.virtual("totalSubcategories", {
  ref: "Subcategory",
  localField: "_id",
  foreignField: "category",
  count: true,
});

categorySchema.virtual("subcategories", {
  ref: "Subcategory",
  localField: "_id",
  foreignField: "category",
});

categorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
});

categorySchema.set("toObject", { virtuals: true });
categorySchema.set("toJSON", { virtuals: true });

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
*/
