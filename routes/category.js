const express = require("express");
const { upload } = require("../config/attachment");
const {
  create,
  update,
  activeInactive,
  getAll,
  byID,
  delImage,
  saveImages,
  imagesByID,
} = require("../controllers/category");
const { getByCategoryId } = require("../controllers/product");
const { byCategory } = require("../controllers/subcategory");
const { protect, adminProtect } = require("../middleware/auth");
const { query } = require("../middleware/query");
const router = express.Router();

// Get All API
/**
 * @swagger
 * /api/category:
 *  get:
 *    tags: [Category]
 *    summary: Get All Categories
 *    parameters:
 *      - in: query
 *        name: search
 *        type: string
 *      - in: query
 *        name: limit
 *        type: string
 *      - in: query
 *        name: page
 *        type: string
 *      - in: query
 *        name: isActive
 *        type: string
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").get(query, getAll);

// Get Category Images API
/**
 * @swagger
 * /api/category/{id}/images:
 *  get:
 *    tags: [Images]
 *    summary: Get Category Images
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Category Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:category_id/images").get(imagesByID);

// Save Category Images API
/**
 * @swagger
 * /api/category/{id}/images:
 *  post:
 *    tags: [Images]
 *    summary: Upload Category Images
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Category Id
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - Files[]
 *            properties:
 *              Files[]:
 *                type: array
 *                items:
 *                  type: string
 *                  format: binary
 *
 *    responses:
 *      201:
 *        description: Upload successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/:category_id/images").post(
  // adminProtect, protect,
  upload.array("Files[]"),
  saveImages
);

// Delete Category Image
/**
 * @swagger
 * /api/category/images/{id}:
 *  delete:
 *    tags: [Images]
 *    summary: Delete Category Image
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Image Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/images/:feed_id").delete(
  // adminProtect, protect,
  delImage
);
 

// Create API
/**
 * @swagger
 * /api/category:
 *  post:
 *    tags: [Category]
 *    summary: Create New Category
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Category'
 *
 *    responses:
 *      201:
 *        description: Creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").post(adminProtect, protect, create);

// Get Category API
/**
 * @swagger
 * /api/category/{id}:
 *  get:
 *    tags: [Category]
 *    summary: Get Category
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Category Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:category_id").get(byID);

// Get Subcategory List by Category API
/**
 * @swagger
 * /api/category/{id}/subcategories:
 *  get:
 *    tags: [Category]
 *    summary: Get Subcategory list using Category ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Category Id
 *      - in: query
 *        name: search
 *        type: string
 *      - in: query
 *        name: limit
 *        type: string
 *      - in: query
 *        name: page
 *        type: string
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:category_id/subcategories").get(query, byCategory);

// Get Product By Category API
/**
 * @swagger
 * /api/category/{id}/products:
 *  get:
 *    tags: [Category]
 *    summary: Get Product List by Category ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Category Id
 *      - in: query
 *        name: search
 *        type: string
 *      - in: query
 *        name: limit
 *        type: string
 *      - in: query
 *        name: page
 *        type: string
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:category_id/products").get(query, getByCategoryId);

// Update API
/**
 * @swagger
 * /api/category/{id}:
 *  patch:
 *    tags: [Category]
 *    summary: Update Category
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Category Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              properties:
 *                  titleEn:
 *                     type: string
 *                  titleBn:
 *                     type: string
 *                  descriptionEn:
 *                     type: string
 *                  descriptionBn:
 *                     type: string
 *                  icon:
 *                     type: string
 *
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:category_id").patch(adminProtect, protect, update);

// Update Status API
/**
 * @swagger
 * /api/category/{id}:
 *  put:
 *    tags: [Category]
 *    summary: Toggle Category Status 
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Category Id
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:category_id").put(adminProtect, protect, activeInactive);

module.exports = router;
