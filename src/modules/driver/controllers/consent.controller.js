const ConsentPreferences = require("../models/consentPreferences.model");
const Driver = require("../models/driver.model");


// ================= HELPER =================
const allowedFields = [
  "personalInfo",
  "cdl",
  "safety",
  "employment",
  "performance",
  "medical",
  "financial",
];

const DEFAULT_PREFERENCES = {
  personalInfo: true,
  cdl: true,
  safety: true,
  employment: true,
  performance: true,
  medical: false,
  financial: false,
};

const formatPreferences = (prefs) => {
  const source = prefs?.toObject ? prefs.toObject() : prefs || {};

  return allowedFields.reduce(
    (formatted, field) => ({
      ...formatted,
      [field]:
        source[field] === undefined
          ? DEFAULT_PREFERENCES[field]
          : Boolean(source[field]),
    }),
    {},
  );
};

// ================= GET PREFERENCES =================
exports.getPreferences = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const driver = await Driver.findOne({ user: req.user.id });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    let prefs = await ConsentPreferences.findOne({
      driverId: driver._id,
    });

    // create default if not exists
    if (!prefs) {
      prefs = await ConsentPreferences.create({
        driverId: driver._id,
      });
    }

    return res.json({
      data: formatPreferences(prefs),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch consent preferences",
    });
  }
};


// ================= UPDATE PREFERENCES =================
exports.updatePreferences = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const driver = await Driver.findOne({ user: req.user.id });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // 🔒 whitelist fields only
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // ❌ no valid fields sent
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No valid fields to update",
      });
    }

    const updated = await ConsentPreferences.findOneAndUpdate(
      { driverId: driver._id },
      updateData,
      {
        upsert: true,
        new: true,
      }
    );

    return res.json({
      message: "Preferences updated successfully",
      data: formatPreferences(updated),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update consent preferences",
    });
  }
};
