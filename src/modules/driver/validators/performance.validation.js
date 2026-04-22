//READY BUT USED WHEN WORKING WITH ADMIN

const Joi = require("joi");

exports.createPerformanceSchema = Joi.object({
  driver: Joi.string().required(),

  type: Joi.string()
    .valid(
      "clean_inspection",
      "training_completed",
      "late_delivery",
      "incident",
      "attendance",
    )
    .required(),

  category: Joi.string().valid("safety", "reliability", "training").required(),

  impact: Joi.number().required(),

  date: Joi.date().optional(),

  description: Joi.string().allow("").optional(),
});
