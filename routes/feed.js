const express = require("express");
const { getAllForHome } = require("../controllers/category");
const router = express.Router();

// Get Feed Products API
/**
 * @swagger
 * /api/feed:
 *  get:
 *    tags: [Feed]
 *    summary: Get Feed for Home
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").get(getAllForHome);

module.exports = router;
