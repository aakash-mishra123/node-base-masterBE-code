import Joi from 'joi';

export const sectionFieldValueSchema = Joi.array().items(
    Joi.object({
        sectionId: Joi.number().required(),
        sectionFieldId: Joi.number().required(),
        answer: Joi.alternatives().try(
            Joi.string(),
            Joi.array().items(Joi.string())
        ).required(),
        isFlaged: Joi.number().valid(0, 1).optional(),
        remark: Joi.string().allow(null, '').optional(),
        benchmarkAnswer: Joi.array().items(Joi.string()).required(),
        anyOtherAnswer: Joi.string().allow(null, '').optional(),
    })
);
