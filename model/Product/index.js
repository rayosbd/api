const mongoose = require("mongoose");
const { flatSubquery } = require("../../utils/fieldsQuery");
const { beforeThisMinute, afterThisMinute } = require("mongo-date-query");
const { countPrice } = require("../../utils/countSellPrice");

var productSchema = new mongoose.Schema(
	{
		titleEn: {
			type: String,
			required: [true, "Please Provide Title"], // If Required
			trim: true,
		},
		titleBn: {
			type: String,
			trim: true,
			default: null,
		},
		slug: {
			type: String,
			slug: ["titleEn"],
			unique: true,
			// permanent: true,
			index: true,
		},
		descriptionEn: {
			type: String,
			required: [true, "Please Provide Description"], // If Required
			trim: true,
		},
		descriptionBn: {
			type: String,
			trim: true,
			default: null,
		},
		store: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Store",
			required: [true, "Please Provide Store Id"],
			trim: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: [true, "Please Provide Category Id"],
		},
		subcategory: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Subcategory",
			default: null,
			//   required: [true, "Please Provide Subcategory Id"],
		},
		buyPrice: {
			type: Number,
			required: [true, "Please Provide Buying Price"], // If Required
			//   default: 0,
		},
		sellPrice: {
			type: Number,
			required: [true, "Please Provide Selling Price"], // If Required
			//   default: 0,
		},
		variantType: {
			type: String,
			required: [true, "Please Provide Variant Type"], // If Required
			enum: {
				values: ["Size", "Variant", "Color"],
				message: "{VALUE} is not supported",
			},
			trim: true,
		},
		image: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Attachment",
			default: null,
		},
		isActive: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

productSchema.virtual("variants", {
	ref: "Variant",
	localField: "_id",
	foreignField: "product",
});

productSchema.virtual("images", {
	ref: "ProductImage",
	localField: "_id",
	foreignField: "product",
});

productSchema
	.virtual("quantity", {
		ref: "Variant",
		localField: "_id",
		foreignField: "product",
		match: {
			isActive: true,
		},
		// getters: true,
	})
	.set(function () {
		return 1;
	})
	.get(function (value) {
		let quantity = 0;
		value?.forEach?.(function (variant) {
			quantity += variant.quantity || 0;
		});
		return quantity;
	});

productSchema
	.virtual("sold", {
		ref: "Variant",
		localField: "_id",
		foreignField: "product",
		match: {
			isActive: true,
		},
		// getters: true,
	})
	.set(function () {
		return 1;
	})
	.get(function (value) {
		let sold = 0;
		value?.forEach?.(function (variant) {
			sold += variant.sold || 0;
		});
		return sold;
	});

productSchema
	.virtual("rating", {
		ref: "Review",
		localField: "_id",
		foreignField: "product",
		match: {
			isActive: true,
		},
	})
	.set(function () {
		return 1;
	})
	.get(function (value, virtual, doc) {
		let rating = 0;
		let oneLength = 0;
		let twoLength = 0;
		let threeLength = 0;
		let fourLength = 0;
		let fiveLength = 0;
		value?.forEach?.(function (r) {
			if (r.rating > 4) {
				fiveLength++;
			} else if (r.rating > 3) {
				fourLength++;
			} else if (r.rating > 2) {
				threeLength++;
			} else if (r.rating > 1) {
				twoLength++;
			} else if (r.rating > 0) {
				oneLength++;
			}
			rating += r.rating;
		});
		return {
			total:
				parseFloat(parseFloat(rating / value?.length || 0).toFixed(1)) || 0,
			count: {
				all: value?.length || 0,
				one: oneLength,
				two: twoLength,
				three: threeLength,
				four: fourLength,
				five: fiveLength,
			},
		};
	});

productSchema
	.virtual("price", {
		ref: "DiscountJunction",
		localField: "_id",
		foreignField: "product",
		options: {
			populate: "discount",
		},
		match: {
			$and: [
				// { ...flatSubquery("discount.startDate", beforeThisMinute()) },
				// { ...flatSubquery("discount.endDate", afterThisMinute()) },
				{ ...flatSubquery("discount.isActive", true) },
			],
		},
		getters: true,
	})
	.set(function () {
		return 1;
	})
	.get(function (value, _virtual, doc) {
		let largestDiscount = 0;

		value?.map((x) => {
			if (!largestDiscount || x.discount.amount >= largestDiscount)
				largestDiscount = x.discount.amount;
		});

		return countPrice(doc.sellPrice, largestDiscount);
	});

productSchema
	.virtual("discount", {
		ref: "DiscountJunction",
		localField: "_id",
		foreignField: "product",
		options: {
			populate: "discount",
		},
		match: {
			$and: [
				// { ...flatSubquery("discount.startDate", beforeThisMinute()) },
				// { ...flatSubquery("discount.endDate", afterThisMinute()) },
				{ ...flatSubquery("discount.isActive", true) },
			],
		},
		getters: true,
	})
	.set(function () {
		return 1;
	})
	.get(function (value) {
		let largestDiscount;

		value?.map((x) => {
			if (!largestDiscount || x.discount.amount >= largestDiscount?.amount)
				largestDiscount = x.discount;
		});

		return largestDiscount
			? {
					_id: largestDiscount?._id,
					titleEn: largestDiscount?.titleEn,
					titleBn: largestDiscount?.titleBn,
					icon: largestDiscount?.icon,
					amount: largestDiscount?.amount,
					startDate: largestDiscount?.startDate,
					endDate: largestDiscount?.endDate,
					isActive: largestDiscount?.isActive,
					slug: largestDiscount?.slug,
			  }
			: null;
	});

productSchema.pre(/^find/, async function () {
	this.populate("quantity price sold rating discount");
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

/**
 * @swagger
 * components:
 *  schemas:
 *   Product:
 *     type: object
 *     required:
 * #       - store
 *        - variantType
 *        - titleEn
 *        - descriptionEn
 *        - category
 *        - buyPrice
 *        - sellPrice
 *     properties:
 *       titleEn:
 *         type: string
 *       titleBn:
 *         type: string
 *       descriptionEn:
 *         type: string
 *       descriptionBn:
 *         type: string
 *       store:
 *         type: string
 *       category:
 *         type: string
 *         description: Category Id
 *       subcategory:
 *         type: string
 *         description: Sub Category Id
 *       buyPrice:
 *         type: number
 *       sellPrice:
 *         type: number
 * #      discount:
 * #        type: object
 * #        required:
 * #            - discountType
 * #            - amount
 * #        properties:
 * #            discountType:
 * #              type: string
 * #              enum: [Percentage, Amount]
 * #            amount:
 * #              type: number
 *       variantType:
 *         type: string
 *         enum: [Size, Variant, Color]
 *       image:
 *         type: string
 * #      multiImages:
 * #        type: array
 * #        items:
 * #          type: string
 * #      keywords:
 * #        type: array
 * #        items:
 * #          type: string
 * #      isActive:
 * #        type: boolean
 */
