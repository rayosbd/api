const express = require("express");
const { order, dashboard, customer, product } = require("../controllers/stats");
const router = express.Router();







/**
 * @swagger
 * /api/stats/dashboard:
 *  get:
 *    tags: [Stats]
 *    summary: Get Dashboard Stats
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/dashboard").get(dashboard);

/**
 * @swagger
 * /api/stats/order:
 *  get:
 *    tags: [Stats]
 *    summary: Get Order Stats
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/order").get(order);

/**
 * @swagger
 * /api/stats/customer:
 *  get:
 *    tags: [Stats]
 *    summary: Get Dashboard Customer
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/customer").get(customer);

/**
 * @swagger
 * /api/stats/product:
 *  get:
 *    tags: [Stats]
 *    summary: Get Dashboard Product
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/product").get(product);








module.exports = router;
