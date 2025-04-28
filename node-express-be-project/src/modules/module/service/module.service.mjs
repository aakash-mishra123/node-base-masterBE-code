import { Op } from 'sequelize';
import { Chapter, Module, Project, ProjectModule } from '../../index.model.mjs';
import { AppError } from '../../../utils/errorHandler.mjs';

export class ModuleService {

    async getModuleById(moduleId, projectId, userId) {

        const moduleInstance = await Module.findOne({
            where: { id: moduleId, projectId, isDeleted: 0 },
        });

        if (!moduleInstance) {
            throw new AppError('NOT_FOUND', 404, 'Module not found');
        }
        return moduleInstance;
    }

    /**
    * Function to get all the modules.
    * @param {number} projectId - project id (optional)
    * @param {Object} queryParams - query params
    */
    async getAllModules(projectId, queryParams) {
        if (projectId) {
            return this.getAllModulesProjectIdDependency(projectId, queryParams)
        }
        return this.getAllModulesNoProjectIdDependency(queryParams)
    }

    /**
   * Function to get all the modules with no dependencies on project id and project type.
   * @param {Object} queryParams - query params
   */
    async getAllModulesNoProjectIdDependency(queryParams) {

        const { page = 1, limit = 10, search } = queryParams;
        const offset = (page - 1) * limit;

        let whereClause = { isDeleted: 0 };

        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }

        const { count, rows } = await Module.findAndCountAll({
            where: whereClause,
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['moduleNumber', 'ASC']],
            attributes: ['id', 'moduleNumber', 'name', 'description'],
        });

        const totalPages = Math.ceil(count / limit);

        return {
            count,
            totalPages,
            currentPage: parseInt(page),
            rows: rows,
        };
    }

    /**
    * Function to get all the modules project id.
    * @param {number} projectId - project id
    * @param {Object} queryParams - query params
    */
    async getAllModulesProjectIdDependency(projectId, queryParams) {

        const { page = 1, limit = 10, search, projectType } = queryParams;
        const offset = (page - 1) * limit;

        if (!projectType) {
            throw new AppError('BAD_REQUEST', 400, 'Project type is required');
        }

        let whereClause = { type: projectType, isDeleted: 0 };
        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }

        let modules = await Module.findAll({
            where: whereClause,
            order: [['id', 'ASC']],
            attributes: ['id', 'moduleNumber', 'name', 'description', 'status'],
            offset: parseInt(offset),
            limit: parseInt(limit),
            include: [
                {
                    model: ProjectModule,
                    as: 'projectModule',
                    where: { projectId },
                    required: false,
                    attributes: [
                        'allParams',
                        'deviations',
                        'benchmarkParams',
                        'flags',
                        'complianceScore',
                        'moduleStatus',
                        'completedChapters',
                        'status',
                    ],
                },
                {
                    model: Chapter,
                    as: 'moduleChapters',
                    attributes: ['id'],
                    order: [['id', 'ASC']],
                    required: false,
                }
            ],
        });

        // Adding first chapterId for a module if there are any chapters in it.
        modules = modules.map((module) => {
            const firstChapterId = module.moduleChapters?.length > 0 ? module.moduleChapters[0].id : null;
            return { ...module.get({ plain: true }), firstChapterId };
        });

        return {
            count: modules.length,
            totalPages: Math.ceil(modules.length / limit),
            currentPage: parseInt(page),
            rows: modules,
        };
    }

    async updateModule(moduleId, projectId, data, userId) {
        const moduleInstance = await this.getModuleById(moduleId, projectId, userId);
        await moduleInstance.update(data);
        return moduleInstance;
    }
}
