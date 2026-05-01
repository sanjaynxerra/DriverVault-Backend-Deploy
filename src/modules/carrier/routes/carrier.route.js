const express = require("express");
const router = express.Router();
const { protect } = require("../../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const asyncHandler = require("express-async-handler");
const accessRequestRoutes = require("./accessRequest.routes");
const {
  getVerifiedDrivers,
  getMyDrivers,
} = require("../controllers/accessRequest.controller");

const analyticsRoutes = require("./analytics.routes");
// ================= SUB ROUTES =================

// Access request system
router.use("/access-request", accessRequestRoutes);
router.use("/analytics", analyticsRoutes);

// Verified driver discovery for carriers
router.get(
  "/drivers",
  protect,
  authorizeRoles("carrier"),
  asyncHandler(getVerifiedDrivers),
);

// Drivers with active approved access for this carrier
router.get(
  "/my-drivers",
  protect,
  authorizeRoles("carrier"),
  asyncHandler(getMyDrivers),
);

// ================= OPTIONAL FUTURE =================

// Example: carrier profile

module.exports = router;
