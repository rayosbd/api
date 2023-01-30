const express = require("express");
const {
	create,
	getByProduct,
	update,
	activeInactive,
} = require("../controllers/product/variant");
const { protect, adminProtect } = require("../middleware/auth");
const router = express.Router();

// Get Product Variants API
/**
 * @swagger
 * /api/variant/{productId}:
 *  get:
 *    tags: [Product]
 *    summary: Get Product Variants
 *    parameters:
 *      - in: path
 *        name: productId
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
router.route("/:product_id").get(getByProduct);

// Create API
/**
 * @swagger
 * /api/variant/{productId}:
 *  post:
 *    tags: [Product]
 *    summary: Create New Variant
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: productId
 *        required: true
 *        type: string
 *        description: Product Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Variant'
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
router.route("/:product_id").post(adminProtect, protect, create);

// Update API
/**
 * @swagger
 * /api/variant/{id}:
 *  patch:
 *    tags: [Product]
 *    summary: Update Variant
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Variant Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Variant'
 *
 *    responses:
 *      200:
 *        description: Creation successful
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *
 */
router.route("/:variant_id").patch(adminProtect, protect, update);

// Update Status API
/**
 * @swagger
 * /api/variant/{id}:
 *  put:
 *    tags: [Product]
 *    summary: Toggle Variant Status
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Variant Id
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:variant_id").put(adminProtect, protect, activeInactive);

module.exports = router;
