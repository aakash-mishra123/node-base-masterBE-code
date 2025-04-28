import { ValidationError } from '../../../utils/errorHandler.mjs';
import { ResponseHandler } from '../../../utils/responseHandler.mjs';
import { ChapterService } from '../service/chapter.service.mjs';
import { sectionFieldValueSchema } from '../validator/chapter.validator.mjs';

export class ChapterController {
    constructor() {
        this.chapterService = new ChapterService();

        this.getChaptersData = this.getChaptersData.bind(this);
        this.saveChapterData = this.saveChapterData.bind(this);
    }

    /**
   * API to get all chapters of a module along with sections, sections fields,
   *  section field option and value entered by the user 
   */
    async getChaptersData(req, res, next) {
        try {
            const { projectId, moduleId } = req.params;
            const queryParams = req.query;

            const result = await this.chapterService.getChaptersData(projectId, moduleId, queryParams);
            return ResponseHandler.sendResponse(res, true, result);
        }
        catch (error) {
            next(error);
        }
    }

    /**
     * API to save chapter section field values enter or selected by the user
     */
    async saveChapterData(req, res, next) {
        try {
            const { projectId, moduleId, id } = req.params;
            const data = req.body;    // data to save
            const userId = req?.user?.userId;

            // Validating incoming data
            const { error } = sectionFieldValueSchema.validate(data);
            if (error) {
                throw new ValidationError(error.details[0].message);
            }

            const updatedChapter = await this.chapterService.saveChapterData(userId, projectId, moduleId, id, data);
            return ResponseHandler.sendResponse(res, true, updatedChapter);
        }
        catch (error) {
            next(error);
        }
    }

}
