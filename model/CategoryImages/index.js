const mongoose = require("mongoose");

var categoryImageSchema = new mongoose.Schema(
  {
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
      required: [true, "Please Provide Category Image"], // If Required
      default: null,
    },
  },
  { timestamps: true }
);

const CategoryImage = mongoose.model("CategoryImage", categoryImageSchema);
module.exports = CategoryImage;

/**
 * @swagger
 * components:
 *  schemas:
 *   CategoryImage:
 *     type: object
 *     required:
 *        - image
 *     properties:
 *       image:
 *         type: string
 *         description: Attachment Id
 */
