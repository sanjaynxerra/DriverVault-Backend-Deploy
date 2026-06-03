const express = require("express");
const router = express.Router();

const userRoutes = require("./user")
const credentialRoutes = require("./credential")
const activityRoute = require("./activityLog")
const disputeRoute = require("./dispute")
const dashboardRoute = require("./dashboard")

router.use("/user", userRoutes)
router.use("/credential", credentialRoutes)
router.use("/activity", activityRoute)
router.use("/dispute", disputeRoute)
router.use("/dashboard", dashboardRoute)

module.exports = router;