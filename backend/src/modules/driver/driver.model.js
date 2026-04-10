const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    licenseType: {
      type: String,
      enum: ["cdl-a", "cdl-b", "non-cdl"],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Driver", driverSchema);
