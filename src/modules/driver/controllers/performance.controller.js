const PerformanceRecord = require("../models/performanceRecord.model");
const mongoose = require("mongoose");

const {
  getDriverPerformanceData,
} = require("../../../services/performance.service");

const Driver = require("../models/driver.model");

// ================= GET FULL PERFORMANCE =================
exports.getPerformance = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.id });

    if (!driver) {
      return res.status(404).json({
        message: "Driver profile not found",
      });
    }

    const { records, scores, history } = await getDriverPerformanceData(
      driver._id,
    );

    return res.json({
      scores,
      history,
      records,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch performance data",
    });
  }
};

// ================= GET ONLY RECORDS =================
exports.getPerformanceRecords = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.id });

    if (!driver) {
      return res.status(404).json({
        message: "Driver profile not found",
      });
    }

    const records = await PerformanceRecord.find({
      driver: driver._id,
      isActive: true,
      status: "verified",
    }).sort({ date: -1 });

    return res.json(records);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch performance records",
    });
  }
};

// ================= CARRIER / ADMIN ACCESS  =================
exports.getDriverPerformanceById = async (req, res) => {
  try {
    const { driverId } = req.params;

    // 🔥 Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({
        message: "Invalid driver ID",
      });
    }

    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    const { records, scores, history } = await getDriverPerformanceData(
      driver._id,
    );

    return res.json({
      scores,
      history,
      records,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch driver performance",
    });
  }
};
