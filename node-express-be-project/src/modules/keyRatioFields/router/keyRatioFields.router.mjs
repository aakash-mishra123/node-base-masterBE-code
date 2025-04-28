import express from 'express';
import { KeyRatioFieldController } from '../controller/keyRatioFields.controller.mjs';
import { validateRequest } from '../../../middlewares/validateRequest.mjs';
import { createKeyRatioFieldSchema } from '../../../validations/keyRatioField.validation.mjs';
// import { KeyRatioFieldController } from '../controller/keyRatioField.controller.mjs';
import { JwtHelper } from '../../../middlewares/jwtHelper.mjs';

class KeyRatioFieldRouter {
    constructor() {
        this.router = express.Router({ mergeParams: true });
        this.keyRatioFieldController = new KeyRatioFieldController();
        this._initializeRoutes();
    }

    _initializeRoutes() {
        this.router.get('/', JwtHelper.verifyToken, this.keyRatioFieldController.getKeyRatioFields);
        this.router.get('/:keyRatioFieldId', JwtHelper.verifyToken, this.keyRatioFieldController.getKeyRatioField);
        this.router.post('/', JwtHelper.verifyToken, this.keyRatioFieldController.createKeyRatioField);
        this.router.post('/saveAsDraft', JwtHelper.verifyToken, this.keyRatioFieldController.saveAsDraft)
        this.router.put('/', JwtHelper.verifyToken, this.keyRatioFieldController.updateKeyRatioField);
    }
}

export default new KeyRatioFieldRouter().router;
