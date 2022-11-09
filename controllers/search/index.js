const Product = require("../../model/Product");
const ErrorResponse = require("../../utils/errorResponse");
const { searchQuery } = require("../../utils/fieldsQuery");

exports.search = async (req, res, next) => {
  const { skip, limit, page } = req.pagination;
  try {
    if (!req.search) throw new ErrorResponse("Search query not found", 400);
    res.status(200).json({
      success: true,
      message: "Search results fetched successfully",
      data: await Product.find({
        $or: searchQuery(req.search, [
          "titleEn",
          "titleBn",
          "slug",
          "category.titleEn",
          "category.titleBn",
          "subcategory.titleEn",
          "subcategory.titleBn",
          "store.titleEn",
          "store.titleBn",
        ]),
        "category.isActive": true,
        "subcategory.isActive": true,
        "store.isActive": true,
        isActive: true,
      })
        .populate([
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
        ])
        .select(
          "titleEn titleBn category subcategory slug store buyPrice sellPrice price image isActive"
        )
        .skip(skip)
        .limit(limit),
      total: await Product.find({
        $or: searchQuery(req.search, [
          "titleEn",
          "titleBn",
          "slug",
          "category.titleEn",
          "category.titleBn",
          "subcategory.titleEn",
          "subcategory.titleBn",
          "store.titleEn",
          "store.titleBn",
        ]),
        "category.isActive": true,
        "subcategory.isActive": true,
        "store.isActive": true,
        isActive: true,
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
