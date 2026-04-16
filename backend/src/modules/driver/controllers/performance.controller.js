const PerformanceRecord = require("../models/performanceRecord.model");
const mongoose = require("mongoose");
const {
  calculateScores,
  getDecayWeight,
} = require("../../../services/performance.service");

const Driver = require("../models/driver.model");

// ================= GET FULL PERFORMANCE =================

exports.getPerformance = async (req, res) => {
  const driverProfile = await Driver.findOne({
    user: req.user.id,
  });

  // ✅ Fetch records
  const records = await PerformanceRecord.find({
    driver: driverProfile._id,
    isActive: true,
    status: "verified",
  });
  // ✅ Get overall scores from service
  const scores = calculateScores(records);

  // ================= HISTORY =================
  const monthly = {};

  records.forEach((r) => {
    const dateObj = new Date(r.date);

    const key = dateObj.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!monthly[key]) {
      monthly[key] = {
        safety: 0,
        reliability: 0,
        training: 0,
      };
    }

    const weight = getDecayWeight(r.date);
    const value = r.impact * weight;

    monthly[key][r.category] += value;
  });

  // ✅ normalize
  const normalize = (score) => Math.max(0, Math.min(100, 80 + score));

  // ================= LAST 6 MONTHS =================
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

    const key = d.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    const label = d.toLocaleString("default", {
      month: "short",
    });

    months.push({ key, label });
  }

  // ================= BUILD HISTORY (CARRY FORWARD) =================
  let last = {
    safety: 0,
    reliability: 0,
    training: 0,
  };

  const history = months.map(({ key, label }) => {
    if (monthly[key]) {
      last = monthly[key];
    }

    const safety = normalize(last.safety);
    const reliability = normalize(last.reliability);
    const training = normalize(last.training);

    const overall = Math.round((safety + reliability + training) / 3);

    return {
      month: label,
      safety: Math.round(safety),
      reliability: Math.round(reliability),
      overall,
    };
  });

  // ================= RESPONSE =================
  res.json({
    scores,
    history,
    records,
  });
};

// ================= GET ONLY RECORDS =================
exports.getPerformanceRecords = async (req, res) => {
  try {
    const records = await PerformanceRecord.find({
      driver: req.user.id,
      isActive: true,
      status: "verified",
    }).sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
