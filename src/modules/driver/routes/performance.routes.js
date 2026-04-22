const express = require("express");
const router = express.Router();

const performanceController = require("../controllers/performance.controller");

const { protect } = require("../../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const asyncHandler = require("express-async-handler");

// ================= PERFORMANCE ROUTES =================

// 🔥 FULL DASHBOARD (driver own)
router
  .route("/")
  .get(
    protect,
    authorizeRoles("driver"),
    asyncHandler(performanceController.getPerformance),
  );

// 🔥 ONLY RECORDS (driver own)
router
  .route("/records")
  .get(
    protect,
    authorizeRoles("driver"),
    asyncHandler(performanceController.getPerformanceRecords),
  );

// 🔥 CARRIER / ADMIN VIEW DRIVER PERFORMANCE
router
  .route("/:driverId")
  .get(
    protect,
    authorizeRoles("carrier", "admin"),
    asyncHandler(performanceController.getDriverPerformanceById),
  );

module.exports = router;