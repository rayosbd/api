const mongoose = require("mongoose");

var storeImageSchema = new mongoose.Schema(
  {
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
      required: [true, "Please Provide Store Image"], // If Required
      default: null,
    },
  },
  { timestamps: true }
);

const StoreImage = mongoose.model("StoreImage", storeImageSchema);
module.exports = StoreImage;

/**
 * @swagger
 * components:
 *  schemas:
 *   StoreImage:
 *     type: object
 *     required:
 *        - image
 *     properties:
 *       image:
 *         type: string
 *         description: Attachment Id
 */
