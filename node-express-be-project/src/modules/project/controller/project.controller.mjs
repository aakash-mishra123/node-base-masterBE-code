import { ProjectService } from '../service/project.service.mjs';
import { createProjectSchema, exportProjectQueryParamsValidator, saveProjectModuleSchema, updateProjectSchema } from '../validator/project.validator.mjs';
import { ResponseHandler } from '../../../utils/responseHandler.mjs';
import { AppError, ValidationError } from '../../../utils/errorHandler.mjs';
import fs from 'fs';

export class ProjectController {
    constructor() {
        this.projectService = new ProjectService();

        this.createProject = this.createProject.bind(this);
        this.getProject = this.getProject.bind(this);
        this.getProjects = this.getProjects.bind(this);
        this.saveProjectModule = this.saveProjectModule.bind(this);
        this.saveProject = this.saveProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.exportProject = this.exportProject.bind(this);
        this.importProject = this.importProject.bind(this);
    }

    async createProject(req, res, next) {
        try {
            const projectData = req.body;
            const userId = req.user?.userId;

            const { error } = createProjectSchema.validate(projectData);
            if (error) {
                throw new ValidationError(error.details[0].message);
            }

            const project = await this.projectService.createProject(projectData, userId);

            return ResponseHandler.sendResponse(res, true, project, 'Project created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }

    async getProject(req, res, next) {
        try {
            const { projectId } = req.params;
            const userId = req.user?.userId;

            const project = await this.projectService.getProjectById(projectId);
            return ResponseHandler.sendResponse(res, true, project);
        }
        catch (error) {
            next(error);
        }
    }

    async getProjects(req, res, next) {
        try {
            const queryParams = req.query;
            const userId = req.user?.userId;

            const projects = await this.projectService.getAllProjects(queryParams, userId);
            return ResponseHandler.sendResponse(res, true, projects);
        }
        catch (error) {
            next(error);
        }
    }

    async saveProjectModule(req, res, next) {
        try {
            const { projectId } = req.params;
            const projectData = req.body;
            const userId = req.user?.userId;

            const { error } = saveProjectModuleSchema.validate(projectData);
            if (error) {
                throw new ValidationError(error.details[0].message);
            }

            console.log(projectData, projectId, userId);

            const projects = await this.projectService.saveProjectModule(userId, projectId, projectData);

            return ResponseHandler.sendResponse(res, true, projects);
        }
        catch (error) {
            next(error);
        }
    }

    async saveProject(req, res, next) {
        try {
            const { projectId } = req.params;
            const projectData = req.body;
            const userId = req.user?.userId;

            const { error } = updateProjectSchema.validate(projectData);
            if (error) {
                throw new ValidationError(error.details[0].message);
            }

            const projects = await this.projectService.saveProject(projectId, projectData);
            return ResponseHandler.sendResponse(res, true, projects);
        }
        catch (error) {
            next(error);
        }
    }

    async deleteProject(req, res, next) {
        try {
            const { projectId } = req.params;
            const result = await this.projectService.deleteProject(projectId);

            return ResponseHandler.sendResponse(res, true, result);
        }
        catch (error) {
            next(error);
        }
    }

    async exportProject(req, res, next) {
        try {
            const { projectId } = req.params;
            const queryParams = req.query;

            const { error } = exportProjectQueryParamsValidator.validate(queryParams);
            if (error) {
                throw new ValidationError(error.details[0].message);
            }
            const userId = req.user?.userId;

            const { filePath, fileFormat } = await this.projectService.exportProject(userId, projectId, queryParams);

            if (!fs.existsSync(filePath)) {
                return next(new AppError('NOT_FOUND', 404, 'Export file not found'));
            }

            // Constructing the Base64 URL
            const fileBuffer = fs.readFileSync(filePath);
            const base64File = fileBuffer.toString('base64');

            const mimeType = fileFormat === 'zip' ?
                'application/zip' : fileFormat === 'csv' ? 'text/csv' : 'application/octet-stream';
            const base64Url = `data:${mimeType};base64,${base64File}`;

            fs.unlinkSync(filePath);
            return res.json({ base64Url, fileFormat });
        }
        catch (error) {
            next(error);
        }
    }

    async importProject(req, res, next) {
        try {
            const userId = req.user.userId;
            const { projectId, moduleId } = req.params;
            const file = req.file;

            if (!file) {
                throw new AppError('BAD_REQUEST', 400, 'File is required');
            }

            const formattedData = await this.projectService.importProject(userId, projectId, moduleId, file.path);

            return res.status(200).json({ success: true, data: formattedData });
        }
        catch (error) {
            next(error);
        }
    }
}
