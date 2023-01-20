const { default: mongoose } = require("mongoose");
const Discount = require("../../model/Discount");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");

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
