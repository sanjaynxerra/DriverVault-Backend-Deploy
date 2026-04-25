const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { protect } = require("../../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const validate = require("../../../middlewares/validate.middleware");
const accessController = require("../controllers/accessRequest.controller");
const {
  handleAccessSchema,
} = require("../../common/validators/accessRequest.validator");

// ================= DRIVER =================

// GET ALL REQUEST
router.get(
  "/",
  protect,
  authorizeRoles("driver"),
  asyncHandler(accessController.getDriverAccessRequests),
);

// GET REQUEST BY SINGLE ID
router.get(
  "/:id",
  protect,
  authorizeRoles("driver"),
  asyncHandler(accessController.getAccessRequestById),
);

// APPROVE OR REJECT REQUEST BY ID  
router.patch(
  "/:id",
  protect,
  authorizeRoles("driver"),
  validate(handleAccessSchema),
  asyncHandler(accessController.handleAccessRequest),
);

module.exports = router;
