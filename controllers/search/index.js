const Product = require("../../model/Product");
const ErrorResponse = require("../../utils/errorResponse");
const { searchQuery } = require("../../utils/fieldsQuery");

exports.search = async (req, res, next) => {
  const { skip, limit, page } = req.pagination;
  try {
    if (!req.search) throw new ErrorResponse("Search query not found", 400);

    const query = {
      $or: [
        ...searchQuery(req.search, [
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
        ]),
      ],
      "category.isActive": true,
      "subcategory.isActive": true,
      "store.isActive": true,
      isActive: true,
    };

    const squery = {
      $or: searchQuery(req.search, [
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
      ]),
      category: {
        $subquery: {
          isActive: true,
        },
      },
      subcategory: {
        $subquery: {
          isActive: true,
        },
      },
      store: {
        $subquery: {
          isActive: true,
        },
      },
      isActive: true,
    };

    res.status(200).json({
      success: true,
      // squery,
      message: "Search results fetched successfully",
      ...(await Product.paginate(squery, {
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
        page,
        limit,
        customLabels: {
          docs: "data",
          totalDocs: "total",
        },
      })),
      // .skip(skip)
      // .limit(limit),
      // total: [...(await Product.find(query))].length,
      // page,
      // limit,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};
