/**
 * @swagger
 * components:
 *  schemas:
 *   Address:
 *     type: object
 *     required:
 *        - user
 *        - title
 *        - phone
 *        - description
 *     properties:
 *        user:
 *          type: string
 *          description: User ID
 *        phone:
 *          type: string
 *          unique: true
 *          pattern: 01\d{9}$
 *        lat:
 *          type: string
 *        lng:
 *          type: string
 *        title:
 *          type: string
 *        summary:
 *          type: string
 *        description:
 *          type: string
 */
