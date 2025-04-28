import { AppError } from '../../../utils/errorHandler.mjs';
import { Project } from '../../project/model/project.model.mjs';
import { KeyRatioField } from '../../keyRatioFields/model/keyRatioFields.model.mjs';
import { CalculatedRatios } from '../../keyRatioFields/model/calculatedRatios.models.mjs';
import { KeyCalField } from '../../keyRatioFields/model/keyCalculatedRatio.model.mjs';
import { ChapterService } from '../../chapter/service/chapter.service.mjs';
import { Op } from 'sequelize';

export class CompareService {
    constructor() {
        this.chapterService = new ChapterService();
    }
    /**
     * Fetch project details for up to 3 project IDs along with Key Ratio Data
     */
    async getProjectsData(userId, currentProjectId, compareProjectIds, moduleId, chapterId) {
        try {
            // Ensure compareProjectIds is an array and contains at most 3 IDs
            if (!Array.isArray(compareProjectIds) || compareProjectIds.length === 0 || compareProjectIds.length > 3) {
                throw new AppError('BAD_REQUEST', 400, 'You must provide between 1 and 3 project IDs.');
            }


            const projectAtrrib = ['id', 'name', 'description', 'category', 'status', 'createdAt']
            // Fetch projects that belong to the logged-in user
            const projects = await Project.findAll({
                where: {
                    id: { [Op.in]: compareProjectIds },
                    user_id: userId,
                    isDeleted: 0
                },
                attributes: projectAtrrib
            });

            if (!projects.length) {
                throw new AppError('NOT_FOUND', 404, 'No matching projects found for the given IDs.');
            }

            // Initialize currentProjectData as null if no currentProjectId is provided
            let currentProject = null;
            let currentProjectData = null;

            if (currentProjectId) {
                currentProject = await Project.findOne({
                    where: {
                        id: currentProjectId,
                        user_id: userId,
                        isDeleted: 0
                    },
                    attributes: projectAtrrib
                });

                if (!currentProject) {
                    throw new AppError('NOT_FOUND', 404, 'Current project not found.');
                }
            }


            // Fetch Key Ratio Data
            let compareProjectData;

            if (Number(moduleId) === 1) {
                // Call getChaptersData when moduleId is 2
                console.log("------------------------module id 1", compareProjectIds)

                let additionalDataForCompareProjects = await this.getCompleteKeyRatioData(compareProjectIds, userId, moduleId);

                if (currentProject) {
                    let additionalDataForCurrentProject = await this.getCompleteKeyRatioData([currentProjectId], userId, moduleId);
                    currentProjectData = {
                        ...currentProject.toJSON(),
                        keyRatioFields: additionalDataForCurrentProject.keyRatioFields.filter(f => f.project_id === currentProject.id),
                        keyCalFields: additionalDataForCurrentProject.keyCalFields[currentProject.id]
                    }
                }

                compareProjectData = projects.map(project => {
                    return {
                        ...project.toJSON(),
                        keyRatioFields: additionalDataForCompareProjects.keyRatioFields.filter(f => f.project_id === project.id),
                        keyCalFields: additionalDataForCompareProjects.keyCalFields[project.id] // these are not project specific in current model
                    };
                });
            }
            else {
                console.log("module 2 and 3 data-------------", projects.length)

                if (currentProject) {
                    currentProjectData = {
                        ...currentProject.toJSON(),
                        moduleData: await this.chapterService.getChaptersData(currentProject.id, moduleId, { chapterId: chapterId })
                    }
                }

                compareProjectData = await Promise.all(projects.map(async (project) => {
                    const parsedProject = project.toJSON();
                    return {
                        ...parsedProject,
                        moduleData: await this.chapterService.getChaptersData(parsedProject.id, moduleId, { chapterId: chapterId })
                    };
                }));
            }
            console.log("----------------------------------------------")

            return { currentProject: currentProjectData, comparedProjects: compareProjectData };
        }
        catch (error) {
            throw error;
        }
    }

    /**
    * Fetch Key Ratio Data including KeyRatioField and CalculatedRatios
    */
    async getCompleteKeyRatioData(compareProjectIds, userId) {
        try {
            // Ensure compareProjectIds is an array
            const projectIds = Array.isArray(compareProjectIds) ? compareProjectIds : [compareProjectIds];

            let keyRatioFields = await KeyRatioField.findAll({
                where: {
                    project_id: { [Op.in]: projectIds }
                }
            });

            let calculatedRatios = await CalculatedRatios.findAll({
                where: {
                    project_id: { [Op.in]: projectIds },
                    user_id: userId
                }
            });

            let keyCalFields = await KeyCalField.findAll();

            // Convert calculatedRatios into a Map for quick lookup
            const calculatedRatiosMap = calculatedRatios.reduce((acc, ratio) => {
                const key = `${ratio.project_id}_${ratio.field_id}`;
                acc[key] = {
                    value: ratio.field_value,
                    is_flag: ratio.is_flag,
                    remark: ratio.remark
                };
                return acc;
            }, {});

            // Format KeyRatioFields with actual values from CalculatedRatios
            let keyRatioFieldsFormatted = keyRatioFields.map(field => {
                const fieldData = field.toJSON();
                const calculatedData = calculatedRatiosMap[`${field.project_id}_${field.id}`] || {};

                return {
                    ...fieldData,
                    value: calculatedData.value ?? null,
                    is_flag: calculatedData.is_flag ?? null,
                    remark: calculatedData.remark ?? null
                };
            });

            // Create a separate keyCalFields structure for each project
            const keyCalFieldsFormatted = {};

            // Initialize structure for each project
            projectIds.forEach(projectId => {
                keyCalFieldsFormatted[projectId] = {};
            });

            // Group KeyCalFields by project, then type, then section
            keyCalFields.forEach(field => {
                const type = field.type || 'Uncategorized';
                const section = field.section || 'Uncategorized';

                projectIds.forEach(projectId => {
                    if (!keyCalFieldsFormatted[projectId][type]) {
                        keyCalFieldsFormatted[projectId][type] = {};
                    }
                    if (!keyCalFieldsFormatted[projectId][type][section]) {
                        keyCalFieldsFormatted[projectId][type][section] = [];
                    }

                    const calculatedData = calculatedRatiosMap[`${projectId}_${field.id}`] || {};

                    keyCalFieldsFormatted[projectId][type][section].push({
                        id: field.id,
                        project_id: projectId,
                        field_name: field.field_name,
                        type: field.type,
                        section: field.section,
                        mid_end: field.mid_end,
                        premium: field.premium,
                        affluent: field.affluent,
                        dependency_fields: field.dependency_fields,
                        value: calculatedData.value ?? null,
                        is_flag: calculatedData.is_flag ?? null,
                        remark: calculatedData.remark ?? null
                    });
                });
            });


            return {
                keyRatioFields: keyRatioFieldsFormatted,
                keyCalFields: keyCalFieldsFormatted
            };
        }
        catch (error) {
            console.error('Error in getCompleteKeyRatioData:', error);
            throw new Error(error.message || 'An unexpected error occurred');
        }
    }

}
