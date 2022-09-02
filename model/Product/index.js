/**
 * @swagger
 * components:
 *  schemas:
 *   Product:
 *     type: object
 *     required:
 *        - titleEn
 *        - descriptionEn
 *        - category
 *        - price
 *     properties:
 *       titleEn:
 *         type: string
 *       titleBn:
 *         type: string
 *       descriptionEn:
 *         type: string
 *       descriptionBn:
 *         type: string
 *       store:
 *         type: string
 *       category:
 *         type: string
 *         description: Category Id
 *       subcategory:
 *         type: string
 *         description: Sub Category Id
 *       price:
 *         type: number
 *       discount:
 *         type: number
 *       variants:
 *         type: array
 *         items:
 *           type: string
 *       variantType:
 *         type: string
 *         enum: [Variant, Color]
 *       image:
 *         type: string
 *       multiImages:
 *         type: array
 *         items:
 *           type: string
 *       keywords:
 *         type: array
 *         items:
 *           type: string
 */
