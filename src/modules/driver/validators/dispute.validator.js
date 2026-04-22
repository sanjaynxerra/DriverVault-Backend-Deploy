const Joi = require("joi");

exports.createDisputeSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),

  description: Joi.string().min(10).max(1000).required(),

  category: Joi.string()
    .valid(
      "safety_record",
      "training",
      "reliability",
      "employment_history",
      "credential",
      "other",
    )
    .required(),

  relatedRecord: Joi.string().required(), // ObjectId

  relatedModel: Joi.string()
    .valid("PerformanceRecord", "Credential", "Employment")
    .optional(),
});
