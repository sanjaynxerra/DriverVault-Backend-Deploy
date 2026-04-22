const Joi = require("joi");

exports.updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50),

  lastName: Joi.string().trim().min(2).max(50),

  bio: Joi.string().trim().max(500).allow(""),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Phone must be 10 digits",
    }),

  
  licenseType: Joi.string().valid("cdl-a", "cdl-b", "non-cdl"),

  experienceYears: Joi.number().min(0).max(50),

  availability: Joi.string().valid("available", "unavailable"),

 
  location: Joi.object({
    city: Joi.string().trim().allow("", null),
    state: Joi.string().trim().allow("", null),
    zipCode: Joi.string().trim().allow("", null),
  }),
});