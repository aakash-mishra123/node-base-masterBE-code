import Joi from 'joi';

export const sectionFieldValueValidationSchema = Joi.object({
    projectId: Joi.number().required(),
    moduleId: Joi.number().required(),
    chapterId: Joi.number().required(),
    sectionId: Joi.number().required(),
    sectionFieldId: Joi.number().required(),
    answer: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).required(),
    remark: Joi.string().optional().allow(null),
    isFlaged: Joi.number().valid(0, 1).optional(),
});
