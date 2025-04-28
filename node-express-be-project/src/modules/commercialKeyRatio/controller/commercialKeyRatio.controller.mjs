import { CommercialService } from '../service/commercialKeyRatio.service.mjs';

const commercialService = new CommercialService();

export class CommercialKeyRatioController {
    
    /**
     * Controller to handle saving key input values
     */
    async saveCommercialKeyInput(req, res) {
        try {
          const { projectId, summaryData } = req.body;
          const userId = req.user.userId;
      
          if (!Array.isArray(summaryData) || summaryData.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'Summary data must be a non-empty array.'
            });
          }
      
          const savedValue = await commercialService.createkeyRatioData(projectId, userId, summaryData);
      
          return res.status(201).json({
            success: true,
            message: 'Input values saved successfully.',
            data: savedValue
          });
      
        } catch (error) {
          console.error('Error saving input value:', error);
          return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong while saving input values.'
          });
        }
      }
      
}
