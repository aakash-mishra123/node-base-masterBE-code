import { Project } from '../../index.model.mjs';
import { AppError } from '../../../utils/errorHandler.mjs';

export class ProjectMiddleware {
    static async verifyOwnership(req, res, next) {
        try {
            const { projectId } = req.params;
            const userId = req.user?.userId;

            if (!projectId) {
                throw new AppError('BAD_REQUEST', 400, 'Project id is required');
            }

            const project = await Project.findOne({
                where: { id: projectId, userId, isDeleted: 0 },
            });

            if (!project) {
                throw new AppError('NOT_FOUND', 404, 'Project not found');
            }

            next();
        }
        catch (error) {
            next(error);
        }
    }
}
