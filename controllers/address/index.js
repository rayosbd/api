const Address = require("../../model/Address");
const ErrorResponse = require("../../utils/errorResponse");

exports.getForUser = async (req, res, next) => {
	try {
		res.status(200).json({
			success: true,
			message: "Address list fetched successfully",
			data: await Address.find({ user: req.user._id })
				.populate("shippingFee")
				.select("label phone details type shippingFee"),
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.createOrUpdateAddress = async (req, res, next) => {
	// Get Values
	const { id, label, phone, lat, lng, details, type } = req.body;

	try {
		// Storing Address to DB
		const address = id
			? await Address.findOneAndUpdate(
					{ _id: id },
					{
						label,
						phone,
						lat,
						lng,
						details,
						type,
					},
					{ new: true }
			  )
			: await Address.create({
					label,
					phone,
					lat,
					lng,
					details,
					user: req.user._id,
					userModel: req.isAdmin ? "Admin" : "User",
					type,
			  });

		if (!address) throw new ErrorResponse("Address couldn't be saved", 404);

		res.status(201).json({
			success: true,
			message: "Address saved successfully",
			data: address,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
