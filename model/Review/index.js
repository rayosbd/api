/**
 * @swagger
 * components:
 *  schemas:
 *   Review:
 *     type: object
 *     required:
 *        - product
 *        - author
 *        - message
 *        - attachments
 *     properties:
 *       product:
 *         type: string
 *         description: product id
 *       author:
 *         type: string
 *         description: user id
 *       message:
 *         type: string
 *       attachments:
 *         type: array
 *         items:
 *           type: string
 */
