const mongoose = require("mongoose");

var ordercacheSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, "Please Provide Order Info"],
  },
});

const OrderCache = mongoose.model("OrderCache", ordercacheSchema);
module.exports = OrderCache;
