exports.fieldsQuery = (args) => {
  return JSON.parse(JSON.stringify(args));
};

exports.searchQuery = (searchString, fields) => {
  return searchString
    ? Array.from(fields, (f) => {
        return {
          [f]: { $regex: searchString, $options: "i" },
        };
      })
    : [];
};