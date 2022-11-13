const express = require("express");
const {
  getAll,
  byID,
  create,
  activeInactive,
  byProductID,
  byProductIDForAdmin,
  byUserIDForAdmin,
} = require("../controllers/review");
const { query } = require("../middleware/query");
const { protect, adminProtect } = require("../middleware/auth");
const router = express.Router();

// Get All API
/**
 * @swagger
 * /api/review:
 *  get:
 *    tags: [Review]
 *    summary: Get All Reviews
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
 *        name: author
 *        type: string
 *      - in: query
 *        name: product
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
 * /api/review:
 *  post:
 *    tags: [Review]
 *    summary: Create New Review
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Review'
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
router.route("/").post(protect, create);

// Get Review API
/**
 * @swagger
 * /api/review/{id}:
 *  get:
 *    tags: [Review]
 *    summary: Get Review
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Review Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:review_id").get(byID);

// Get Review API
/**
 * @swagger
 * /api/review/product/{productId}:
 *  get:
 *    tags: [Review]
 *    summary: Get Product Reviews For User Application
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
router.route("/product/:product_id").get(byProductID);


// Update Status API
/**
 * @swagger
 * /api/review/{id}:
 *  put:
 *    tags: [Review]
 *    summary: Toggle Review Status
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Review Id
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */

router.route("/:review_id").put(adminProtect, protect, activeInactive);

module.exports = router;
