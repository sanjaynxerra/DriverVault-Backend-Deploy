const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { getUser, getUserById } = require("../controllers/user");
const { protect } = require("../../../middlewares/auth.middleware");

router.get("/all-user", protect, authorizeRoles("admin"), asyncHandler(getUser));
router.get("/user/:id", protect, authorizeRoles("admin"), asyncHandler(getUserById));


module.exports = router;
