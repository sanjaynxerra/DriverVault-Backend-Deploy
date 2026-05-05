const AccessRequest = require("../../common/models/accessRequest.model");
const Credential = require("../../driver/models/credential.model");

// import analytics
const { getCarrierAnalyticsData } = require("./analytics.service");

// ================= MAIN SERVICE =================

const getDashboardData = async (carrierId) => {
  const now = new Date();

  // ================= 1. APPROVED DRIVERS =================
  const accessList = await AccessRequest.find({
    carrierProfile: carrierId,
    status: "approved",
    expiresAt: { $gt: now },
  });

  const driverIds = accessList.map((a) => a.driver);

  // ================= 2. FILTER VERIFIED DRIVERS =================
  const verifiedDriverAgg = await Credential.aggregate([
    {
      $match: {
        driver: { $in: driverIds },
        status: "verified",
        isActive: true,
        $or: [{ expiryDate: null }, { expiryDate: { $gt: now } }],
      },
    },
    {
      $group: { _id: "$driver" },
    },
  ]);

  const verifiedDriverIds = verifiedDriverAgg.map((d) =>
    d._id.toString()
  );

  const filteredDrivers = driverIds.filter((id) =>
    verifiedDriverIds.includes(id.toString())
  );

  // ================= 3. STATS =================
  const totalDrivers = filteredDrivers.length;

  const pendingRequests = await AccessRequest.countDocuments({
    carrierProfile: carrierId,
    status: "pending",
  });

  // ================= 4. GET ANALYTICS =================
  const analytics = await getCarrierAnalyticsData(carrierId);

  // ================= 5. FINAL RESPONSE =================
  return {
    stats: {
      totalDrivers,
      verifiedProfiles: totalDrivers, // same as filtered
      searchesToday: 12,
      pendingRequests,
    },

    // 🔥 FIXED MAPPING
    scoreTrend: analytics?.scoreTrend || [],

    distribution: analytics?.scoreDistribution || {},

    performance: {
      avgSafety: analytics?.stats?.avgSafety ?? 0,
      avgReliability: analytics?.stats?.avgReliability ?? 0,
      compliance: analytics?.stats?.complianceRate ?? 0,
    },

    recentActivity: [
      { type: "approved", message: "Access approved", time: "1h ago" },
      { type: "request", message: "Request sent", time: "3h ago" },
    ],
  };
};

module.exports = {
  getDashboardData,
};