require("./config/database");
const Product = require("./model/Product");

const x = async (name) => {
	console.log(
		await Product.aggregate([
			{
				$lookup: {
					from: "discountjunctions",
					localField: "_id",
					foreignField: "product",
					as: "junction",
				},
			},
			{
				$match: {
					"junction.discount": { $ne: "63cae5746b844f446d611c2a" },
				},
			},
		])
	);
};
