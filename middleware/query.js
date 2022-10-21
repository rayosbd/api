exports.query = async (req, res, next) => {
  const { limit, page } = req.query;

  req.pagination = {
    limit: parseInt(limit) || 10,
    page: parseInt(page) || 1,
    skip: ((parseInt(page) || 1) - 1) * limit,
  };
  next();
};
