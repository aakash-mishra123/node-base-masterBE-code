import { ProjectModule, Module, SectionFieldValue, CalculatedRatios, Chapter } from '../../index.model.mjs';
import { sequelize } from '../../../db/connection.mjs';
import { AppError } from '../../../utils/errorHandler.mjs';
import { Op } from 'sequelize';

export class ProjectModuleService {

    async saveProjectModule(userId, projectId, moduleId, completedChapters) {
        const transaction = await sequelize.transaction();
        try {
            const moduleData = await Module.findOne({
                where: { id: moduleId },
                attributes: ['parameters'],
            });

            if (!moduleData) {
                throw new AppError('NOT_FOUND', 404, 'Module not found');
            }

            const existingProjectModule = await ProjectModule.findOne({
                where: { projectId, moduleId },
                attributes: ['completedChapters', 'allParams'],
            });

            if (existingProjectModule && existingProjectModule.completedChapters >= completedChapters) {
                completedChapters = existingProjectModule.completedChapters;
            }

            const allParams = existingProjectModule?.allParams ?? moduleData.parameters;
            let moduleStatus;
            let deviations;
            let benchmarkParams;
            let flags;
            let complianceScore;

            if (moduleId === 1) {
                moduleStatus = 1;
                completedChapters = 1;

                deviations = await CalculatedRatios.count({
                    where: {
                        project_id: projectId,
                        remark: {
                            [Op.and]: [
                                { [Op.ne]: null },
                                { [Op.ne]: "" }
                            ]
                        }
                    },
                    transaction
                });
                benchmarkParams = await CalculatedRatios.count({
                    where: {
                        project_id: projectId,
                        remark: {
                            [Op.or]: [
                                { [Op.eq]: null },
                                { [Op.eq]: "" }
                            ]
                        }
                    },
                    transaction
                });

                flags = await CalculatedRatios.count({
                    where: { project_id: projectId, is_flag: 1 },
                    transaction
                });

                console.log("-----allParams", allParams)
                console.log("-----deviations", deviations)
                console.log("-----benchmarkParams", benchmarkParams)
                console.log("-----flags", flags)
            }
            else {
                const allChapters = await Chapter.count({ where: { moduleId } });
                moduleStatus = parseFloat((completedChapters / allChapters).toFixed(2));

                deviations = await SectionFieldValue.count({
                    where: {
                        projectId,
                        moduleId,
                        remark: {
                            [Op.and]: [
                                { [Op.ne]: null },
                                { [Op.ne]: "" }
                            ]
                        }
                    },
                    transaction
                });
                benchmarkParams = await SectionFieldValue.count({
                    where: {
                        projectId,
                        moduleId,
                        remark: {
                            [Op.or]: [
                                { [Op.eq]: null },
                                { [Op.eq]: "" }
                            ]
                        }
                    },
                    transaction
                });
                flags = await SectionFieldValue.count({
                    where: { projectId, moduleId, isFlaged: 1 },
                    transaction
                });

                benchmarkParams = await SectionFieldValue.count({
                    where: {
                        projectId,
                        moduleId,
                        remark: null,
                    },
                    transaction
                });

                flags = await SectionFieldValue.count({
                    where: {
                        projectId,
                        moduleId,
                        isFlaged: 1,
                    },
                    transaction
                });
            }

            complianceScore = parseInt(((benchmarkParams / allParams) * 100).toFixed(2)) || 0;

            console.log("Module Id", moduleId)
            console.log("allParams", allParams)
            console.log("deviations", deviations)
            console.log("benchmarkParams", benchmarkParams)
            console.log("flags", flags)
            console.log("complianceScore", complianceScore, typeof complianceScore)

            let status;  // 'completed' | 'active' | undefined;

            if (moduleStatus === 1) {
                status = 'completed';
            }
            else if (moduleStatus > 0 && moduleStatus < 1) {
                status = 'active';
            }

            // Save or update the current module
            const [projectModule, created] = await ProjectModule.upsert(
                {
                    projectId,
                    userId,
                    moduleId,
                    allParams,
                    deviations,
                    benchmarkParams,
                    flags,
                    complianceScore,
                    completedChapters,
                    moduleStatus,
                    status
                },
                {
                    transaction,
                    returning: true,
                    conflictFields: ['projectId', 'moduleId']
                }
            );

            // If current project module status is completed, activate the next ProjectModule
            if (moduleStatus === 1) {
                const allModules = await ProjectModule.findAll({
                    where: { projectId },
                    order: [['moduleId', 'ASC']],
                    transaction
                });

                const currentIndex = allModules.findIndex(m => m.moduleId === parseInt(moduleId));
                const nextModule = allModules[currentIndex + 1];

                if (nextModule && nextModule.status !== 'completed') {
                    await ProjectModule.update(
                        { status: 'active' },
                        {
                            where: {
                                projectId,
                                moduleId: nextModule.moduleId
                            },
                            transaction
                        }
                    );
                }
            }

            await transaction.commit();
            return projectModule;
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

}
