const express = require("express");
const { getBySubcategoryId } = require("../controllers/product");
const {
  create,
  update,
  activeInactive,
  getAll,
  byID,
} = require("../controllers/subcategory");
const { protect, adminProtect } = require("../middleware/auth");
const { query } = require("../middleware/query");
const router = express.Router();

// Get All API
/**
 * @swagger
 * /api/subcategory:
 *  get:
 *    tags: [Subcategory]
 *    summary: Get All Subcategories
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
 *        name: category
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
 * /api/subcategory:
 *  post:
 *    tags: [Subcategory]
 *    summary: Create New Subcategory
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Subcategory'
 *
 *    responses:
 *      201:
 *        description: Creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").post(adminProtect, protect, create);

// Get Subcategory API
/**
 * @swagger
 * /api/subcategory/{id}:
 *  get:
 *    tags: [Subcategory]
 *    summary: Get Subcategory
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Subcategory Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:subcategory_id").get(byID);

// Update API
/**
 * @swagger
 * /api/subcategory/{id}:
 *  patch:
 *    tags: [Subcategory]
 *    summary: Update Subcategory
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Subcategory Id
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
router.route("/:subcategory_id").patch(adminProtect, protect, update);

// Update Status API
/**
 * @swagger
 * /api/subcategory/{id}:
 *  put:
 *    tags: [Subcategory]
 *    summary: Toggle Subcategory Status
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Subcategory Id
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:subcategory_id").put(adminProtect, protect, activeInactive);

// Get Product By Category API
/**
 * @swagger
 * /api/subcategory/{id}/products:
 *  get:
 *    tags: [Subcategory]
 *    summary: Get Product List by Subategory ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Subcategory Id
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
 *      404:
 *        description: Not Found
 *
 */
router.route("/:category_id/products").get(query, getBySubcategoryId);

module.exports = router;
