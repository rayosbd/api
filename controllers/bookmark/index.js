const { default: mongoose } = require("mongoose");
const Bookmark = require("../../model/Bookmark");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, flatSubquery } = require("../../utils/fieldsQuery");

exports.getForUser = async (req, res, next) => {
	try {
		res.status(200).json({
			success: true,
			message: "Bookmark list fetched successfully",
			...(await Bookmark.paginate(
				{
					...(req.search && {
						$or: [
							...queryObjectBuilder(
								req.search,
								[
									"product.titleEn",
									"product.titleBn",
									"product.slug",
									"product.category.titleEn",
									"product.category.titleBn",
									"product.category.slug",
									"product.subcategory.titleEn",
									"product.subcategory.titleBn",
									"product.subcategory.slug",
									"product.store.titleEn",
									"product.store.titleBn",
									"product.store.slug",
								],
								true
							),
						],
					}),
					$and: [
						...queryObjectBuilder(
							true,
							[
								"product.category.isActive",
								"product.subcategory.isActive",
								"product.store.isActive",
								"product.isActive",
							],
							false
						),
					],
					user: req.user._id,
				},
				{
					...req.pagination,
					populate: [
						{
							path: "product",
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
								"titleEn titleBn category subcategory slug store sellPrice price image isActive",
						},
					],
					sort: "-createdAt",
					select: "product",
					customLabels: {
						docs: "data",
						totalDocs: "total",
					},
				}
			)),
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.createOrDelete = async (req, res, next) => {
	const user = req.user;
	const { product_id } = req.params;

	if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
		return next(new ErrorResponse("Please provide valid product id", 400));

	try {
		const bookmark = await Bookmark.findOneAndDelete({
			user: user._id,
			product: product_id,
		});

		if (!bookmark)
			await Bookmark.create({
				user: user._id,
				product: product_id,
			});

		res.status(200).json({
			success: true,
			message: `Product ${
				!bookmark ? "added to" : "removed from"
			} wishlist successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
