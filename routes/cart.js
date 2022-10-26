const express = require("express");
const {
  getForUser,
  createCart,
  deleteCart,
  updateCart,
} = require("../controllers/cart");
const { protect } = require("../middleware/auth");
const router = express.Router();

// Get Cart API
/**
 * @swagger
 * /api/cart:
 *  get:
 *    tags: [Cart]
 *    summary: Get Cart for User
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
router.route("/").get(protect, getForUser);

// Add Variant to Cart API
/**
 * @swagger
 * /api/cart/{variantId}?quantity={quantity}:
 *  post:
 *    tags: [Cart]
 *    summary: Create Cart
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: variantId
 *        required: true
 *        type: string
 *      - in: path
 *        name: quantity
 *        required: true
 *        type: string
 *    responses:
 *      201:
 *        description: Creation Successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:variant_id").post(protect, createCart);

// Update Cart API
/**
 * @swagger
 * /api/cart/{cartId}?quantity={quantity}:
 *  patch:
 *    tags: [Cart]
 *    summary: Update Cart
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: cartId
 *        required: true
 *        type: string
 *      - in: path
 *        name: quantity
 *        required: true
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
router.route("/:cart_id").patch(protect, updateCart);

// Delete Cart API
/**
 * @swagger
 * /api/cart/{cartId}:
 *  delete:
 *    tags: [Cart]
 *    summary: Delete Cart
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: cartId
 *        required: true
 *        type: string
 *    responses:
 *      200:
 *        description: Delete Successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:cart_id").delete(protect, deleteCart);

module.exports = router;
