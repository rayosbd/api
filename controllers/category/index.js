const { default: mongoose } = require("mongoose");
const Category = require("../../model/Category");
const ErrorResponse = require("../../utils/errorResponse");
const { fieldsQuery } = require("../../utils/fieldsQuery");

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
  const { skip, limit, page } = req.pagination;
  const { isActive } = req.query;
  try {
    const category = await Category.find({
      ...fieldsQuery({
        isActive,
      }),
    })
      .populate("totalSubcategories totalProducts")
      .skip(skip)
      .limit(limit)
      .select(
        "titleEn titleBn icon isActive totalSubcategories totalProducts slug"
      );
    res.status(200).json({
      success: true,
      message: "Category list fetched successfully",
      data: category,
      total: await Category.find({
        ...fieldsQuery({
          isActive,
        }),
      }).count(),
      page,
      limit,
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
      "icon totalSubcategories totalProducts"
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
