const Joi = require('joi');

// Validation siginup
const siginupValidation = (data)=>{
    const schema = {
        firstName :Joi.string().min(3).required(),
        lastName  :Joi.string().min(3).required(),
        email     :Joi.string().min(6).required().email(),
        password  :Joi.string().min(6).required(),
        confirmPassword: Joi.string().min(6).required(),
    }
   return Joi.validate(data,schema)
};

// Validation Login
const loginValidation = (data)=>{
    const schema = {
        email     :Joi.string().min(6).required().email(),
        password  :Joi.string().min(6).required()
    }
   return Joi.validate(data,schema);
};
 
// validation Email
const isEmail = (data) =>{
    const schema = {
        email   :Joi.string().email().required()
    }
    return Joi.validate(data,schema);
}

const passAndConfirm = (data) =>{
    const schema = {
        password :Joi.string().required().min(6),
        confirmPassword :Joi.string().required().min(6)
    }
    return Joi.validate(data,schema)
};

module.exports.siginupValidation = siginupValidation;
module.exports.loginValidation = loginValidation;
module.exports.isEmail = isEmail;
module.exports.passAndConfirm = passAndConfirm;