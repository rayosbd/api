exports.query = async (req, res, next) => {
  const { limit, page } = req.query;

  req.pagination = {
    limit: limit && parseInt(limit) ? parseInt(limit) : 10,
    page: page && parseInt(page) > 1 ? parseInt(page) : 1,
    skip:
      ((page && parseInt(page) > 1 ? parseInt(page) : 1) - 1) *
      (limit && parseInt(limit) ? parseInt(limit) : 10),
  };
  next();
};
