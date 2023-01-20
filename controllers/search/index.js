const Product = require("../../model/Product");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, flatSubquery } = require("../../utils/fieldsQuery");

exports.search = async (req, res, next) => {
	try {
		if (!req.search) throw new ErrorResponse("Search query not found", 400);
		const query = {
			$or: [
				...queryObjectBuilder(
					req.search,
					[
						"titleEn",
						"titleBn",
						"slug",
						"category.titleEn",
						"category.titleBn",
						"category.slug",
						"subcategory.titleEn",
						"subcategory.titleBn",
						"subcategory.slug",
						"store.titleEn",
						"store.titleBn",
						"store.slug",
					],
					true
				),
			],
			// ...queryObjectBuilder(
			//   true,
			//   ["category.isActive", "subcategory.isActive", "store.isActive"],
			//   false,
			//   true
			// ),
			// ...flatSubquery("sold.$lt", 5),
			...flatSubquery("category.isActive", true),
			...flatSubquery("subcategory.isActive", true),
			...flatSubquery("store.isActive", true),
			isActive: true,
		};

		res.status(200).json({
			success: true,
			// squery,
			message: "Search results fetched successfully",
			...(await Product.paginate(query, {
				...req.pagination,
				populate: [
					{
						path: "category",
						select: "titleEn titleBn icon isActive slug",
					},
					{
						path: "subcategory",
						select: "titleEn titleBn icon isActive slug",
					},
					{
						path: "store",
						select: "image titleEn titleBn isActive slug",
					},
				],
				select:
					"titleEn titleBn category subcategory slug store buyPrice sellPrice price image isActive",
				customLabels: {
					docs: "data",
					totalDocs: "total",
				},
			})),
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
