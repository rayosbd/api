const express = require("express");
const { upload } = require("../config/attachment");
const {
	getImages,
	getFeedCategories,
	saveImages,
	delImage,
	getFeedCategoriesNew,
} = require("../controllers/feed");
const { adminProtect, protect } = require("../middleware/auth");
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
router.route("/").get(getFeedCategories);

// Get Feed Products API
/**
 * @swagger
 * /api/feed/new:
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
router.route("/new").get(getFeedCategoriesNew);

// Get Feed Images API
/**
 * @swagger
 * /api/feed/image:
 *  get:
 *    tags: [Feed]
 *    summary: Get Feed Images for Home
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/image").get(getImages);

// Save Attachments API
/**
 * @swagger
 * /api/feed/image:
 *  post:
 *    tags: [Feed]
 *    summary: Upload Feed Images
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - Files[]
 *            properties:
 *              Files[]:
 *                type: array
 *                items:
 *                  type: string
 *                  format: binary
 *
 *    responses:
 *      201:
 *        description: Upload successful
 *      400:
 *        description: Bad Request
 *
 */
router
	.route("/image")
	.post(adminProtect, protect, upload.array("Files[]"), saveImages);

// Get Category API
/**
 * @swagger
 * /api/feed/image/{id}:
 *  delete:
 *    tags: [Feed]
 *    summary: Delete Feed Image
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Image Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/image/:feed_id").delete(adminProtect, protect, delImage);

module.exports = router;
