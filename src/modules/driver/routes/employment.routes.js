const express = require("express");
const router = express.Router();

const {
  createEmployment,
  getEmployment,
  updateEmployment,
  deleteEmployment,
} = require("../controllers/employment.controller");

const { protect } = require("../../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../../middlewares/role.middleware");

router.use(protect, authorizeRoles("driver"));

router.post("/", createEmployment);
router.get("/", getEmployment);
router.put("/:id", updateEmployment);
router.delete("/:id", deleteEmployment);

module.exports = router;