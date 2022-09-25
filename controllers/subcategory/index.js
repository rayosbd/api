const { default: mongoose } = require("mongoose");
const Subcategory = require("../../model/Subcategory");
const ErrorResponse = require("../../utils/errorResponse");

exports.create = async (req, res, next) => {
  // Get Values
  const { titleEn, titleBn, descriptionEn, descriptionBn, category, icon } =
    req.body;

  try {
    // Store Subcategory to DB
    const subcategory = await Subcategory.create({
      titleEn,
      titleBn,
      descriptionEn,
      descriptionBn,
      category,
      icon,
    });

    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      data: subcategory,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.update = async (req, res, next) => {
  // Get Values
  const { subcategory_id } = req.params;

  if (!subcategory_id || !mongoose.Types.ObjectId.isValid(subcategory_id))
    next(new ErrorResponse("Please provide valid subcategory id", 400));

  const { titleEn, titleBn, descriptionEn, descriptionBn, category, icon } =
    req.body;

  try {
    // Update Subcategory to DB
    const subcategory = await Subcategory.findByIdAndUpdate(
      subcategory_id,
      {
        titleEn,
        titleBn,
        descriptionEn,
        descriptionBn,
        category,
        icon,
      },
      {
        new: true,
      }
    );

    if (subcategory)
      res.status(200).json({
        success: true,
        message: "Subcategory updated successfully",
        data: subcategory,
      });
    else next(new ErrorResponse("Subcategory not found", 404));

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.activeInactive = async (req, res, next) => {
  // Get Values
  const { subcategory_id } = req.params;

  if (!subcategory_id || !mongoose.Types.ObjectId.isValid(subcategory_id))
    next(new ErrorResponse("Please provide valid subcategory id", 400));

  try {
    // Update Subcategory to DB
    const subcategory = await Subcategory.findById(subcategory_id);

    if (!subcategory) next(new ErrorResponse("No subcategory found", 404));

    await subcategory.updateOne({
      isActive: !subcategory.isActive,
    });
    await subcategory.save();

    res.status(200).json({
      success: true,
      message: `Subcategory ${
        subcategory.isActive ? "deactivated" : "activated"
      } successfully`,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Subcategory list fetched successfully",
      data: await Subcategory.find().populate("category"),
      total: await Subcategory.find().count(),
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.byID = async (req, res, next) => {
  // Get Values
  const { subcategory_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!subcategory_id || !mongoose.Types.ObjectId.isValid(subcategory_id))
    next(new ErrorResponse("Please provide valid subcategory id", 400));

  try {
    const subcategory = await Subcategory.findById(subcategory_id).populate(
      "category"
    );

    if (!subcategory) next(new ErrorResponse("No subcategory found", 404));

    res.status(200).json({
      success: true,
      data: subcategory,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.byCategory = async (req, res, next) => {
  // Get Values
  const { category_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!category_id || !mongoose.Types.ObjectId.isValid(category_id))
    next(new ErrorResponse("Please provide valid category id", 400));

  try {
    const subcategory = await Subcategory.find({
      category: category_id,
      // isActive: true,
    });

    res.status(200).json({
      success: true,
      data: subcategory,
      total: await Subcategory.find({
        category: category_id,
        // isActive: true,
      }).count(),
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};
