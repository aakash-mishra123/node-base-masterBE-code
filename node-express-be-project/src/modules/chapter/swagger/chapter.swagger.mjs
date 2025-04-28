/**
 * @swagger
 * /project/{projectId}/module/{moduleId}/chapter:
 *   get:
 *     summary: Get chapter data along with sections and fields
 *     tags: [Chapter]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Module ID
 *       - in: query
 *         name: chapterId
 *         schema:
 *           type: integer
 *         description: (Optional) Chapter ID to fetch data for a specific chapter
 *     responses:
 *       200:
 *         description: Chapter data retrieved successfully
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       404:
 *         description: Project or module not found
 */



/**
 * @swagger
 * /project/{projectId}/module/{moduleId}/chapter/{chapterId}:
 *   post:
 *     summary: Save user's input for a chapter
 *     tags: [Chapter]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Module ID
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chapter ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - sectionId
 *                 - sectionFieldId
 *                 - answer
 *               properties:
 *                 sectionId:
 *                   type: integer
 *                   example: 1
 *                 sectionFieldId:
 *                   type: integer
 *                   example: 1
 *                 answer:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["temp1"]
 *                 isFlaged:
 *                   type: integer
 *                   example: 0
 *                   description: (Optional) 0 or 1
 *                 remark:
 *                   type: string
 *                   example: "Nothing"
 *                   description: (Optional)
 *     responses:
 *       200:
 *         description: Chapter data saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       404:
 *         description: Project, module, or chapter not found
 */
