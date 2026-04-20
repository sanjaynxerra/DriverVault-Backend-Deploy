const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { protect } = require("../../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const validate = require("../../../middlewares/validate.middleware");
const {
  handleAccessRequest,
} = require("../controllers/accessRequest.controller");
const {
  handleAccessSchema,
} = require("../../common/validators/accessRequest.validator");

// ================= DRIVER =================

// Approve / Reject request
router.patch(
  "/:id",
  protect,
  authorizeRoles("driver"),
  validate(handleAccessSchema),
  asyncHandler(handleAccessRequest),
);

module.exports = router;
