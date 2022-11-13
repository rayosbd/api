const Order = require("../../model/Order");
const Product = require("../../model/Product");
const User = require("../../model/User");

exports.dashboard = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Get data from dashboard successfully",
    });
  } catch (error) {
    // On Error
    // Send Error Response
    next(error);
  }
};

exports.order = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        total: await Order.count(),
        pending: await Order.find({ status: "Pending" }).count(),
        confirmed: await Order.find({ status: "Confirmed" }).count(),
        shipped: await Order.find({ status: "Shipped" }).count(),
        delivered: await Order.find({ status: "Delivered" }).count(),
        canceled: await Order.find({ status: "Canceled" }).count(),
        returned: await Order.find({ status: "Returned" }).count(),
      },
      message: "Get data from order successfully",
    });
  } catch (error) {
    // On Error
    // Send Error Response
    next(error);
  }
};

exports.customer = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        total: await User.count(),
        active: await User.find({ isActive: true }).count(),
        blocked: await User.find({ isActive: false }).count(),
      },
      message: "Get data from customer successfully",
    });
  } catch (error) {
    // On Error
    // Send Error Response
    next(error);
  }
};

exports.product = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        total: await Product.count(),
        published: await Product.find({ isActive: true }).count(),
        unpublished: await Product.find({ isActive: false }).count(),
      },
      message: "Get data from product successfully",
    });
  } catch (error) {
    // On Error
    // Send Error Response
    next(error);
  }
};

