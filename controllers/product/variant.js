const { default: mongoose } = require("mongoose");
const Variant = require("../../model/Variant");
const ErrorResponse = require("../../utils/errorResponse");

exports.create = async (req, res, next) => {
  // Get Values
  const { product_id } = req.params;

  if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
    return next(new ErrorResponse("Please provide valid product id", 400));

  const { titleEn, titleBn, descriptionEn, descriptionBn, quantity } = req.body;

  try {
    // Store Variant to DB
    const variant = await Variant.create({
      titleEn,
      titleBn,
      descriptionEn,
      descriptionBn,
      product: product_id,
      quantity,
    });

    res.status(201).json({
      success: true,
      message: "Variant created successfully",
      data: variant,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.update = async (req, res, next) => {
  // Get Values
  const { variant_id } = req.params;

  if (!variant_id || !mongoose.Types.ObjectId.isValid(variant_id))
    return next(new ErrorResponse("Please provide valid variant id", 400));

  const { titleEn, titleBn, descriptionEn, descriptionBn, quantity } = req.body;

  try {
    // Update Variant to DB
    const variant = await Variant.findByIdAndUpdate(
      variant_id,
      {
        titleEn,
        titleBn,
        descriptionEn,
        descriptionBn,
        quantity,
      },
      {
        new: true,
      }
    );

    if (variant)
      res.status(200).json({
        success: true,
        message: "Variant updated successfully",
        data: variant,
      });
    else next(new ErrorResponse("Variant not found", 404));

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.getByProduct = async (req, res, next) => {
  // Get Values
  const { product_id } = req.params;

  if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
    return next(new ErrorResponse("Please provide valid product id", 400));

  try {
    res.status(200).json({
      success: true,
      message: "Variant list fetched successfully",
      data: await Variant.find({
        product: product_id,
      }),
      total: await Variant.find({
        product: product_id,
      }).count(),
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};
