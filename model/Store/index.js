const mongoose = require("mongoose");

var storeSchema = new mongoose.Schema(
  {
    titleEn: {
      type: String,
      required: [true, "Please Provide Title"], // If Required
      trim: true,
    },
    titleBn: {
      type: String,
      trim: true,
      default: null,
    },
    descriptionEn: {
      type: String,
      required: [true, "Please Provide Description"], // If Required
      trim: true,
    },
    descriptionBn: {
      type: String,
      trim: true,
      default: null,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "ownerModel",
      required: [true, "Please Provide Owner Id"],
    },
    ownerModel: {
      type: String,
      enum: ["Admin", "User"],
      default: "Admin",
    },
    slug: {
      type: String,
      slug: ["titleEn"],
      unique: true,
      // permanent: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;

/**
 * @swagger
 * components:
 *  schemas:
 *   Store:
 *     type: object
 *     required:
 *        - titleEn
 *        - descriptionEn
 *  #      - owner
 *     properties:
 *       titleEn:
 *         type: string
 *       titleBn:
 *         type: string
 *       descriptionEn:
 *         type: string
 *       descriptionBn:
 *         type: string
 *       address:
 *         type: string
 * #      owner:
 * #        type: string
 * #        description: Owner ID
 * #      isActive:
 * #        type: boolean
 * #        default: false
 * #      isVerified:
 * #        type: boolean
 * #        default: false
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   StoreUpdate:
 *     type: object
 *     properties:
 *       titleEn:
 *         type: string
 *       titleBn:
 *         type: string
 *       descriptionEn:
 *         type: string
 *       descriptionBn:
 *         type: string
 *       address:
 *         type: string
 */
