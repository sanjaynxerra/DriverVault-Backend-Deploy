const mongoose = require("mongoose");

const accessRequestSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },

    carrierProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carrier",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    complianceAccepted: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

// 🔥 UPDATE INDEX
accessRequestSchema.index(
  { driver: 1, carrierProfile: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } },
);

module.exports = mongoose.model("AccessRequest", accessRequestSchema);
