const AccessRequest = require("../modules/common/models/accessRequest.model");
const Carrier = require("../modules/carrier/models/carrier.model");

module.exports = async (req, res, next) => {
  const { driverId } = req.params;

  const carrierProfile = await Carrier.findOne({
    user: req.user.id,
  });

  if (!carrierProfile) {
    return res.status(403).json({ message: "Access denied" });
  }

  const access = await AccessRequest.findOne({
    driver: driverId,
    carrierProfile: carrierProfile._id, // 🔥 FIX
    status: "approved",
    complianceAccepted: true,
    expiresAt: { $gt: new Date() },
  });

  if (!access) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
};