exports.fieldsQuery = (args) => {
  return JSON.parse(JSON.stringify(args));
};

exports.searchQuery = (searchString, fields, obj) => {
  return searchString
    ? obj
      ? fields.reduce((obj, e) => {
          obj[e] = { $regex: searchString, $options: "i" };
          return obj;
        }, {})
      : Array.from(fields, (f) => {
          return this.flatSubquery(f, {
            $regex: searchString,
            $options: "i",
          });
        })
    : obj
    ? {}
    : [];
};

exports.flatSubquery = (path, value) => {
  if (typeof path === "string") {
    return this.flatSubquery(path.split("."), value);
  } else if (typeof path === "object") {
    if (path.length === 1)
      return {
        [path[0]]: value,
      };
    return {
      [path.shift()]: {
        $subquery: this.flatSubquery(path, value),
      },
    };
  }
};