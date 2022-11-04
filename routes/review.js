const express = require("express");
const { getAll, byID } = require("../controllers/review");
const { query } = require("../middleware/query");
const { create } = require("../model/Review");
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
router.route("/").post(create);

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

module.exports = router;
