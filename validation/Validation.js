const Joi = require('joi');


const registerValidation = async (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    const temp = await schema.validateAsync({ ...data });
    return temp;
}

const loginValidation = async (data) => {
    const schema = Joi.object({
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    const temp = await schema.validateAsync({ ...data });
    return temp;
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
