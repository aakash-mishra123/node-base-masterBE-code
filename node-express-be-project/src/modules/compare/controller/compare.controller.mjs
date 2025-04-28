import { ValidationError } from '../../../utils/errorHandler.mjs';
import { compareProjectValidator } from '../../project/validator/project.validator.mjs';
import { CompareService } from '../service/compare.service.mjs';


const compareService = new CompareService();

export class CompareController {

    /**
     * Controller to handle fetching projects
     */
    async fetchProjects(req, res) {
        try {

            const { error } = compareProjectValidator.validate(req.body);
            if (error) {
                throw new ValidationError(error.details[0].message);
            }

            const { currentProjectId, compareProjectIds, moduleId, chapterId } = req.body;
            const userId = req.user.userId;

            const data = await compareService.getProjectsData(userId, currentProjectId, compareProjectIds, moduleId, chapterId);

            return res.status(200).json({
                success: true,
                message: 'Projects fetched successfully.',
                data
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }
    }
}
