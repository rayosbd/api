const { default: mongoose } = require("mongoose");
const Attachment = require("../../model/Attachment");
const Product = require("../../model/Product");
const ProductImage = require("../../model/ProductImages");
const ErrorResponse = require("../../utils/errorResponse");
const {
  fieldsQuery,
  queryObjectBuilder,
  flatSubquery,
} = require("../../utils/fieldsQuery");

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
  const { store, category, subcategory, variantType, isActive } = req.query;

  try {
    res.status(200).json({
      success: true,
      message: "Product list fetched successfully",
      ...(await Product.paginate(
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
                  "subcategory.titleEn",
                  "subcategory.titleBn",
                  "subcategory.slug",
                  "store.titleEn",
                  "store.titleBn",
                  "store.slug",
                ],
                true
              ),
            ],
          }),
          ...fieldsQuery({
            store,
            category,
            subcategory,
            variantType,
            isActive,
          }),
        },
        {
          ...req.pagination,
          populate: [
            {
              path: "category",
              select: "titleEn titleBn icon isActive slug",
            },
            {
              path: "subcategory",
              select: "titleEn titleBn icon isActive slug",
            },
            {
              path: "store",
              select: "image titleEn titleBn isActive slug",
            },
          ],
          select:
            "titleEn titleBn category subcategory slug store buyPrice sellPrice price image isActive",
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

exports.getByCategoryId = async (req, res, next) => {
  // Get Values
  const { category_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!category_id || !mongoose.Types.ObjectId.isValid(category_id))
    return next(new ErrorResponse("Please provide valid category id", 400));

  try {
    res.status(200).json({
      success: true,
      message: "Product list fetched successfully",
      ...(await Product.paginate(
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
                  "subcategory.titleEn",
                  "subcategory.titleBn",
                  "subcategory.slug",
                  "store.titleEn",
                  "store.titleBn",
                  "store.slug",
                ],
                true
              ),
            ],
          }),
          ...flatSubquery("category.isActive", true),
          ...flatSubquery("subcategory.isActive", true),
          ...flatSubquery("store.isActive", true),
          category: category_id,
          isActive: true,
        },
        {
          ...req.pagination,
          populate: [
            {
              path: "subcategory",
              select: "titleEn titleBn icon isActive slug",
            },
            {
              path: "store",
              select: "image titleEn titleBn isActive slug",
            },
          ],
          select:
            "titleEn titleBn subcategory store slug buyPrice sellPrice price image isActive",
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

exports.getBySubcategoryId = async (req, res, next) => {
  // Get Values
  const { category_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!category_id || !mongoose.Types.ObjectId.isValid(category_id))
    return next(new ErrorResponse("Please provide valid subcategory id", 400));

  try {
    res.status(200).json({
      success: true,
      message: "Product list fetched successfully",
      ...(await Product.paginate(
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
                  "subcategory.titleEn",
                  "subcategory.titleBn",
                  "subcategory.slug",
                  "store.titleEn",
                  "store.titleBn",
                  "store.slug",
                ],
                true
              ),
            ],
          }),
          ...flatSubquery("category.isActive", true),
          ...flatSubquery("subcategory.isActive", true),
          ...flatSubquery("store.isActive", true),
          subcategory: category_id,
          isActive: true,
        },
        {
          ...req.pagination,
          populate: [
            {
              path: "category",
              select: "titleEn titleBn icon isActive slug",
            },
            {
              path: "store",
              select: "image titleEn titleBn isActive slug",
            },
          ],
          select:
            "titleEn titleBn category store slug buyPrice sellPrice price image isActive",
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

exports.getByStoreId = async (req, res, next) => {
  // Get Values
  const { store_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!store_id || !mongoose.Types.ObjectId.isValid(store_id))
    return next(new ErrorResponse("Please provide valid store id", 400));

  try {
    res.status(200).json({
      success: true,
      message: "Product list fetched successfully",
      ...(await Product.paginate(
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
                  "subcategory.titleEn",
                  "subcategory.titleBn",
                  "subcategory.slug",
                  "store.titleEn",
                  "store.titleBn",
                  "store.slug",
                ],
                true
              ),
            ],
          }),
          ...flatSubquery("category.isActive", true),
          ...flatSubquery("subcategory.isActive", true),
          ...flatSubquery("store.isActive", true),
          store: store_id,
          isActive: true,
        },
        {
          ...req.pagination,
          populate: [
            {
              path: "category",
              select: "titleEn titleBn icon isActive slug",
            },
            {
              path: "subcategory",
              select: "titleEn titleBn icon isActive slug",
            },
          ],
          select:
            "titleEn titleBn category subcategory slug buyPrice sellPrice price image isActive",
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
  const { product_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
    return next(new ErrorResponse("Please provide valid product id", 400));

  try {
    const product = await Product.findById(product_id).populate([
      {
        path: "category",
        select: "titleEn titleBn icon isActive slug",
      },
      {
        path: "subcategory",
        select: "titleEn titleBn icon isActive slug",
      },
      {
        path: "variants",
      },
      {
        path: "images",
        select: "-product",
      },
      {
        path: "store",
        select: "image titleEn titleBn isActive slug",
      },
    ]);

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

exports.imagesByID = async (req, res, next) => {
  // Get Values
  const { product_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
    return next(new ErrorResponse("Please provide valid product id", 400));

  try {
    res.status(200).json({
      success: true,
      data: await ProductImage.find({
        product: product_id,
      }).select("-product"),
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.saveImages = async (req, res, next) => {
  // Get Values
  const { product_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
    return next(new ErrorResponse("Please provide valid product id", 400));

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
    await ProductImage.insertMany(
      Array.from(attachment, (per) => {
        return {
          image: per._id.toString(),
          product: product_id,
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
    await ProductImage.findByIdAndDelete(feed_id);
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