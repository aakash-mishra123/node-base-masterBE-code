import express from 'express';
import { ModuleController } from '../controller/module.controller.mjs';
import { JwtHelper } from '../../../middlewares/jwtHelper.mjs';
import chapterRouter from '../../chapter/router/chapter.router.mjs';

class ModuleRouter {
    constructor() {
        this.router = express.Router({ mergeParams: true });
        this.moduleController = new ModuleController();
        this._initializeRoutes();
    }

    _initializeRoutes() {
        this.router.get('/', this.moduleController.getModules);
        this.router.get('/:moduleId', this.moduleController.getModule);
        this.router.put('/:moduleId', this.moduleController.updateModule);

        // Mounting chapterRouter under /:moduleId/chapter
        this.router.use('/:moduleId/chapter/', chapterRouter);
    }
}

export default new ModuleRouter().router;
