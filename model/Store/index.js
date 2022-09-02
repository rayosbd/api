/**
 * @swagger
 * components:
 *  schemas:
 *   Store:
 *     type: object
 *     required:
 *        - titleEn
 *        - descriptionEn
 *        - owner
 *     properties:
 *       titleEn:
 *         type: string
 *       titleBn:
 *         type: string
 *       descriptionEn:
 *         type: string
 *       descriptionBn:
 *         type: string
 *       profileImage:
 *         type: string
 *       coverImage:
 *         type: string
 *       address:
 *         type: string
 *         description: Address ID
 *       owner:
 *         type: string
 *         description: Owner ID
 *       isActive:
 *         type: boolean
 *         default: false
 *       isVerified:
 *         type: boolean
 *         default: false
 */
