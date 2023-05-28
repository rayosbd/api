const { default: mongoose } = require("mongoose");
const Attachment = require("../../model/Attachment");
const Category = require("../../model/Category");
const FeedImage = require("../../model/FeedImage");
const ErrorResponse = require("../../utils/errorResponse");

// Get Feed Images API
exports.getImages = async (req, res, next) => {
	try {
		res.status(200).json({
			success: true,
			message: "Images fetched successfully",
			data: await FeedImage.find({}),
			total: await FeedImage.find({}).count(),
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.saveImages = async (req, res, next) => {
	let attachmentList = req.files
		? req.files.map((file) => {
				return {
					mimetype: file.mimetype,
					filename: file.filename,
					size: file.size,
				};
		  })
		: [];

	if (!attachmentList.length)
		return next(new ErrorResponse("No attachments added", 404));

	try {
		const attachment = await Attachment.insertMany(attachmentList);
		await FeedImage.insertMany(
			Array.from(attachment, (per) => {
				return {
					image: per._id.toString(),
				};
			})
		);

		res.status(201).json({
			success: true,
			message: "Attachments uploaded successfully",
		});
	} catch (error) {
		// On Error
		// Send Error Response
		next(error);
	}
};

exports.delImage = async (req, res, next) => {
	const { feed_id } = req.params;

	if (!feed_id || !mongoose.Types.ObjectId.isValid(feed_id))
		return next(new ErrorResponse("Please provide valid feed image id", 400));

	try {
		// const imageInfo =
		await FeedImage.findByIdAndDelete(feed_id);
		// await Attachment.findByIdAndDelete(imageInfo.image);
		res.status(200).json({
			success: true,
			message: "Feed image deleted successfully",
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

// News Feed API
exports.getFeedCategories = async (req, res, next) => {
	try {
		res.status(200).json({
			success: true,
			message: "Category list fetched successfully",
			data: await Category.find({ isActive: true })
				.populate("totalSubcategories subcategories totalProducts products")
				.select("titleEn titleBn icon slug totalSubcategories products id")
				.sort("titleEn"),
			total: await Category.find({ isActive: true }).count(),
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

const { createClient } = require("redis");

const client = createClient({
	url: "redis://127.0.0.1:6379",
});

client.on("error", (err) => console.log("Redis Client Error", err));

// News Feed API
exports.getFeedCategoriesNew = async (req, res, next) => {
	try {
		try {
			await client.connect();
		} catch {}

		var data;
		var sent = false;
		data = await client.get("feed");

		if (data) {
			res.status(200).json({
				success: true,
				message: "Category list fetched successfully",
				...JSON.parse(data),
			});
			sent = true;
		}
		// Auto Cache
		data = {
			data: await Category.find({ isActive: true })
				.populate("totalSubcategories subcategories totalProducts products")
				.select("titleEn titleBn icon slug totalSubcategories products id")
				.sort("titleEn"),
			total: await Category.find({ isActive: true }).count(),
		};

		await client.set("feed", JSON.stringify(data), "EX", 60 * 60 * 4);

		if (!sent)
			res.status(200).json({
				success: true,
				message: "Category list fetched successfully",
				...data,
			});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
