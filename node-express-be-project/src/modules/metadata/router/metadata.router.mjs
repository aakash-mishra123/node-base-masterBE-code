import express from 'express';
import { MetadataController } from '../controller/metadata.controller.mjs';
import { JwtHelper } from '../../../middlewares/jwtHelper.mjs';

class MetadataRouter {
    constructor() {
        this.router = express.Router();
        this.metadataController = new MetadataController();
        this._initializeRoutes();
    }

    _initializeRoutes() {
        this.router.get('/project-filters', JwtHelper.verifyToken, this.metadataController.getProjectFilters);
    }
}

export default new MetadataRouter().router;
