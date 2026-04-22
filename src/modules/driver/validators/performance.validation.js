const Joi = require("joi");

exports.createPerformanceSchema = Joi.object({
  // ✅ Proper ObjectId validation
  driver: Joi.string()
    .length(24)
    .hex()
    .required(),

  type: Joi.string()
    .valid(
      "clean_inspection",
      "training_completed",
      "late_delivery",
      "incident",
      "attendance"
    )
    .required(),

  category: Joi.string()
    .valid("safety", "reliability", "training")
    .required(),

  // ✅ Controlled range
  impact: Joi.number()
    .min(-20)
    .max(20)
    .required(),

  date: Joi.date().optional(),

  // ✅ Cleaner
  description: Joi.string().max(300).optional(),
});