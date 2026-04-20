const Joi = require("joi");

// ================= REQUEST ACCESS =================
const requestAccessSchema = Joi.object({
  driverId: Joi.string()
    .required()
    .messages({
      "any.required": "Driver ID is required",
    }),
});

// ================= HANDLE REQUEST =================
const handleAccessSchema = Joi.object({
  action: Joi.string()
    .valid("approve", "reject")
    .required()
    .messages({
      "any.only": "Action must be approve or reject",
      "any.required": "Action is required",
    }),
});

module.exports = {
  requestAccessSchema,
  handleAccessSchema,
};