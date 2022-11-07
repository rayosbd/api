const mongoose = require("mongoose");

var addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userModel",
      required: [true, "Please Provide User Id"],
    },
    userModel: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    label: {
      type: String,
      required: [true, "Please Provide Title"],
    },
    phone: {
      type: String,
      validate: [/01\d{9}$/, "Invalid Phone Number"],
      default: null,
    },
    lat: {
      type: String,
      default: null,
    },
    lng: {
      type: String,
      default: null,
    },
    details: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;

/**
 * @swagger
 * components:
 *  schemas:
 *   Address:
 *     type: object
 *     required:
 *        - title
 *        - phone
 *        - details
 *     properties:
 *        id:
 *          type: string
 *        label:
 *          type: string
 *        phone:
 *          type: string
 *          unique: true
 *          pattern: 01\d{9}$
 *  #      lat:
 *  #        type: string
 *  #      lng:
 *  #        type: string
 *        details:
 *          type: string
 */
