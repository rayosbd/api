const mongoose = require("mongoose");

var cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Provide User"],
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      required: [true, "Please Provide Variant Id"],
    },
    quantity: {
      type: Number,
      required: [true, "Please Provide Product Quantity"], // If Required
      default: 0,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
/**
 * @swagger
 * components:
 *  schemas:
 *   Cart:
 *     type: object
 *     required:
 *        - variant
 *        - user
 *        - quantity
 *     properties:
 *       variant:
 *         type: string
 *         description: variant id
 *       user:
 *         type: string
 *         description: user id
 *       quantity:
 *         type: number
 */
