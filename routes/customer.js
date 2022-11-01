const express = require("express");
const {
  getAll,
  byID,
  activeInactive,
  update,
} = require("../controllers/customer");
const { adminProtect, protect } = require("../middleware/auth");
const { query } = require("../middleware/query");
const router = express.Router();

// Get All API
/**
 * @swagger
 * /api/customer:
 *  get:
 *    tags: [Customer]
 *    summary: Get All Customers
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
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").get(adminProtect, protect, query, getAll);

// Get Customer API
/**
 * @swagger
 * /api/customer/{id}:
 *  get:
 *    tags: [Customer]
 *    summary: Get Customer Information
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Customer Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:user_id").get(adminProtect, protect, byID);

// Update Status API
/**
 * @swagger
 * /api/customer/{id}:
 *  put:
 *    tags: [Customer]
 *    summary: Toggle Customer Status
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Customer Id
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:user_id").put(adminProtect, protect, activeInactive);

// Update API
/**
 * @swagger
 * /api/customer/{id}:
 *  patch:
 *    tags: [Customer]
 *    summary: Update Customer
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Customer Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              properties:
 *                  userName:
 *                     type: string
 *                  fullName:
 *                     type: string
 *                  email:
 *                     type: string
 *                  avatarUrl:
 *                     type: string
 *                  image:
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
router.route("/:user_id").patch(adminProtect, protect, update);

module.exports = router;
