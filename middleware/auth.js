const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin");
const User = require("../model/User");
const ErrorResponse = require("../utils/errorResponse");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new ErrorResponse("Unauthorized User!", 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!(req.admin && decoded.admin))  return next(new ErrorResponse("Unauthorized User!", 401));

    const user = decoded.admin ? await Admin.findById(decoded.id) :  await User.findById(decoded.id);

    if (!user) return next(new ErrorResponse("No User Found!", 404));


    req.user = user;
    req.isAdmin = decoded.admin;

    next();
  } catch (error) {
    // error
    console.log();
    // return next();
    return next(new ErrorResponse(error));
  }
};

exports.adminProtect = async (req, res, next) => {
  req.admin = true;
  next()
}
