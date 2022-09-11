/**
 * @swagger
 * components:
 *  schemas:
 *   Order:
 *     type: object
 *     required:
 *        - carts
 *        - paymentMethod
 *        - shippingInfo
 *        - user
 *     properties:
 *       carts:
 *         type: array
 *         items:
 *           type: string
 *       paymentMethod:
 *         type: string
 *         enum: [COD, Online Payment, Mobile Banking]
 *       shippingInfo:
 *         type: string
 *         description: address id
 *       user:
 *         type: string
 *         description: user id
 */
