const express = require("express");
const {
  calculateOrder,
  getOrderCalculation,
  createOrder,
  getAll,
  getAllUser,
  getAllUserId,
  updateOrder,
} = require("../controllers/order");
const { protect, adminProtect } = require("../middleware/auth");
const { query } = require("../middleware/query");
const router = express.Router();

// Get All API
/**
 * @swagger
 * /api/order:
 *  get:
 *    tags: [Order]
 *    summary: Get Order List for Admin
 *    security:
 *      - bearer: []
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
 *        name: status
 *        type: string
 *        enum:
 *          - Pending
 *          - Confirmed
 *          - Shipped
 *          - Delivered
 *          - Canceled
 *          - Returned
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/").get(adminProtect, protect, query, getAll);

// Get Order List for User API
/**
 * @swagger
 * /api/order/user:
 *  get:
 *    tags: [Order]
 *    summary: Get Order List for Admin
 *    security:
 *      - bearer: []
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
 *        name: status
 *        type: string
 *        enum:
 *          - Pending
 *          - Confirmed
 *          - Shipped
 *          - Delivered
 *          - Canceled
 *          - Returned
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/user").get(protect, query, getAllUser);

// Get Order List for User API
/**
 * @swagger
 * /api/order/user/{userId}:
 *  get:
 *    tags: [Order]
 *    summary: Get Order List for Admin
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: userId
 *        type: string
 *        required: true
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
 *        name: status
 *        type: string
 *        enum:
 *          - Pending
 *          - Confirmed
 *          - Shipped
 *          - Delivered
 *          - Canceled
 *          - Returned
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/user/:userId").get(
  // adminProtect,
  protect,
  query,
  getAllUserId
);

// Get Calculation API
/**
 * @swagger
 * /api/order/calculate:
 *  get:
 *    tags: [Order]
 *    summary: Get Order Calculation for User
 *    security:
 *      - bearer: []
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/calculate").get(protect, getOrderCalculation);

// Calculate Order API
/**
 * @swagger
 * /api/order/calculate:
 *  post:
 *    tags: [Order]
 *    summary: Calculate Order
 *    security:
 *     - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *    responses:
 *      201:
 *        description: Creation Successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/calculate").post(protect, calculateOrder);

// Create Order API
/**
 * @swagger
 * /api/order/create:
 *  post:
 *    tags: [Order]
 *    summary: Create Order
 *    security:
 *     - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OrderCreate'
 *    responses:
 *      201:
 *        description: Creation Successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/create").post(protect, createOrder);

// Create Order API
/**
 * @swagger
 * /api/order/{orderId}:
 *  put:
 *    tags: [Order]
 *    summary: update Order
 *    security:
 *     - bearer: []
 *    parameters:
 *      - in: path
 *        name: orderId
 *        type: string
 *        required: true
 *      - in: query
 *        name: status
 *        type: string
 *        required: true
 *    responses:
 *      201:
 *        description: Update Successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:order_id").put(
  // adminProtect,
  // protect,
  updateOrder
);

module.exports = router;
