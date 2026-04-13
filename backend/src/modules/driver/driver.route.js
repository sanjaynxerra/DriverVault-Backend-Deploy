const express = require("express");
const router = express.Router();
const driverController = require("./driver.controller");
const { protect } = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/role.middleware");
const asyncHandler = require("express-async-handler");
const upload = require("../../middlewares/upload.middleware");

// ================= PRIVATE ROUTES =================

// 🔐 Get own profile
router.get(
  "/profile",
  protect,
  authorizeRoles("driver"),
  asyncHandler(driverController.getDriverProfile),
);

// ✏️ Update own profile
router.put(
  "/profile",
  protect,
  authorizeRoles("driver"),
  upload.single("profilePhoto"), 
  asyncHandler(driverController.updateDriverProfile),
);

// ================= PUBLIC ROUTE =================

// 🌐 Public driver profile (no auth)
router.get(
  "/public/:id",
  driverController.getPublicDriverProfile, // we will implement next
);

module.exports = router;
