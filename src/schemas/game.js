import Joi from 'joi';

export const schemaGame = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().allow('').optional(),
    stockTotal: Joi.number().positive(),
    pricePerDay: Joi.number().positive()
});