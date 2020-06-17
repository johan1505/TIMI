const Joi = require('@hapi/joi');

const registerSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required().email(),
	password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
	email: Joi.string().required().email(),
	password: Joi.string().min(6).required(),
});

module.exports = {
	registerSchema,
	loginSchema,
};
