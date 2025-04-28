import { MetadataService } from '../service/metadata.service.mjs';
import { ResponseHandler } from '../../../utils/responseHandler.mjs';

export class MetadataController {
    constructor() {
        this.metadataService = new MetadataService();
        this.getProjectFilters = this.getProjectFilters.bind(this);
    }

    async getProjectFilters(req, res, next) {
        try {
            const filters = this.metadataService.fetchProjectFilters();
            return ResponseHandler.sendResponse(res, true, filters);
        }
        catch (error) {
            next(error);
        }
    }
}
