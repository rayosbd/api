const mongoose = require("mongoose");
const { flatSubquery } = require("../../utils/fieldsQuery");

var discountSchema = new mongoose.Schema(
	{
		titleEn: {
			type: String,
			required: [true, "Please Provide Title"], // If Required
			unique: true,
			trim: true,
		},
		titleBn: {
			type: String,
			trim: true,
			default: null,
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
		icon: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Attachment",
			default: null,
		},
		amount: {
			type: Number,
			required: [true, "Please Provide Discount Amount"], // If Required
			//   default: 0,
		},
		startDate: {
			type: Date,
			required: [true, "Please Provide Start Date"], // If Required
		},
		endDate: {
			type: Date,
			required: [true, "Please Provide End Date"], // If Required
		},
		// slang: {
		//   type: String,
		//   required: [true, "Please Provide Slang"], // If Required
		//   trim: true,
		// },
		slug: {
			type: String,
			slug: ["titleEn"],
			unique: true,
			// permanent: true,
			index: true,
		},
		isActive: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{ timestamps: true }
);

discountSchema.virtual("images", {
	ref: "DiscountImage",
	localField: "_id",
	foreignField: "discount",
});

// discountSchema.virtual("products", {
// 	ref: "Product",
// 	localField: "_id",
// 	foreignField: "discount",
// 	match: {
// 		isActive: true,
// 		...flatSubquery("discount.isActive", true),
// 		...flatSubquery("category.isActive", true),
// 		...flatSubquery("subcategory.isActive", true),
// 		...flatSubquery("store.isActive", true),
// 	},
// 	options: {
// 		select:
// 			"titleEn titleBn category subcategory slug store buyPrice sellPrice price image isActive discount",
// 	},
// });

// discountSchema.virtual("totalProducts", {
// 	ref: "Product",
// 	localField: "_id",
// 	foreignField: "discount",
// 	count: true,
// });

discountSchema.set("toObject", { virtuals: true });
discountSchema.set("toJSON", { virtuals: true });

const Discount = mongoose.model("Discount", discountSchema);
module.exports = Discount;

/**
 * @swagger
 * components:
 *  schemas:
 *   Discount:
 *     type: object
 *     required:
 *        - titleEn
 *        - descriptionEn
 *        - amount
 *        - startDate
 *        - endDate
 *     properties:
 *       titleEn:
 *         type: string
 *       titleBn:
 *         type: string
 *       descriptionEn:
 *         type: string
 *       descriptionBn:
 *         type: string
 *       icon:
 *         type: string
 *       amount:
 *         type: number
 *       startDate:
 *         type: string
 *         format: date
 *       endDate:
 *         type: string
 *         format: date
 */
