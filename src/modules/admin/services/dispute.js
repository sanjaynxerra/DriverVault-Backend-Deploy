const Dispute = require("../../common/models/dispute.model");

exports.getDisputeById = async (id) => {
  return await Dispute.findById({ _id: id }).populate("driver").populate('relatedRecord');
};

exports.updateDisputeStatus = async (id, status, resolution) => {
  const allowedStatuses = ["under_review", "resolved", "rejected"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status");
  }
  
   return await Dispute.findByIdAndUpdate(
    id,
    {
      $set: {
        status,
        resolution,
      },
    },
    {
      new: true,
    }
  );
};

exports.getOpenDisputes = async () => {
  return Dispute.find({status: "submitted"})
}

exports.getDisputeActivity = async () =>{
  const currentYear = new Date().getFullYear();

  const submittedData = await Dispute.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lt: new Date(currentYear + 1, 0, 1),
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const resolvedData = await Dispute.aggregate([
    {
      $match: {
        status: "resolved",
        "resolution.resolvedAt": { $exists: true },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$resolution.resolvedAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const disputeStats = months.map((month, index) => {
    const submitted = submittedData.find(
      (item) => item._id.month === index + 1
    );

    const resolved = resolvedData.find(
      (item) => item._id.month === index + 1
    );

    return {
      month,
      submitted: submitted?.count || 0,
      resolved: resolved?.count || 0,
    };
  });

  return disputeStats;
}

exports.getDisputeCountByDriver = async (driverId) =>{
  return Dispute.countDocuments({driver:driverId})
}