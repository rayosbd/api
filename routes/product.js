const express = require("express");
const { upload } = require("../config/attachment");
const {
	create,
	update,
	getAll,
	activeInactive,
	byID,
	saveImages,
	delImage,
	imagesByID,
} = require("../controllers/product");
const { protect, adminProtect } = require("../middleware/auth");
const { query } = require("../middleware/query");
const router = express.Router();

// Get All API
/**
 * @swagger
 * /api/product:
 *  get:
 *    tags: [Product]
 *    summary: Get All Products
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
 *        name: store
 *        type: string
 *      - in: query
 *        name: category
 *        type: string
 *      - in: query
 *        name: subcategory
 *        type: string
 *      - in: query
 *        name: variantType
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

// Get Product API
/**
 * @swagger
 * /api/product/{id}:
 *  get:
 *    tags: [Product]
 *    summary: Get Product
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Product Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:product_id").get(byID);

// Get Product Images API
/**
 * @swagger
 * /api/product/{id}/images:
 *  get:
 *    tags: [Images]
 *    summary: Get Product Images
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Product Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:product_id/images").get(imagesByID);

// Save Product Images API
/**
 * @swagger
 * /api/product/{id}/images:
 *  post:
 *    tags: [Images]
 *    summary: Upload Product Images
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Product Id
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
router.route("/:product_id/images").post(
	// adminProtect, protect,
	upload.array("Files[]"),
	saveImages
);

// Delete Product Image
/**
 * @swagger
 * /api/product/images/{id}:
 *  delete:
 *    tags: [Images]
 *    summary: Delete Product Image
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
 * /api/product:
 *  post:
 *    tags: [Product]
 *    summary: Create New Product
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *
 *    responses:
 *      201:
 *        description: Creation successful
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *
 */
router.route("/").post(adminProtect, protect, create);

// Update API
/**
 * @swagger
 * /api/product/{id}:
 *  patch:
 *    tags: [Product]
 *    summary: Update Product
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Product Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *
 */
router.route("/:product_id").patch(adminProtect, protect, update);

// Update Status API
/**
 * @swagger
 * /api/product/{id}:
 *  put:
 *    tags: [Product]
 *    summary: Toggle Product Status
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Product Id
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:product_id").put(adminProtect, protect, activeInactive);

module.exports = router;
