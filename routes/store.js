const express = require("express");
const {
  create,
  getAll,
  update,
  activeInactive,
} = require("../controllers/store");
const { protect, adminProtect } = require("../middleware/auth");
const router = express.Router();

// Get All API
/**
 * @swagger
 * /api/store:
 *  get:
 *    tags: [Store]
 *    summary: Get All Stores
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").get(getAll);

// Get Store API
/**
 * @swagger
 * /api/store/{id}:
 *  get:
 *    tags: [Store]
 *    summary: Get Store
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Store Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */

// Create API
/**
 * @swagger
 * /api/store:
 *  post:
 *    tags: [Store]
 *    summary: Create New Store
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Store'
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
 * /api/store/{id}:
 *  patch:
 *    tags: [Store]
 *    summary: Update Store
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Store Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/StoreUpdate'
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:store_id").patch(adminProtect, protect, update);

// Update Status API
/**
 * @swagger
 * /api/store/{id}:
 *  put:
 *    tags: [Store]
 *    summary: Toggle Store Status
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Store Id
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */

router.route("/:store_id").put(adminProtect, protect, activeInactive);

// Get Product By Store API
/**
 * @swagger
 * /api/store/{id}/products:
 *  get:
 *    tags: [Store]
 *    summary: Get Product List by Store ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Store Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
module.exports = router;
