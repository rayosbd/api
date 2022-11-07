const mongoose = require("mongoose");

var ordertimelineSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Please Provide Order Id"],
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
    message: {
      type: String,
      default: function () {
        if (this.status === "Pending")
          return "The order is placed successfully.";
        else if (this.status === "Confirmed")
          return "The order is confirmed from the shop owner.";
        else if (this.status === "Shipped")
          return "The order is shipped to delivery service. Be prepare to receive it.";
        else if (this.status === "Delivered")
          return "The order is delivered successfully.";
        else if (this.status === "Canceled")
          return "Sorry! For some unfortunate reason the order had to be canceled from shop owner.";
        else if (this.status === "Returned")
          return "The ordered product is returned.";
        else return null;
      },
    },
  },
  {
    timestamps: true,
  }
);

const OrderTimeline = mongoose.model("OrderTimeline", ordertimelineSchema);
module.exports = OrderTimeline;
