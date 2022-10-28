const express = require("express");
const { createOrder } = require("../controllers/order");
const { protect } = require("../middleware/auth");
const router = express.Router();

// Create Order API
/**
 * @swagger
 * /api/order:
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
router.route("/").post(protect, createOrder);

module.exports = router;
