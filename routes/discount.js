const express = require("express");
const { protect, adminProtect } = require("../middleware/auth");
const { query } = require("../middleware/query");
const {
	getAll,
	create,
	update,
	addProduct,
	activeInactive,
	removeProduct,
	aboutDiscount,
} = require("../controllers/discount");
const { getByDiscountId, getByOfferId } = require("../controllers/product");
const router = express.Router();

// Get All API
/**
 * @swagger
 * /api/discount:
 *  get:
 *    tags: [Discount]
 *    summary: Get All Discounts
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

// Create API
/**
 * @swagger
 * /api/discount:
 *  post:
 *    tags: [Discount]
 *    summary: Create New Discount
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Discount'
 *
 *    responses:
 *      201:
 *        description: Creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").post(adminProtect, protect, create);

// Update API
/**
 * @swagger
 * /api/discount/{id}:
 *  patch:
 *    tags: [Discount]
 *    summary: Update Discount
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Discount Id
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
 *                  amount:
 *                     type: number
 *                  startDate:
 *                     type: string
 *                     format: date
 *                  endDate:
 *                     type: string
 *                     format: date
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
router.route("/:discount_id").patch(
	// adminProtect,
	// protect,
	update
);

// Enable Disable Discount API
/**
 * @swagger
 * /api/discount/{id}:
 *  put:
 *    tags: [Discount]
 *    summary: Enable Disable Discount
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Discount Id
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
router.route("/:discount_id").put(adminProtect, protect, activeInactive);

module.exports = router;

// Add Product to Discount API
/**
 * @swagger
 * /api/discount/{id}:
 *  post:
 *    tags: [Discount]
 *    summary: Add Product in Discount
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Discount Id
 *      - in: query
 *        name: products
 *        required: true
 *        type: string
 *        description: List of Product Id separated with comma
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
router.route("/:discount_id").post(adminProtect, protect, addProduct);

// Remove Product from Discount API
/**
 * @swagger
 * /api/discount/{id}:
 *  delete:
 *    tags: [Discount]
 *    summary: Remove Product from Discount
 *   # security:
 *   #   - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Discount Id
 *      - in: query
 *        name: products
 *        required: true
 *        type: string
 *        description: List of Product Id separated with comma
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
router.route("/:discount_id").delete(
	// adminProtect,
	// protect,
	removeProduct
);

// Get Product By Discount API
/**
 * @swagger
 * /api/discount/admin/{id}/products:
 *  get:
 *    tags: [Discount]
 *    summary: Get Product List by Discount ID (For Admin)
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Discount Id
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
router.route("/admin/:category_id/products").get(query, getByDiscountId);

// Get Product By Discount API for Users
/**
 * @swagger
 * /api/discount/{id}/products:
 *  get:
 *    tags: [Discount]
 *    summary: Get Product List by Discount ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Discount Id
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
router.route("/:category_id/products").get(query, getByOfferId);

// Discount Info API
/**
 * @swagger
 * /api/discount/{id}:
 *  get:
 *    tags: [Discount]
 *    summary: Discount Info
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Discount Id
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
router.route("/:discount_id").get(aboutDiscount);

module.exports = router;
