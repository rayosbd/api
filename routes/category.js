const express = require("express");
const {
  create,
  update,
  activeInactive,
  getAll,
  byID,
} = require("../controllers/category");
const { protect, adminProtect } = require("../middleware/auth");
const router = express.Router();

// Get All API
/**
 * @swagger
 * /api/category:
 *  get:
 *    tags: [Category]
 *    summary: Get All Categories
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").get(getAll);

// Create API
/**
 * @swagger
 * /api/category:
 *  post:
 *    tags: [Category]
 *    summary: Create New Category
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Category'
 *
 *    responses:
 *      201:
 *        description: Creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").post(adminProtect, protect, create);

// Get Category API
/**
 * @swagger
 * /api/category/{id}:
 *  get:
 *    tags: [Category]
 *    summary: Get Category
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Category Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:category_id").get(byID);

// Update API
/**
 * @swagger
 * /api/category/{id}:
 *  patch:
 *    tags: [Category]
 *    summary: Update Category
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Category Id
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
router.route("/:category_id").patch(adminProtect, protect, update);

// Update Status API
/**
 * @swagger
 * /api/category/{id}:
 *  put:
 *    tags: [Category]
 *    summary: Toggle Status Category
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Category Id
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:category_id").put(adminProtect, protect, activeInactive);

module.exports = router;
