const Carrier = require("../models/carrier.model");
const { getCarrierAnalyticsData } = require("../services/analytics.service");

exports.getCarrierAnalytics = async (req, res) => {
  const carrierProfile = await Carrier.findOne({
    user: req.user.id
  });

  if (!carrierProfile) {
    return res.status(404).json({
      message: "Carrier profile not found"
    });
  }

  const data = await getCarrierAnalyticsData(carrierProfile._id);

  return res.json(data);
};