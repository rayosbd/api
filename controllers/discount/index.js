const { default: mongoose } = require("mongoose");
const Discount = require("../../model/Discount");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");
const DiscountJunction = require("../../model/DiscountJunction");

exports.create = async (req, res, next) => {
	// Get Values
	const {
		titleEn,
		titleBn,
		descriptionEn,
		descriptionBn,
		icon,
		amount,
		startDate,
		endDate,
	} = req.body;

	try {
		// Store Discount to DB
		const discount = await Discount.create({
			titleEn,
			titleBn,
			descriptionEn,
			descriptionBn,
			icon,
			amount,
			startDate,
			endDate,
		});

		res.status(201).json({
			success: true,
			message: "Discount created successfully",
			data: discount,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.update = async (req, res, next) => {
	// Get Values
	const { discount_id } = req.params;

	if (!discount_id || !mongoose.Types.ObjectId.isValid(discount_id))
		return next(new ErrorResponse("Please provide valid discount id", 400));

	const {
		titleEn,
		titleBn,
		descriptionEn,
		descriptionBn,
		icon,
		amount,
		startDate,
		endDate,
	} = req.body;

	try {
		// Update Discount to DB
		const discount = await Discount.findByIdAndUpdate(
			discount_id,
			{
				titleBn,
				descriptionEn,
				descriptionBn,
				icon,
				amount,
				startDate,
				endDate,
			},
			{
				new: true,
			}
		);

		if (titleEn) {
			discount.titleEn = titleEn;
			discount.save();
		}

		if (discount)
			res.status(200).json({
				success: true,
				message: "Discount updated successfully",
				// data: discount,
			});
		else return next(new ErrorResponse("Discount not found", 404));

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.getAll = async (req, res, next) => {
	const { isActive } = req.query;
	try {
		res.status(200).json({
			success: true,
			message: "Discount list fetched successfully",
			...(await Discount.paginate(
				{
					...(req.search && {
						$or: [
							...queryObjectBuilder(
								req.search,
								["titleEn", "titleBn", "slug"],
								true
							),
						],
					}),
					...fieldsQuery({
						isActive,
					}),
				},
				{
					...req.pagination,
					// populate: "totalSubcategories totalProducts",
					// select:
					//   "titleEn titleBn icon isActive totalSubcategories totalProducts slug",
					sort: "-createdAt",
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

exports.aboutDiscount = async (req, res, next) => {
	// Get Values
	const { discount_id } = req.params;
	if (!discount_id || !mongoose.Types.ObjectId.isValid(discount_id))
		return next(new ErrorResponse("Please provide valid discount id", 400));

	try {
		// About Discount from DB
		const discount = await Discount.findById(discount_id);

		if (discount) {
			res.status(200).json({
				success: true,
				data: discount,
			});
		} else return next(new ErrorResponse("Discount not found", 404));

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.addProduct = async (req, res, next) => {
	// Get Values
	const { discount_id } = req.params;
	const productIds = req.query.products?.replaceAll(" ", "")?.split(",");
	if (!discount_id || !mongoose.Types.ObjectId.isValid(discount_id))
		return next(new ErrorResponse("Please provide valid discount id", 400));

	try {
		// Update Discount to DB
		const discount = await Discount.findById(discount_id);

		if (discount) {
			await DiscountJunction.insertMany(
				Array.from(productIds, (i) => ({
					discount: discount_id,
					product: i,
				}))
			);
			res.status(200).json({
				success: true,
				message: "Products added to discount successfully",
			});
		} else return next(new ErrorResponse("Discount not found", 404));

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.removeProduct = async (req, res, next) => {
	// Get Values
	const { discount_id } = req.params;
	const productIds = req.query.products?.replaceAll(" ", "")?.split(",");
	if (!discount_id || !mongoose.Types.ObjectId.isValid(discount_id))
		return next(new ErrorResponse("Please provide valid discount id", 400));

	try {
		// Update Discount to DB
		const discount = await Discount.findById(discount_id);

		if (discount) {
			await DiscountJunction.deleteMany({
				discount: discount_id,
				product: {
					$in: productIds,
				},
			});

			res.status(200).json({
				success: true,
				message: "Products removed from discount successfully",
			});
		} else return next(new ErrorResponse("Discount not found", 404));

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.activeInactive = async (req, res, next) => {
	// Get Values
	const { discount_id } = req.params;

	if (!discount_id || !mongoose.Types.ObjectId.isValid(discount_id))
		return next(new ErrorResponse("Please provide valid discount id", 400));

	try {
		// Update Subcategory to DB
		const discount = await Discount.findById(discount_id);

		if (!discount) return next(new ErrorResponse("No discount found", 404));

		await discount.updateOne({
			isActive: !discount.isActive,
		});
		await discount.save();

		res.status(200).json({
			success: true,
			message: `Discount ${
				discount.isActive ? "deactivated" : "activated"
			} successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
