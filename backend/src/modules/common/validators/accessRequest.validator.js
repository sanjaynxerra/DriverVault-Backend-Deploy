const Joi = require("joi");

// ================= REQUEST ACCESS =================
const requestAccessSchema = Joi.object({
  driverId: Joi.string().required().messages({
    "any.required": "Driver ID is required",
  }),
});

// ================= HANDLE REQUEST =================
const handleAccessSchema = Joi.object({
  action: Joi.string().valid("approve", "reject").required().messages({
    "any.only": "Action must be approve or reject",
    "any.required": "Action is required",
  }),

  notes: Joi.string()
    .allow("") // allow empty string
    .optional()
    .max(500), // optional limit
});

module.exports = {
  requestAccessSchema,
  handleAccessSchema,
};
