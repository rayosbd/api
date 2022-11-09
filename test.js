const { queryObjectBuilder } = require("./utils/fieldsQuery");

console.log(
  queryObjectBuilder(
    true,
    ["category.isActive", "subcategory.isActive", "store.isActive"],
    false,
    true
  )
);
