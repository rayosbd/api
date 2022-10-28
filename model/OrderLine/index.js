const mongoose = require("mongoose");

var orderlineSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "Please Provide Order Id"],
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
  sellPrice: {
    type: Number,
    required: [true, "Please Provide Product Sell Price"], // If Required
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Please Provide Product Price"], // If Required
    default: 0,
  },
  discount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Discount",
    default: null,
  },
});

const OrderLine = mongoose.model("OrderLine", orderlineSchema);
module.exports = OrderLine;
