import Joi from 'joi';

export const schemaGame = Joi.object({
    name: Joi.string().required(),
    image,
    stockTotal: Joi.number().positive(),
    pricePerDay: Joi.number().positive()
});