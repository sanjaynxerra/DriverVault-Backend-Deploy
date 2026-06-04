const mongoose = require("mongoose");
const AccessRequest = require("../modules/common/models/accessRequest.model");
const Carrier = require("../modules/carrier/models/carrier.model");
const ConsentPreferences = require("../modules/driver/models/consentPreferences.model");

const checkDriverAccess = (resource) => {
  return async (req, res, next) => {
    try {
      const { driverId } = req.params;

      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if ( req.user.role !== "admin" &&
        req.user.role !== "carrier" 
      ) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(driverId)) {
        return res.status(400).json({
          message: "Invalid driver ID",
        });
      }

      // Admin bypass
      if (req.user.role === "admin") {
        return next();
      }

      const carrier = await Carrier.findOne({
        user: req.user.id,
      });

      if (!carrier) {
        return res.status(403).json({
          message: "Carrier profile not found",
        });
      }

      // Driver current preferences
        
      const preferences = await ConsentPreferences.findOne({
        driverId,
      });

      if (!preferences) {
        return res.status(403).json({
          message: "Driver preferences not found",
        });
      }

      if (preferences[resource] !== true) {
        return res.status(403).json({
          message: `${resource} sharing disabled by driver`,
        });
      }
   
      // req.access = access;
      req.carrier = carrier;

      next();
    } catch (error) {
      console.error(
        "ACCESS CHECK ERROR:",
        error
      );

      return res.status(500).json({
        message: "Access validation failed",
      });
    }
  };
};

module.exports = checkDriverAccess;
