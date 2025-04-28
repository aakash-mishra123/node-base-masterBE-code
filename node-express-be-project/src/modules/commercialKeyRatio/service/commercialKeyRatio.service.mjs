// import KeyRatioField from '../model/keyRatioFields.model.mjs';
// import CalculatedRatios from '../model/calculatedRatios.models.mjs';
import { Project } from '../../project/model/project.model.mjs';
// import { KeyCalField } from "../model/keyCalculatedRatio.model.mjs";
import CommercialKeyRatioInputValue from '../model/commercialKeyRatioInputValue.model.mjs';

export class CommercialService {



    // Get summary for a specific project and user
    async getProjectSummary(projectId, userId) {
      // 1. Check if project exists and belongs to the user
      // 2. Fetch the summary for that project
      // 3. Return summary or throw error if not found
    }
  
    // Create a summary for a project
    async createkeyRatioData(projectId, userId, summaryData) {
        const project = await Project.findOne({ where: { id: projectId } });
      
        if (!project) {
          throw new Error('Project not found');
        }
      
        if (project.userId !== userId) {
          throw new Error('Unauthorized: You do not own this project');
        }
      
        const savedEntries = [];
      
        for (const entry of summaryData) {
          const { field_id, value } = entry;
      
          const saved = await CommercialKeyRatioInputValue.create({
            project_id: projectId,
            field_id,
            value
          });
      
          savedEntries.push(saved);
        }
      
        return savedEntries;
      }
      
      
  
    // Update existing project summary
    async updateProjectSummary(projectId, userId, updateData) {
      // 1. Validate ownership
      // 2. Find the existing summary and update with new data
      // 3. Save and return updated summary
    }
  
    // Generate a formatted report from the summary
    async generateProjectReport(projectId, userId) {
      // 1. Fetch the summary
      // 2. Format the summary into a report-like structure
      // 3. Return the formatted report
    }

}

  