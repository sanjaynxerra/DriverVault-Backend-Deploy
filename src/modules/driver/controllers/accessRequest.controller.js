const AccessRequest = require("../../common/models/accessRequest.model");
const Driver = require("../models/driver.model");
const Carrier = require("../../carrier/models/carrier.model");

exports.handleAccessRequest = async (req, res) => {
  const { action, notes } = req.body;

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
    request.notes = notes;

    // ⏳ access valid for 72 hours
    request.expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
  }

  if (action === "reject") {
    request.status = "rejected";
    request.complianceAccepted = false;
    request.notes = notes;
    request.expiresAt = null;
  }

  await request.save();

  res.json({
    message: `Request ${action}ed`,
    request,
  });
};

exports.getDriverAccessRequests = async (req, res) => {
  const driver = await Driver.findOne({ user: req.user.id });

  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }

  const requests = await AccessRequest.find({
    driver: driver._id,
  })
    .populate("carrierProfile", "companyName")
    .sort({ createdAt: -1 });

  const now = new Date();

  const formatted = requests.map((r) => {
    let status = r.status;

    if (r.status === "approved" && r.expiresAt < now) {
      status = "expired";
    }

    return {
      id: r._id,
      companyName: r.carrierProfile?.companyName || "Carrier", // 🔥 FIX
      status,
      notes: r.notes,
      createdAt: r.createdAt,
      expiresAt: r.expiresAt,
    };
  });

  const stats = {
    total: formatted.length,
    pending: formatted.filter((r) => r.status === "pending").length,
    approved: formatted.filter((r) => r.status === "approved").length,
    revoked: formatted.filter((r) => r.status === "rejected").length,
    expired: formatted.filter((r) => r.status === "expired").length,
  };

  res.json({
    stats,
    requests: formatted,
  });
};

exports.getAccessRequestById = async (req, res) => {
  const request = await AccessRequest.findById(req.params.id).populate(
    "carrierProfile",
    "companyName",
  );

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  res.json({
    id: request._id,
    companyName: request.carrierProfile?.companyName,
    status: request.status,
    createdAt: request.createdAt,
    expiresAt: request.expiresAt,
  });
};
