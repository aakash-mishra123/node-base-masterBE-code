import { Op } from 'sequelize';
import { AppError } from '../../../utils/errorHandler.mjs';
import { Chapter, Project, ProjectModule, Section, SectionField, SectionFieldOption, SectionFieldValue } from '../../index.model.mjs';
import { sequelize } from '../../../db/connection.mjs';

export class ChapterService {

    /**
     *  API to get all chapters of a module along with sections, sections fields,
     *  section field option and details of value entered by the user 
     */
    async getChaptersData(projectId, moduleId, queryParams) {
        const {
            chapterId,
            includeSection = 'true',
            includeSectionField = 'true',
            includeSectionFieldOption = 'true'
        } = queryParams;

        const includeSectionBool = includeSection.toLowerCase() === 'true';
        const includeSectionFieldBool = includeSectionField.toLowerCase() === 'true';
        const includeSectionFieldOptionBool = includeSectionFieldOption.toLowerCase() === 'true';

        const project = await ProjectModule.findOne({
            where: { projectId: projectId, moduleId, status: { [Op.ne]: 'pending' } },
            attributes: ['completedChapters'],
        });

        // user should only set the chapters data if the status of the project module is active or completed.
        if (!project) {
            throw new AppError('NOT_FOUND', 404, 'No data not found');
        }

        //if project module not found means the current module for the 
        //project is not saved yet hence take the completeChapters 0.
        const completedChapters = project?.completedChapters || 0;

        //finding the chapter number given by chapter id.
        const currentChapterNum = await Chapter.findOne({
            where: {
                id: parseInt(chapterId)
            },
            attributes: ['chapterNumber']
        })

        //means you are accessing that chapter which is inactive or pending in status.
        if(completedChapters + 1 < currentChapterNum.chapterNumber){
            throw new AppError('NOT_FOUND', 404, 'No data not found');
        }

        let whereClause = { moduleId, isDeleted: 0 };

        const allChapters = await Chapter.findAll({
            where: whereClause,
            order: [['chapterNumber', 'ASC']],
            attributes: ['id', 'moduleId', 'title', 'chapterNumber'],
        });

        let detailedChapterData = null;
        if (chapterId) {
            detailedChapterData = await Chapter.findOne({
                where: { id: chapterId, moduleId, isDeleted: 0 },
                attributes: ['id', 'moduleId', 'title', 'chapterNumber'],
                include: [
                    {
                        model: Section,
                        as: 'chapterSections',
                        where: { isDeleted: 0 },
                        required: false,
                        attributes: ['id', 'chapterId', 'title', 'content', 'status'],
                        include: includeSectionFieldBool
                            ? [
                                {
                                    model: SectionField,
                                    as: 'sectionFields',
                                    where: { isDeleted: 0 },
                                    required: false,
                                    attributes: { exclude: ['createdAt', 'updatedAt', 'status', 'isDeleted'] },
                                    include: [
                                        {
                                            model: SectionFieldValue,
                                            as: 'fieldValue',
                                            attributes: ['id', 'sectionFieldId', 'answer', 'remark', 'isFlaged', 'anyOtherAnswer'],
                                            where: { projectId: projectId },
                                            required: false
                                        },
                                        ...(includeSectionFieldOptionBool
                                            ? [{
                                                model: SectionFieldOption,
                                                as: 'sectionFieldOptions',
                                                attributes: ['id', 'fieldOption'],
                                                separate: true,
                                                order: [
                                                    [sequelize.literal(`CASE WHEN fieldOption = 'Any Other' THEN 1 ELSE 0 END`), 'ASC'],
                                                    ['fieldOption', 'ASC']
                                                ]
                                            }]
                                            : [])
                                    ]
                                }
                            ]
                            : []
                    }
                ]
            });
        }

        const formattedChapters = allChapters.map((chapter, index) => {
            let status = 'pending';
            let isLastChapter = false;

            if (index === allChapters.length - 1) {
                isLastChapter = true;
            }
            if (completedChapters > index) {
                status = 'completed';
            }
            else if (completedChapters === index) {
                status = 'active';
            }

            if (chapterId && chapter.id === Number(chapterId)) {
                return {
                    ...detailedChapterData.toJSON(),
                    status,
                    isLastChapter
                };
            }

            return {
                id: chapter.id,
                moduleId: chapter.moduleId,
                title: chapter.title,
                chapterNumber: chapter.chapterNumber,
                status,
                isLastChapter
            };
        });

        return { rows: formattedChapters };
    }


    /**
    * API to save chapter section field values enter or selected by the user. 
    * if answer doesn't matching with the bechmarkAnswer then remark is mandatory for that.
    */

    async saveChapterData(userId, projectId, moduleId, chapterId, data) {
        try {

            const missingRemarks = [];

            data.forEach(item => {
                const answer = item.answer;
                const benchmark = item.benchmarkAnswer || [];
                const remark = item.remark || '';

                // Skip validation if no benchmark exists
                if (benchmark.length === 0) return;
                const trimmedBenchmark = benchmark.map(b => b.trim()?.toLowerCase());

                const isBenchmarkValid =
                    answer && trimmedBenchmark
                        ? Array.isArray(answer) && answer.length > 0
                            ? answer.every((sel) =>
                                trimmedBenchmark.some(
                                    (answer) =>
                                        typeof sel === "string" &&
                                        typeof answer === "string" &&
                                        answer.trim().toLowerCase() === sel.trim().toLowerCase()
                                )
                            ) // For multiselect
                            : typeof answer === "string"
                                ? trimmedBenchmark.some(
                                    (bans) =>
                                        typeof bans === "string" &&
                                        bans.trim().toLowerCase() === answer.trim().toLowerCase()
                                ) // For single select
                                : false
                        : null;

                console.log("answer: ", answer)
                console.log("benchmark: ", benchmark)
                console.log("isBenchmarkValid: ", isBenchmarkValid)
                console.log("remark: ", remark)

                console.log("-------------------------------------")

                if (!isBenchmarkValid) {
                    if (!remark || remark.trim() === '') {
                        console.log("no remark", remark)

                        missingRemarks.push({
                            sectionFieldId: item.sectionFieldId,
                            providedAnswer: answer,
                            isBenchmarkValid: isBenchmarkValid,
                            validAnswers: trimmedBenchmark
                        });
                    }
                }
            });

            if (missingRemarks.length > 0) {
                throw new AppError(
                    'VALIDATION_ERROR',
                    400,
                    'Some answers do not match benchmark values please provide remark for them.',
                    null
                );
            }

            const formattedData = data.map(item => ({
                userId,
                projectId: parseInt(projectId),
                moduleId: parseInt(moduleId),
                chapterId: parseInt(chapterId),
                sectionId: item.sectionId,
                sectionFieldId: item.sectionFieldId,
                answer: item.answer,
                isFlaged: item.isFlaged || false,
                remark: item.remark ? item.remark.trim() : null,
                anyOtherAnswer: item.anyOtherAnswer ? item.anyOtherAnswer.trim() : ""
            }));


            // Verify project exists
            const project = await Project.findOne({
                where: { id: projectId, isDeleted: 0 }
            });
            if (!project) {
                throw new AppError('NOT_FOUND', 404, 'Project not found');
            }
            const transaction = await SectionFieldValue.sequelize.transaction();

            try {
                await SectionFieldValue.bulkCreate(formattedData, {
                    updateOnDuplicate: ['answer', 'isFlaged', 'remark', 'anyOtherAnswer', 'updatedAt'],
                    transaction
                });

                await transaction.commit();
                return "Chapter data saved successfully";
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        catch (error) {
            throw error;
        }
    }
}
