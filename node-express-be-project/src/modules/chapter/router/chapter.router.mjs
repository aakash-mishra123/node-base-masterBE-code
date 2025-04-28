import express from 'express';
import { ChapterController } from '../controller/chapter.controller.mjs';
import { JwtHelper } from '../../../middlewares/jwtHelper.mjs';

class ChapterRouter {
    constructor() {
        this.router = express.Router({ mergeParams: true });
        this.chapterController = new ChapterController();
        this._initializeRoutes();
    }

    _initializeRoutes() {
        this.router.get('/', this.chapterController.getChaptersData);
        this.router.put('/:id', this.chapterController.saveChapterData);
    }
}

export default new ChapterRouter().router;
