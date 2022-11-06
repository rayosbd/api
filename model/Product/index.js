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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Please Provide Store Id"],
      trim: true,
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
      enum: {
        values: ["Size", "Variant", "Color"],
        message: "{VALUE} is not supported",
      },
      trim: true,
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
  {
    timestamps: true,
  }
);

productSchema.virtual("variants", {
  ref: "Variant",
  localField: "_id",
  foreignField: "product",
});

productSchema
  .virtual("quantity", {
    ref: "Variant",
    localField: "_id",
    foreignField: "product",
    match: {
      isActive: true,
    },
    // getters: true,
  })
  .set(function () {
    return 1;
  })
  .get(function (value, virtual, doc) {
    let quantity = 0;
    value?.forEach?.(function (variant) {
      quantity += variant.quantity;
    });
    return quantity;
  });

productSchema
  .virtual("rating", {
    ref: "Review",
    localField: "_id",
    foreignField: "product",
    match: {
      isActive: true,
    },
    // getters: true,
  })
  .set(function () {
    return 1;
  })
  .get(function (value, virtual, doc) {
    let rating = 0;
    let oneLength = 0;
    let twoLength = 0;
    let threeLength = 0;
    let fourLength = 0;
    let fiveLength = 0;
    value?.forEach?.(function (r) {
      if (r.rating > 4) {
        fiveLength++;
      } else if (r.rating > 3) {
        fourLength++;
      } else if (r.rating > 2) {
        threeLength++;
      } else if (r.rating > 1) {
        twoLength++;
      } else if (r.rating > 0) {
        oneLength++;
      }
      rating += r.rating;
    });
    return {
      total:
        parseFloat(parseFloat(rating / value?.length || 0).toFixed(1)) || 0,
      count: {
        all: value?.length || 0,
        one: oneLength,
        two: twoLength,
        three: threeLength,
        four: fourLength,
        five: fiveLength,
      },
    };
  });

productSchema
  .virtual("price", {
    // ref: "Discount",
    localField: "_id",
    foreignField: "product",
    // match: {
    // isActive: true,
    // },
    getters: true,
  })
  .set(function () {
    return 1;
  })
  .get(function (value, virtual, doc) {
    return doc.sellPrice;
  });

productSchema.pre(/^find/, async function () {
  this.populate("quantity price rating");
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

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
