const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const driverRoutes = require("../modules/driver/routes/driver.route");
const carrierRoutes = require("../modules/carrier/routes/carrier.route");
const driverPublicRoutes = require("../modules/driver/routes/driverPublic.route");

// ================= PUBLIC/PROTECTED (carrier/admin)=================
router.use("/", driverPublicRoutes);

router.use("/auth", authRoutes);
router.use("/driver", driverRoutes);
router.use("/carrier", carrierRoutes);

module.exports = router;
