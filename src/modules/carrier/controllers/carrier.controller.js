const Carrier = require("../models/carrier.model");
const { getDashboardData } = require("../services/dashboard.service");

// ================= DASHBOARD CONTROLLER =================

const getDashboard = async (req, res) => {
  const userId = req.user.id;

  // ================= GET CARRIER PROFILE =================

  const carrier = await Carrier.findOne({ user: userId });

  if (!carrier) {
    const error = new Error("Carrier profile not found");
    error.statusCode = 404;
    throw error;
  }

  // ================= GET DASHBOARD DATA =================
  const data = await getDashboardData(carrier._id);

  // ================= RESPONSE =================
  res.status(200).json({
    success: true,
    data,
  });
};

module.exports = {
  getDashboard,
};
