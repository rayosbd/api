const mongoose = require("mongoose");

var ordercacheSchema = new mongoose.Schema({
  carts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  ],
  paymentMethod: {
    type: String,
    required: [true, "Please Provide Payment Method"], // If Required
    enum: {
      values: ["COD"],
      message: "{VALUE} is not supported as payment method",
    },
  },
  shipping: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Address",
    // required: [true, "Please Provide Address"],
    type: String,
  },
  shippingFee: {
    type: Number,
    required: [true, "Please Provide Shipping Fee"], // If Required
    default: 0,
  },
});

const OrderCache = mongoose.model("OrderCache", ordercacheSchema);
module.exports = OrderCache;
