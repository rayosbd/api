const { default: mongoose } = require("mongoose");
const Subcategory = require("../../model/Subcategory");
const ErrorResponse = require("../../utils/errorResponse");
const { fieldsQuery, queryObjectBuilder } = require("../../utils/fieldsQuery");

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
    return next(new ErrorResponse("Please provide valid subcategory id", 400));

  const { titleEn, titleBn, descriptionEn, descriptionBn, category, icon } =
    req.body;

  try {
    // Update Subcategory to DB
    const subcategory = await Subcategory.findByIdAndUpdate(
      subcategory_id,
      {
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

    if (titleEn) {
      subcategory.titleEn = titleEn;
      subcategory.save();
    }

    if (subcategory)
      res.status(200).json({
        success: true,
        message: "Subcategory updated successfully",
        // data: subcategory,
      });
    else return next(new ErrorResponse("Subcategory not found", 404));

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
    return next(new ErrorResponse("Please provide valid subcategory id", 400));

  try {
    // Update Subcategory to DB
    const subcategory = await Subcategory.findById(subcategory_id);

    if (!subcategory)
      return next(new ErrorResponse("No subcategory found", 404));

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
  const { isActive, category } = req.query;
  try {
    res.status(200).json({
      success: true,
      message: "Subcategory list fetched successfully",
      ...(await Subcategory.paginate(
        {
          ...(req.search && {
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
                ],
                true
              ),
            ],
          }),
          ...fieldsQuery({
            category,
            isActive,
          }),
        },
        {
          ...req.pagination,
          populate: [
            {
              path: "category",
            },
            {
              path: "totalProducts",
            },
          ],
          select: "titleEn titleBn icon isActive category totalProducts",
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
  const { subcategory_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!subcategory_id || !mongoose.Types.ObjectId.isValid(subcategory_id))
    return next(new ErrorResponse("Please provide valid subcategory id", 400));

  try {
    const subcategory = await Subcategory.findById(subcategory_id).populate(
      "category icon"
    );

    if (!subcategory)
      return next(new ErrorResponse("No subcategory found", 404));

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
  const { skip, limit, page } = req.pagination;

  // mongoose.Types.ObjectId.isValid(id)
  if (!category_id || !mongoose.Types.ObjectId.isValid(category_id))
    return next(new ErrorResponse("Please provide valid category id", 400));

  try {
    const subcategory = await Subcategory.find({
      category: category_id,
      // isActive: true,
    })
      .populate([
        {
          path: "totalProducts",
        },
      ])
      .skip(skip)
      .limit(limit)
      .select("titleEn titleBn icon isActive totalProducts");

    res.status(200).json({
      success: true,
      data: subcategory,
      total: await Subcategory.find({
        category: category_id,
        // isActive: true,
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
