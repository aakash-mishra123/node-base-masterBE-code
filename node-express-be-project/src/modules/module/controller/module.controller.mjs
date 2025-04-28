import { ModuleService } from '../service/module.service.mjs';
import { ErrorHandler } from '../../../utils/errorHandler.mjs';
import { ResponseHandler } from '../../../utils/responseHandler.mjs';

export class ModuleController {
    constructor() {
        this.moduleService = new ModuleService();

        this.getModule = this.getModule.bind(this);
        this.getModules = this.getModules.bind(this);
        this.updateModule = this.updateModule.bind(this);
    }

    async getModule(req, res, next) {
        try {
            const { id } = req.params;
            const moduleInstance = await this.moduleService.getModuleById(id);
            return ResponseHandler.sendResponse(res, true, moduleInstance);
        }
        catch (error) {
            next(error);
        }
    }

    /**
    * API to get all modules(No dependencies on a project and project type) 
    */
    async getModules(req, res, next) {
        try {
            const queryParams = req.query;
            const { projectId } = req.params;

            const result = await this.moduleService.getAllModules(projectId, queryParams);
            return ResponseHandler.sendResponse(res, true, result);

        }
        catch (error) {
            next(error);
        }
    }

    async updateModule(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;
            const updatedModule = await this.moduleService.updateModule(id, data);

            return ResponseHandler.sendResponse(res, true, updatedModule);
        }
        catch (error) {
            next(error);
        }
    }

}
