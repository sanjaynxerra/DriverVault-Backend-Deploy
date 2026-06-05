const AuditLog = require("../../common/models/auditLog.model");

exports.getDriverActivities = async (id) => {
  let activity =  await AuditLog.find({
    $or: [{ performedBy: id }, { targetUser: id }],
  })
    .populate({
      path: "performedBy",
      select: "email role",
    })

    .sort({ createdAt: -1 })
    .limit(10)
    return activity;
};

