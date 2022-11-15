const { default: mongoose } = require("mongoose");
const Attachment = require("../../model/Attachment");
const Category = require("../../model/Category");
const CategoryImage = require("../../model/CategoryImages");
const ErrorResponse = require("../../utils/errorResponse");
const { fieldsQuery, queryObjectBuilder } = require("../../utils/fieldsQuery");

exports.create = async (req, res, next) => {
  // Get Values
  const { titleEn, titleBn, descriptionEn, descriptionBn, icon } = req.body;

  try {
    // Store Category to DB
    const category = await Category.create({
      titleEn,
      titleBn,
      descriptionEn,
      descriptionBn,
      icon,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.update = async (req, res, next) => {
  // Get Values
  const { category_id } = req.params;

  if (!category_id || !mongoose.Types.ObjectId.isValid(category_id))
    return next(new ErrorResponse("Please provide valid category id", 400));

  const { titleEn, titleBn, descriptionEn, descriptionBn, icon } = req.body;

  try {
    // Update Category to DB
    const category = await Category.findByIdAndUpdate(
      category_id,
      {
        titleEn,
        titleBn,
        descriptionEn,
        descriptionBn,
        icon,
      },
      {
        new: true,
      }
    );

    if (category)
      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    else return next(new ErrorResponse("Category not found", 404));

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.activeInactive = async (req, res, next) => {
  // Get Values
  const { category_id } = req.params;

  if (!category_id || !mongoose.Types.ObjectId.isValid(category_id))
    return next(new ErrorResponse("Please provide valid category id", 400));

  try {
    // Update Category to DB
    const category = await Category.findById(category_id);

    if (!category) return next(new ErrorResponse("No category found", 404));

    await category.updateOne({
      isActive: !category.isActive,
    });
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category ${
        category.isActive ? "deactivated" : "activated"
      } successfully`,
    });

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
      message: "Category list fetched successfully",
      ...(await Category.paginate(
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
          populate: "totalSubcategories totalProducts",
          select:
            "titleEn titleBn icon isActive totalSubcategories totalProducts slug",
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

exports.byID = async (req, res, next) => {
  // Get Values
  const { category_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!category_id || !mongoose.Types.ObjectId.isValid(category_id))
    return next(new ErrorResponse("Please provide valid category id", 400));

  try {
    const category = await Category.findById(category_id).populate(
      "icon totalSubcategories totalProducts images"
    );

    if (!category) return next(new ErrorResponse("No category found", 404));

    res.status(200).json({
      success: true,
      data: category,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.imagesByID = async (req, res, next) => {
  // Get Values
  const { category_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!category_id || !mongoose.Types.ObjectId.isValid(category_id))
    return next(new ErrorResponse("Please provide valid category id", 400));

  try {
    res.status(200).json({
      success: true,
      data: await CategoryImage.find({
        category: category_id,
      }).select("-category"),
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.saveImages = async (req, res, next) => {
  // Get Values
  const { category_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!category_id || !mongoose.Types.ObjectId.isValid(category_id))
    return next(new ErrorResponse("Please provide valid category id", 400));

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
    await CategoryImage.insertMany(
      Array.from(attachment, (per) => {
        return {
          image: per._id.toString(),
          category: category_id,
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
    return next(new ErrorResponse("Please provide valid image id", 400));

  try {
    // const imageInfo =
    await CategoryImage.findByIdAndDelete(feed_id);
    // await Attachment.findByIdAndDelete(imageInfo.image);
    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};