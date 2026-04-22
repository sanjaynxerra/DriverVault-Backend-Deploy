const express = require("express");
const router = express.Router();

const performanceController = require("../controllers/performance.controller");

const { protect } = require("../../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const asyncHandler = require("express-async-handler");

// ================= PERFORMANCE ROUTES =================

// 🔥 FULL DASHBOARD (scores + history + records)
router
  .route("/")
  .get(
    protect,
    authorizeRoles("driver"),
    asyncHandler(performanceController.getPerformance),
  );

// 🔥 ONLY RECORDS (for table / pagination / admin use)
router
  .route("/records")
  .get(
    protect,
    authorizeRoles("driver"),
    asyncHandler(performanceController.getPerformanceRecords),
  );

module.exports = router;
