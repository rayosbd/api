const mongoose = require("mongoose");

var discountjunctionSchema = new mongoose.Schema(
	{
		discount: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Discount",
			default: null,
		},
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			default: null,
		},
	},
	{ timestamps: true }
);

discountjunctionSchema.set("toObject", { virtuals: true });
discountjunctionSchema.set("toJSON", { virtuals: true });

const DiscountJunction = mongoose.model(
	"DiscountJunction",
	discountjunctionSchema
);
module.exports = DiscountJunction;
