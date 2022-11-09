const { searchQuery } = require("./utils/fieldsQuery");

console.log(
  searchQuery("hello", [
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
  ])
);
