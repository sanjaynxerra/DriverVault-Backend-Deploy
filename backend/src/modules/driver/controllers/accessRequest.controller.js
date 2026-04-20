const AccessRequest = require("../../common/models/accessRequest.model");
const Driver = require("../models/driver.model");
exports.handleAccessRequest = async (req, res) => {
  const { action } = req.body;

  const request = await AccessRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  // 🔥 get driver profile
  const driver = await Driver.findOne({
    user: req.user.id,
  });

  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }
  // 🔐 ensure driver owns this request
  if (request.driver.toString() !== driver._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (action === "approve") {
    request.status = "approved";
    request.complianceAccepted = true;

    // ⏳ access valid for 72 hours
    request.expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
  }

  if (action === "reject") {
    request.status = "rejected";
    request.complianceAccepted = false;
    request.expiresAt = null; 
  }

  await request.save();

  res.json({
    message: `Request ${action}ed`,
    request,
  });
};
