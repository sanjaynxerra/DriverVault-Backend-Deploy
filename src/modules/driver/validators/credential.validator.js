const Joi = require("joi");

exports.createCredentialSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required(),

  type: Joi.string()
    .lowercase()
    .valid("cdl", "medical", "hazmat", "training", "twic", "safety", "other")
    .required(),

  issuedBy: Joi.string()
    .trim()
    .max(100)
    .optional(),

  expiryDate: Joi.date()
    .iso()
    .greater("now") 
    .optional(),

  //  for renewal system
  renewedFrom: Joi.string()
    .length(24)
    .hex()
    .optional(),
});