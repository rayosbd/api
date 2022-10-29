const express = require("express");
const {
  create,
  update,
  getAll,
  activeInactive,
  byID,
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
