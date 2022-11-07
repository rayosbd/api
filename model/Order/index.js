const mongoose = require("mongoose");

var orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Provide User Id"],
    },
    shipping: {
      phone: {
        type: String,
        validate: [/01\d{9}$/, "Invalid Phone Number"],
        required: [true, "Please Provide a Phone Number"],
      },
      lat: {
        type: String,
        default: null,
      },
      lng: {
        type: String,
        default: null,
      },
      address: {
        type: String,
        required: [true, "Please Provide an Address"],
      },
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
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Voucher",
      // default: null,
      type: String,
      default: null,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: [true, "Please Provide Price"], // If Required
      default: 0,
    },
  },
  { timestamps: true }
);

orderSchema.virtual("products", {
  ref: "OrderLine",
  localField: "_id",
  foreignField: "order",
});

orderSchema.virtual("timeline", {
  ref: "OrderTimeline",
  localField: "_id",
  foreignField: "order",
});

orderSchema.set("toObject", { virtuals: true });
orderSchema.set("toJSON", { virtuals: true });


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

/**
 * @swagger
 * components:
 *  schemas:
 *   OrderCreate:
 *     type: object
 *     properties:
 *       voucher:
 *         type: string
 *
 */
