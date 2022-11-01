const mongoose = require("mongoose");

var bookmarkSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Please Provide Product Id"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Provide User Id"],
    },
  },
  { timestamps: true }
);

bookmarkSchema.set("toObject", { virtuals: true });
bookmarkSchema.set("toJSON", { virtuals: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
module.exports = Bookmark;

/**
 * @swagger
 * components:
 *  schemas:
 *   Bookmark:
 *     type: object
 *     required:
 *        - user
 *        - product
 *     properties:
 *       user:
 *         type: string
 *         description: user id
 *       product:
 *         type: string
 *         description: product id
 */
