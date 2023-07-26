import coreJoi from 'joi';
import joiDate from '@joi/date';

const Joi = coreJoi.extend(joiDate);

export const schemaCustomer = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().min(10).max(11).regex(/^\d+$/),
    cpf: Joi.string().regex(/^\d{11}$/),
    birthday: Joi.date().format('YYYY-MM-DD')
});