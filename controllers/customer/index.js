const { default: mongoose } = require("mongoose");
const User = require("../../model/User");
const { fieldsQuery, queryObjectBuilder } = require("../../utils/fieldsQuery");

exports.getAll = async (req, res, next) => {
  const { isVerified, isActive } = req.query;
  try {
    res.status(200).json({
      success: true,
      message: "Customer list fetched successfully",
      ...(await User.paginate(
        {
          ...(req.search && {
            $or: [
              ...queryObjectBuilder(
                req.search,
                ["userName", "fullName", "phone", "email"],
                true
              ),
            ],
          }),
          ...fieldsQuery({
            isVerified,
            isActive,
          }),
        },
        {
          ...req.pagination,
          populate: "totalOrders",
          select:
            "userName fullName phone email image totalOrders isVerified isActive",
          customLabels: {
            docs: "data",
            totalDocs: "total",
          },
        }
      )),
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.byID = async (req, res, next) => {
  // Get Values
  const { user_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!user_id || !mongoose.Types.ObjectId.isValid(user_id))
    return next(new ErrorResponse("Please provide valid customer id", 400));

  try {
    const user = await User.findById(user_id).select(
      "userName fullName phone email image isVerified isActive"
    );

    if (!user) return next(new ErrorResponse("No customer found", 404));

    res.status(200).json({
      success: true,
      data: user,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.activeInactive = async (req, res, next) => {
  // Get Values
  const { user_id } = req.params;

  if (!user_id || !mongoose.Types.ObjectId.isValid(user_id))
    return next(new ErrorResponse("Please provide valid customer id", 400));

  try {
    // Update User to DB
    const user = await User.findById(user_id);

    if (!user) return next(new ErrorResponse("No customer found", 404));

    await user.updateOne({
      isActive: !user.isActive,
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: `Customer ${
        user.isActive ? "deactivated" : "activated"
      } successfully`,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.update = async (req, res, next) => {
  // Get Values
  const { user_id } = req.params;

  if (!user_id || !mongoose.Types.ObjectId.isValid(user_id))
    return next(new ErrorResponse("Please provide valid customer id", 400));

  const { userName, fullName, email, avatarUrl, image } = req.body;

  try {
    // Update customer to DB
    const customer = await User.findByIdAndUpdate(user_id, {
      userName,
      fullName,
      email,
      avatarUrl,
      image,
    });

    if (customer)
      res.status(200).json({
        success: true,
        message: "Customer updated successfully",
        data: customer,
      });
    else return next(new ErrorResponse("Customer not found", 404));

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};
