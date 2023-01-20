const express = require("express");
const { protect, adminProtect } = require("../middleware/auth");
const { query } = require("../middleware/query");
const { getAll, create, update } = require("../controllers/discount");
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
router.route("/:discount_id").patch(adminProtect, protect, update);

module.exports = router;
