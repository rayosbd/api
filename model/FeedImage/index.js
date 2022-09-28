const mongoose = require("mongoose");

var feedImageSchema = new mongoose.Schema(
  {
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
      required: [true, "Please Provide Feed Image"], // If Required
      default: null,
    },
  },
  { timestamps: true }
);

const FeedImage = mongoose.model("FeedImage", feedImageSchema);
module.exports = FeedImage;

/**
 * @swagger
 * components:
 *  schemas:
 *   FeedImage:
 *     type: object
 *     required:
 *        - image
 *     properties:
 *       image:
 *         type: string
 *         description: Attachment Id
 */
