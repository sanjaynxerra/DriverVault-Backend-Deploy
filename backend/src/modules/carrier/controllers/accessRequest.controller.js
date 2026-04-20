const AccessRequest = require("../../common/models/accessRequest.model");

exports.requestAccess = async (req, res) => {
  const { driverId } = req.body;

  // 🔍 check existing request
  let request = await AccessRequest.findOne({
    driver: driverId,
    carrier: req.user.id,
  });

  if (request) {
    // 🔁 reuse existing
    request.status = "pending";
    request.complianceAccepted = false;
    request.expiresAt = null;

    await request.save();

    return res.json({
      message: "Access request re-sent",
      request,
    });
  }

  // 🆕 create new only if none exists
  request = await AccessRequest.create({
    driver: driverId,
    carrier: req.user.id,
  });

  res.status(201).json({
    message: "Access request sent",
    request,
  });
};
