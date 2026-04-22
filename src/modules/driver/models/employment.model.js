const mongoose = require("mongoose");

const employmentSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver", 
      required: true,
    },

    company: String,
    role: String,
    startDate: Date,
    endDate: Date,
    isCurrent: Boolean,

    //  for dispute  
    status: {
      type: String,
      enum: ["active", "disputed", "corrected"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employment", employmentSchema);