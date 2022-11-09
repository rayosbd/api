const express = require("express");
const { search } = require("../controllers/search");
const { query } = require("../middleware/query");
const router = express.Router();

// Get All API
/**
 * @swagger
 * /api/search:
 *  get:
 *    tags: [Search]
 *    summary: Search Products
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
 */
router.route("/").get(query, search);

module.exports = router;
