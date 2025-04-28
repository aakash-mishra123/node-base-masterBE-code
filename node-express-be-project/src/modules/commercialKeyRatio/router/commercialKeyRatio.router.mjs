import express from 'express';
import { CommercialKeyRatioController } from '../controller/commercialKeyRatio.controller.mjs';
import { JwtHelper } from '../../../middlewares/jwtHelper.mjs';

class CommercialKeyRatioRouter {
    constructor() {
        this.router = express.Router({ mergeParams: true });
        this.CommercialKeyRatioController = new CommercialKeyRatioController();
        this._initializeRoutes();
    }

    _initializeRoutes() {
        // Apply JWT middleware to protect the route
        this.router.post(
            '/create-key-ratio',
            JwtHelper.verifyToken,
            this.CommercialKeyRatioController.saveCommercialKeyInput.bind(this.CommercialKeyRatioController)
        );
        
    }
}

export default new CommercialKeyRatioRouter().router;
