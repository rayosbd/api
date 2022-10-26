const { default: mongoose } = require("mongoose");
const Product = require("../../model/Product");
const Variant = require("../../model/Variant");
const ErrorResponse = require("../../utils/errorResponse");

exports.create = async (req, res, next) => {
  // Get Values
  const {
    titleEn,
    titleBn,
    descriptionEn,
    descriptionBn,
    store,
    category,
    subcategory,
    buyPrice,
    sellPrice,
    variantType,
    image,
  } = req.body;

  try {
    // Store Product to DB
    const product = await Product.create({
      titleEn,
      titleBn,
      descriptionEn,
      descriptionBn,
      store,
      category,
      subcategory,
      buyPrice,
      sellPrice,
      variantType,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.update = async (req, res, next) => {
  // Get Values
  const { product_id } = req.params;

  if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
    return next(new ErrorResponse("Please provide valid product id", 400));

  const {
    titleEn,
    titleBn,
    descriptionEn,
    descriptionBn,
    store,
    category,
    subcategory,
    buyPrice,
    sellPrice,
    variantType,
    image,
  } = req.body;

  try {
    // Update Product to DB
    const product = await Product.findByIdAndUpdate(
      product_id,
      {
        titleEn,
        titleBn,
        descriptionEn,
        descriptionBn,
        store,
        category,
        subcategory,
        buyPrice,
        sellPrice,
        variantType,
        image,
      },
      {
        new: true,
      }
    );

    if (product)
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    else return next(new ErrorResponse("Product not found", 404));

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.activeInactive = async (req, res, next) => {
  // Get Values
  const { product_id } = req.params;

  if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
    return next(new ErrorResponse("Please provide valid product id", 400));

  try {
    // Update Product to DB
    const product = await Product.findById(product_id);

    if (!product) return next(new ErrorResponse("No product found", 404));

    await product.updateOne({
      isActive: !product.isActive,
    });
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${
        product.isActive ? "deactivated" : "activated"
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
  try {
    res.status(200).json({
      success: true,
      message: "Product list fetched successfully",
      data: await Product.find()
        .populate("category subcategory")
        .skip(skip)
        .limit(limit),
      total: await Product.find().count(),
      page,
      limit,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.getByCategoryId = async (req, res, next) => {
  // Get Values
  const { category_id } = req.params;
  const { skip, limit, page } = req.pagination;

  // mongoose.Types.ObjectId.isValid(id)
  if (!category_id || !mongoose.Types.ObjectId.isValid(category_id))
    return next(new ErrorResponse("Please provide valid category id", 400));

  try {
    res.status(200).json({
      success: true,
      message: "Product list fetched successfully",
      data: await Product.find({
        category: category_id,
      })
        .skip(skip)
        .limit(limit),
      total: await Product.find({
        category: category_id,
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

exports.getBySubcategoryId = async (req, res, next) => {
  // Get Values
  const { category_id } = req.params;
  const { skip, limit, page } = req.pagination;

  // mongoose.Types.ObjectId.isValid(id)
  if (!category_id || !mongoose.Types.ObjectId.isValid(category_id))
    return next(new ErrorResponse("Please provide valid subcategory id", 400));

  try {
    res.status(200).json({
      success: true,
      message: "Product list fetched successfully",
      data: await Product.find({
        subcategory: category_id,
      })
        .skip(skip)
        .limit(limit),
      total: await Product.find({
        subcategory: category_id,
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

exports.getByStoreId = async (req, res, next) => {
  // Get Values
  const { store_id } = req.params;
  const { skip, limit, page } = req.pagination;

  // mongoose.Types.ObjectId.isValid(id)
  if (!store_id || !mongoose.Types.ObjectId.isValid(store_id))
    return next(new ErrorResponse("Please provide valid store id", 400));

  try {
    res.status(200).json({
      success: true,
      message: "Product list fetched successfully",
      data: await Product.find({
        store: store_id,
      })
        .skip(skip)
        .limit(limit),
      total: await Product.find({
        store: store_id,
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
  const { product_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
    return next(new ErrorResponse("Please provide valid product id", 400));

  try {
    const product = await Product.findById(product_id).populate(
      "category subcategory store"
    );

    if (!product) return next(new ErrorResponse("No product found", 404));

    res.status(200).json({
      success: true,
      data: product,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};
