/**
 * @swagger
 * /project:
 *   post:
 *     summary: Create a new project
 *     tags: [Project]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - projectType
 *               - location
 *               - userName
 *               - userEmail
 *               - userNumber
 *               - userDesignation
 *             properties:
 *               name:
 *                 type: string
 *                 example: "PROJECT Dummy four"
 *               category:
 *                 type: string
 *                 enum: ["mid-end", "premium", "affluent"]
 *                 example: "premium"
 *               description:
 *                 type: string
 *                 example: "dummy description"
 *                 nullable: true
 *               projectType:
 *                 type: string
 *                 enum: ["residential", "commercial"]
 *                 example: "residential"
 *               location:
 *                 type: string
 *                 example: "Noida"
 *               userName:
 *                 type: string
 *                 example: "Manish"
 *               userEmail:
 *                 type: string
 *                 format: email
 *                 example: "manish@gmail.com"
 *               userNumber:
 *                 type: string
 *                 example: "+91778378278"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2034-10-09"
 *                 nullable: true
 *               userDesignation:
 *                 type: string
 *                 example: "Manager"
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 */

/**
 * @swagger
 * /project/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Project]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project details retrieved successfully
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 */


/**
 * @swagger
 * /project:
 *   get:
 *     summary: Get all projects with filtering and pagination
 *     tags: [Project]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectType
 *         schema:
 *           type: string
 *           enum: ["residential", "commercial"]
 *         description: Filter projects by type
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter projects created from this date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter projects created up to this date
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search projects by name or category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: List of projects retrieved successfully
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 */


/**
 * @swagger
 * /project/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Project]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID to be deleted
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 */


/**
 * @swagger
 * /project/{id}:
 *   put:
 *     summary: Update project progress
 *     tags: [Project]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID to be updated
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Project updated successfully"
 *       404:
 *         description: Project not found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 */
