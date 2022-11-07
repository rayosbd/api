const express = require("express");
const { getForUser, createOrUpdateAddress } = require("../controllers/address");
const { protect } = require("../middleware/auth");
const router = express.Router();

// Validation API
/**
 * @swagger
 * /api/address:
 *  get:
 *    tags: [Address]
 *    summary: Users saved address list
 *    security:
 *      - bearer: []
 *    responses:
 *      200:
 *        description: Get saved address list
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: No User Found
 *
 */
router.route("/").get(protect, getForUser);

// Create or Update API
/**
 * @swagger
 * /api/address:
 *  put:
 *    tags: [Address]
 *    summary: Update or Create Address
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Address'
 *    responses:
 *      201:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/").put(protect, createOrUpdateAddress);

module.exports = router;
