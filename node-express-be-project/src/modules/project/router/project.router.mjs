import express from 'express';
import multer from 'multer';

import { ProjectController } from '../controller/project.controller.mjs';
import { ModuleController } from '../../module/controller/module.controller.mjs';
import { JwtHelper } from '../../../middlewares/jwtHelper.mjs';
import moduleRouter from '../../module/router/module.router.mjs';
import { ProjectMiddleware } from '../middleware/project.middleware.mjs';
import { upload } from '../../../config/multer.config.mjs';

class ProjectRouter {
    constructor() {
        this.router = express.Router({ mergeParams: true });
        this.projectController = new ProjectController();
        this.moduleController = new ModuleController();
        this._initializeRoutes();
    }

    _initializeRoutes() {

        this.router.post('/', this.projectController.createProject);
        this.router.get('/:projectId', ProjectMiddleware.verifyOwnership, this.projectController.getProject);
        this.router.get('/', this.projectController.getProjects);
        this.router.delete('/:projectId', ProjectMiddleware.verifyOwnership, this.projectController.deleteProject);
        this.router.put('/:projectId', ProjectMiddleware.verifyOwnership, this.projectController.saveProject);
        this.router.put('/:projectId/save-project-module', ProjectMiddleware.verifyOwnership, this.projectController.saveProjectModule);
        this.router.get('/:projectId/export', ProjectMiddleware.verifyOwnership, this.projectController.exportProject);
        this.router.post('/:projectId/module/:moduleId/import',  upload.single('file'), this.projectController.importProject);

        // Mounting moduleRouter under /:projectId/modules
        this.router.use('/:projectId/module', ProjectMiddleware.verifyOwnership, moduleRouter);
    }
}

export default new ProjectRouter().router;
