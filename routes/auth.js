const express = require("express");
const {
  register,
  login,
  forgetpassword,
  resetpassword,
  validate,
  verify,
  updateProfile,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const router = express.Router();

// Register API
/**
 * @swagger
 * /api/auth/register:
 *  post:
 *    tags: [Authentication]
 *    summary: Register User Account
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *
 *    responses:
 *      201:
 *        description: Account creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/register").post(register);

// Verify User API
/**
 * @swagger
 * /api/auth/verify:
 *  post:
 *    tags: [Authentication]
 *    summary: Verify User Account
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - token
 *              - otp
 *            properties:
 *              token:
 *                type: string
 *              otp:
 *                type: string
 *    responses:
 *      200:
 *        description: Authorized
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: No OTP Request Found
 *
 */
router.route("/verify").post(verify);

// Login API
/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    tags: [Authentication]
 *    summary: Login User Account
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - phone
 *              - password
 *            properties:
 *              phone:
 *                type: string
 *                pattern: 01\d{9}$
 *              password:
 *                type: string
 *
 *    responses:
 *      200:
 *        description: Login successful
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Invalid Credentials
 *
 */
router.route("/login").post(login);

// Update User API
/**
 * @swagger
 * /api/auth/update:
 *  patch:
 *    tags: [Authentication]
 *    summary: Update User Account
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserUpdate'
 *
 *    responses:
 *      201:
 *        description: Account information updated
 *      400:
 *        description: Bad Request
 *
 */
router.route("/update").patch(protect, updateProfile);

// Validation API
/**
 * @swagger
 * /api/auth/validate:
 *  get:
 *    tags: [Authentication]
 *    summary: Validate User Account
 *    security:
 *      - bearer: []
 *    responses:
 *      200:
 *        description: Authorized
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: No User Found
 *
 */
router.route("/validate").get(protect, validate);

// Send OTP API
/**
 * @swagger
 * /api/auth/forget-password:
 *  post:
 *    tags: [Authentication]
 *    summary: Forget User Password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - phone
 *            properties:
 *              phone:
 *                type: string
 *                pattern: 01\d{9}$
 *
 *    responses:
 *      200:
 *        description: OTP Sent
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Invalid Credentials
 *
 */
router.route("/forget-password").post(forgetpassword);

// Send OTP API
/**
 * @swagger
 * /api/auth/reset-password:
 *  post:
 *    tags: [Authentication]
 *    summary: Reset User Password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - token
 *              - otp
 *              - password
 *            properties:
 *              token:
 *                type: string
 *              otp:
 *                type: string
 *              password:
 *                type: string
 *
 *    responses:
 *      204:
 *        description: OTP Sent
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Invalid Credentials
 *
 */
router.route("/reset-password").post(resetpassword);



// admin auth routes
router.use('/admin', require('./admin'))

module.exports = router;
