import Joi from 'joi';
import { CategoryEnum, ProjectTypeEnum } from '../../../utils/enums.mjs';

export const createProjectSchema = Joi.object({
    name: Joi.string().max(255).required(),
    category: Joi.string().valid(...CategoryEnum).required(),
    description: Joi.string().allow(null, '').optional(),
    projectType: Joi.string().valid(...ProjectTypeEnum).required(),
    location: Joi.string().required(),
    userName: Joi.string().max(255).required(),
    projectOwner: Joi.string().max(255).required(),
    userEmail: Joi.string().email().required(),
    userNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    date: Joi.date().allow(null).optional(),
    userDesignation: Joi.string().max(255).required(),
});


export const updateProjectSchema = Joi.object({
    name: Joi.string().max(255).optional(),
    category: Joi.string().valid(...CategoryEnum).optional(),
    description: Joi.string().allow(null, '').optional(),
    projectType: Joi.string().valid(...ProjectTypeEnum).optional(),
    location: Joi.string().optional(),
    userName: Joi.string().max(255).optional(),
    projectOwner: Joi.string().max(255).optional(),
    userEmail: Joi.string().email().optional(),
    userNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
    date: Joi.date().allow(null).optional(),
    userDesignation: Joi.string().max(255).optional(),
});

export const saveProjectModuleSchema = Joi.object({
    moduleId: Joi.number().required(),
    completedChapters: Joi.number().optional(),
});


export const exportProjectQueryParamsValidator = Joi.object({
    format: Joi.string().valid('xlsx', 'csv').required(),
    allParams: Joi.boolean().optional(),
    deviations: Joi.boolean().optional(),
    flags: Joi.boolean().optional(),
    benchmark: Joi.boolean().optional(),
});


export const compareProjectValidator = Joi.object({
    currentProjectId: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
    compareProjectIds: Joi.array()
        .items(Joi.alternatives().try(Joi.number(), Joi.string()))
        .required()
        .messages({ 'any.required': 'compare project id required' }),
    moduleId: Joi.alternatives()
        .try(Joi.number(), Joi.string())
        .required()
        .messages({ 'any.required': 'module id is required' }),

    chapterId: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
});
