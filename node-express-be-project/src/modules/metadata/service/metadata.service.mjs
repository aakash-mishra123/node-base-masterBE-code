import { CategoryEnum, ProjectTypeEnum } from '../../../utils/enums.mjs';

export class MetadataService {
    /**
     * Fetch project filters (enums)
     * @returns {Object} Enums for project filtering
     */
    fetchProjectFilters() {
        return {
            projectTypes: ProjectTypeEnum,
            projectCategories: CategoryEnum,
        };
    }
}
