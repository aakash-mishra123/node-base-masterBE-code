import { KeyRatioFieldService } from '../service/keyRatioFields.service.mjs';
import { ErrorHandler } from '../../../utils/errorHandler.mjs';
import { ResponseHandler } from '../../../utils/responseHandler.mjs';
import {sequelize} from '../../../db/connection.mjs'; 

export class KeyRatioFieldController {
    constructor() {
        this.keyRatioFieldService = new KeyRatioFieldService();

        this.getKeyRatioField = this.getKeyRatioField.bind(this);
        this.getKeyRatioFields = this.getKeyRatioFields.bind(this);
        this.createKeyRatioField = this.createKeyRatioField.bind(this);
        this.updateKeyRatioField = this.updateKeyRatioField.bind(this);
        this.calculateAndSaveRatios = this.calculateAndSaveRatios.bind(this);
        this.saveAsDraft = this.saveAsDraft.bind(this);
    }

    /**
     * Get a single Key Ratio Field by ID
     */
    async getKeyRatioField(req, res, next) {
        try {
            const { project_id } = req.params;
            const user_id = req.user;
            console.log(user_id, "user_id----------")

            const keyRatioField = await this.keyRatioFieldService.getKeyRatioFieldById(project_id, user_id);
            return ResponseHandler.sendResponse(res, true, keyRatioField);
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

    /**
     * Get all Key Ratio Fields with optional query params
     */
    async getKeyRatioFields(req, res, next) {
        try {
            const queryParams = req.query;
            const user_id = req.user;

            // Fetch both key ratio fields and calculated ratios
            const keyRatioData = await this.keyRatioFieldService.getCompleteKeyRatioData(queryParams, user_id);

            return ResponseHandler.sendResponse(res, true, keyRatioData);
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

    async saveAsDraft(req, res, next) {
        try {
            const { project_id, module_id, inputValues, ...ratioFields } = req.body;
            // Save Key Ratio Fields
            const user_id = req.user.userId;
            // Save Calculated Ratios if provided
            let calculatedResult = [];
            if (inputValues && inputValues.length > 0) {
                calculatedResult = await this.keyRatioFieldService.saveAsDraft(user_id, project_id, inputValues);
            }
            const newKeyRatioField = await this.keyRatioFieldService.createKeyRatioFieldDraft({ project_id, module_id, ...ratioFields });
            return ResponseHandler.sendResponse(res, true, { newKeyRatioField, calculatedResult }, 201);
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

    async createKeyRatioField(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { project_id, module_id, inputValues, ...ratioFields } = req.body;
            // Save Key Ratio Fields
            const user_id = req.user.userId;
            // Save Calculated Ratios if provided
            let calculatedResult = [];
            if (inputValues && inputValues.length > 0) {
                calculatedResult = await this.keyRatioFieldService.saveCalculatedRatios(user_id, project_id, inputValues, t);
            }
            const newKeyRatioField = await this.keyRatioFieldService.createKeyRatioField({ project_id, module_id, ...ratioFields }, t);
            await t.commit(); // success
            return ResponseHandler.sendResponse(res, true, { newKeyRatioField, calculatedResult }, 201);
        } catch (error) {
            await t.rollback();
            console.log(error)
            next(error);
        }
    }


    /**
     * Update an existing Key Ratio Field by ID
     */
    async updateKeyRatioField(req, res, next) {
        try {
            let { project_id } = req.query;
            project_id = Number(project_id);


            const data = req.body;
            console.log(data, 'data-----------')
            const user_id = req.user.userId;
            console.log(user_id, "user_id----------")
            console.log(typeof user_id, user_id, "Checking project_id type before query");

            const updatedKeyRatioField = await this.keyRatioFieldService.updateKeyRatioField(project_id, user_id, data);
            return ResponseHandler.sendResponse(res, true, updatedKeyRatioField);
        } catch (error) {
            console.log(error)
            next(error);
        }
    }


    async calculateAndSaveRatios(req, res, next) {
        try {
            const { user_id, project_id, inputValues } = req.body;
            const result = await this.keyRatioFieldService.saveCalculatedRatios(user_id, project_id, inputValues);
            return ResponseHandler.sendResponse(res, true, result, 201);
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
}
