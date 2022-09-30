const User = require("../../model/User");
const ErrorResponse = require("../../utils/errorResponse");
const base32 = require("base32");
const Bookmark = require("../../model/Bookmark");

exports.register = async (req, res, next) => {
  // Get Values
  const { userName, fullName, phone, email, avatarUrl, image, password } =
    req.body;

  try {
    // Store User to DB
    const user = await User.create({
      userName,
      fullName,
      phone,
      email,
      avatarUrl,
      image,
      password,
    });

    // Send Success Response & Login Token
    await sendOTP(user, 201, res);

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone || !password)
    next(ErrorResponse("Please provide phone and password", 400));

  try {
    const user = await User.findOne({
      phone,
      isVerified: true,
      isActive: true,
    }).select("+password");

    // Send Error if No User Found
    if (!user) next(new ErrorResponse("Invalid credentials", 401));

    // Check if the password is corrent
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) next(new ErrorResponse("Incorrect password", 401));

    // Send Success Response
    sendToken(user, 200, res);
    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.forgetpassword = async (req, res, next) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({
      phone,
      // isVerified: true,
      isActive: true,
    });
    if (user) await sendOTP(user, 200, res);
    else next(new ErrorResponse("Invalid credentials", 401));
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.resetpassword = async (req, res, next) => {
  const { token, otp, password } = req.body;

  const uid = base32.decode(token);

  try {
    const user = await User.findById(uid);

    if (!user) next(new ErrorResponse("No user found", 404));

    if (!(await user.verifyTOTP(otp)))
      next(new ErrorResponse("Invalid OTP", 401));

    await user.updatePassword(password);

    res.status(204).json({
      success: true,
      message: "Reseted password sucessfully",
    });
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  const { token, otp } = req.body;

  const uid = base32.decode(token);

  try {
    const user = await User.findById(uid);

    if (!user) next(new ErrorResponse("No user found", 404));

    if (!(await user.verifyTOTP(otp)))
      next(new ErrorResponse("Invalid OTP", 401));

    await user.verifyUser();
    sendToken(user, 200, res);
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.validate = async (req, res, next) => {
  if (req.user)
    res.json({
      success: true,
      data: {
        ...req.user._doc,
        bookmarks: Array.from(
          (await Bookmark.find({ user: req.user._id })) || [],
          (bookmark) => bookmark._id
        ),
        totalBookmark: await Bookmark.find({ user: req.user._id }).count(),
      },
    });
  else {
    next(ErrorResponse("No user found!", 404));
  }
};

const sendToken = (user, statusCode, res) => {
  res.status(statusCode).json({
    success: true,
    token: user.getSignedToken(), // generates token
  });
};

const sendOTP = async (user, statusCode, res) => {
  res.status(statusCode).json({
    success: true,
    token: await user.getBase32ID(), // otp._id,
    otp: await user.getTOTP(), // newOTP,
  });
};


// https://youtu.be/YocRq-KesCM