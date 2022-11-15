const mongoose = require("mongoose");

var productImageSchema = new mongoose.Schema(
  {
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
      required: [true, "Please Provide Product Image"], // If Required
      default: null,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Please Provide Product Id"],
    },
  },
  { timestamps: true }
);

const ProductImage = mongoose.model("ProductImage", productImageSchema);
module.exports = ProductImage;

/**
 * @swagger
 * components:
 *  schemas:
 *   ProductImage:
 *     type: object
 *     required:
 *        - image
 *     properties:
 *       image:
 *         type: string
 *         description: Attachment Id
 */
