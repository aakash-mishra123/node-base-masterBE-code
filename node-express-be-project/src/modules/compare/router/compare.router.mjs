import express from 'express';
import { CompareController } from '../controller/compare.controller.mjs';
import { JwtHelper } from '../../../middlewares/jwtHelper.mjs';

class CompareRouter {
    constructor() {
        this.router = express.Router({ mergeParams: true });
        this.CompareController = new CompareController();
        this._initializeRoutes();
    }

    _initializeRoutes() {
        // Apply JWT authentication middleware
        this.router.post('/get-projects', JwtHelper.verifyToken, this.CompareController.fetchProjects);
    }
}

export default new CompareRouter().router;
