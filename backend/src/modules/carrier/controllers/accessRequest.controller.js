const AccessRequest = require("../../common/models/accessRequest.model");
const Carrier = require("../models/carrier.model");
const Driver = require("../../driver/models/driver.model");

exports.requestAccess = async (req, res) => {
  const { driverId } = req.body;

  // ✅ 1. validate driver
  const driver = await Driver.findById(driverId);
  if (!driver) {
    return res.status(400).json({
      message: "Invalid driver.",
    });
  }

  // ✅ 2. get carrier profile
  const carrierProfile = await Carrier.findOne({
    user: req.user.id,
  });

  if (!carrierProfile) {
    return res.status(404).json({
      message: "Carrier profile not found",
    });
  }

  // ✅ 3. check existing request
  const existing = await AccessRequest.findOne({
    driver: driverId,
    carrierProfile: carrierProfile._id,
  });

  if (existing) {
    // ❌ already pending
    if (existing.status === "pending") {
      return res.status(400).json({
        message: "Request already pending",
      });
    }

    // ❌ already approved and not expired
    if (
      existing.status === "approved" &&
      existing.expiresAt &&
      existing.expiresAt > new Date()
    ) {
      return res.status(400).json({
        message: "Access already granted",
      });
    }
  }

  // ✅ 4. create NEW request (never reuse)
  const request = await AccessRequest.create({
    driver: driverId,
    carrierProfile: carrierProfile._id,
  });

  res.status(201).json({
    message: "Access request sent",
    request,
  });
};
