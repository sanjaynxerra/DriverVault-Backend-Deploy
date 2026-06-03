const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { protect } = require("../../../middlewares/auth.middleware");
const { getDashboardLog } = require("../controllers/dashboard");

router.get("/activity", protect, authorizeRoles("admin"), asyncHandler(getDashboardLog));

module.exports = router;