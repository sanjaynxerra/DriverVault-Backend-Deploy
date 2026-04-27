const mongoose = require("mongoose");
const AccessRequest = require("../modules/common/models/accessRequest.model");
const Carrier = require("../modules/carrier/models/carrier.model");

const checkDriverAccess = (resource) => {
  return async (req, res, next) => {
    try {
      const { driverId } = req.params;

      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (req.user.role !== "carrier" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      if (!mongoose.Types.ObjectId.isValid(driverId)) {
        return res.status(400).json({ message: "Invalid driver ID" });
      }

      if (req.user.role === "admin") {
        return next();
      }

      const carrier = await Carrier.findOne({ user: req.user.id });

      if (!carrier) {
        return res.status(403).json({
          message: "Carrier profile not found",
        });
      }

      const access = await AccessRequest.findOne({
        driver: driverId,
        carrierProfile: carrier._id,
        status: "approved",
        $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
      }).sort({ createdAt: -1 });

      if (!access) {
        return res.status(403).json({
          message: "Access not granted or expired",
        });
      }

      if (!access.allowedData || !access.allowedData[resource]) {
        return res.status(403).json({
          message: `${resource} access not allowed`,
        });
      }

      req.access = access;
      req.carrier = carrier;

      return next();
    } catch (error) {
      console.log("ACCESS CHECK ERROR:", error);
      return res.status(500).json({
        message: "Access validation failed",
      });
    }
  };
};

module.exports = checkDriverAccess;
