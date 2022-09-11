/**
 * @swagger
 * components:
 *  schemas:
 *   Product:
 *     type: object
 *     required:
 *        - image
 *        - store
 *        - variantType
 *        - titleEn
 *        - descriptionEn
 *        - category
 *        - buyPrice
 *        - sellPrice
 *     properties:
 *       sku:
 *         type: string
 *       slang:
 *         type: string
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
 *       buyPrice:
 *         type: number
 *       sellPrice:
 *         type: number
 *       discount:
 *         type: object
 *         required:
 *             - discountType
 *             - amount
 *         properties:
 *             discountType:
 *               type: string
 *               enum: [Percentage, Amount]
 *             amount:
 *               type: number
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
 *       isActive:
 *         type: boolean
 */
