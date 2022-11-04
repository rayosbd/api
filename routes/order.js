const express = require("express");
const {
  calculateOrder,
  getOrderCalculation,
  createOrder,
  getAll,
  getAllUser,
  getAllUserId,
  updateOrder,
  byID,
  productsByID,
  timelineByID,
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
 *    summary: Get Order List for User
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



// Get Ordered API
/**
 * @swagger
 * /api/order/{id}/products:
 *  get:
 *    tags: [Order]
 *    summary: Get Order
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Order Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:order_id/products").get(productsByID);

// Get Order API
/**
 * @swagger
 * /api/order/{id}/timeline:
 *  get:
 *    tags: [Order]
 *    summary: Get Order
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Order Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:order_id/timeline").get(timelineByID);

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
router.route("/user/:userId").get(adminProtect, protect, query, getAllUserId);

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

// Get Order API
/**
 * @swagger
 * /api/order/{id}:
 *  get:
 *    tags: [Order]
 *    summary: Get Order
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Order Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
 router.route("/:order_id").get(byID);

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
 *      - in: query
 *        name: orderlines
 *        type: string
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
