const mongoose = require("mongoose");

var orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Provide User Id"],
    },
    shipping: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Please Provide Address"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Please Provide Payment Method"], // If Required
      enum: {
        values: ["COD"],
        message: "{VALUE} is not supported as payment method",
      },
    },
    status: {
      type: String,
      required: [true, "Please Provide Status"], // If Required
      enum: {
        values: [
          "Pending",
          "Confirmed",
          "Shipped",
          "Delivered",
          "Canceled",
          "Returned",
        ],
        message: "{VALUE} is not supported as status",
      },
    },
    totalSellPrice: {
      type: Number,
      required: [true, "Please Provide Total Sell Price"], // If Required
      default: 0,
    },
    shippingFee: {
      type: Number,
      required: [true, "Please Provide Shipping Fee"], // If Required
      default: 0,
    },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
      default: null,
    },
    totalPrice: {
      type: Number,
      required: [true, "Please Provide Price"], // If Required
      default: 0,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

/**
 * @swagger
 * components:
 *  schemas:
 *   Order:
 *     type: object
 *     required:
 *        - carts
 *        - paymentMethod
 *     properties:
 *       carts:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             quantity:
 *               type: number
 *       paymentMethod:
 *         type: string
 *         enum: [COD]
 *       shipping:
 *         type: string
 *         description: address id
 *       voucher:
 *         type: string
 *
 */
