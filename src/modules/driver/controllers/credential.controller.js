const Credential = require("../models/credential.model");

// ================= CREATE CREDENTIAL =================
exports.createCredential = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: " Document File required" });
  }

  const { title, type, issuedBy, expiryDate, renewedFrom } = req.body;

  // 🔥 Prevent double renewal (optional but strong)
  if (renewedFrom) {
    const old = await Credential.findById(renewedFrom);

    if (!old || !old.isActive) {
      return res.status(400).json({
        message: "Invalid or already renewed credential",
      });
    }
    if (renewedFrom) {
      const old = await Credential.findById(renewedFrom);

      if (!old || !old.isActive) {
        return res.status(400).json({
          message: "Invalid or already renewed credential",
        });
      }

      // RESOURCE LEVEL AUTHORIZATION | DRIVER ONLY CAN RENEW HIS CREDENTIAL
      if (!old.driver.equals(req.user.id)) {
        return res.status(403).json({
          message: "Unauthorized: You can only renew your own credential",
        });
      }
    }
  }

  // ✅ Create new credential
  const newCredential = await Credential.create({
    driver: req.user.id,
    title,
    type,
    issuedBy,
    expiryDate,
    fileUrl: req.file.path,
    status: "pending", // temporary test
    isVerified: false,
    renewedFrom: renewedFrom || null,
    isActive: true,
  });

  // 🔥 Deactivate old credential
  if (renewedFrom) {
    await Credential.findByIdAndUpdate(renewedFrom, {
      isActive: false,
    });
  }

  res.status(201).json({
    message: "Credential uploaded successfully",
    data: newCredential,
  });
};

// ================= GET ALL CREDENTIAL =================
exports.getCredentials = async (req, res) => {
  const credentials = await Credential.find({
    driver: req.user.id,
    isActive: true, //  important for renewal system
  }).sort({ createdAt: -1 });

  const updated = credentials.map((c) => {
    let status = c.status;

    //  expiry logic
    if (c.status === "verified" && c.expiryDate) {
      const diffDays =
        (new Date(c.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);

      if (diffDays < 0) status = "expired";
      else if (diffDays <= 30) status = "expiringSoon";
    }

    return {
      ...c.toObject(),
      status,
    };
  });
  res.json({ count: credentials.length, data: updated }); //check
};

// ================= GET  SINGLE CREDENTIAL =================
exports.getSingleCredential = async (req, res) => {
  const credential = await Credential.findOne({
    _id: req.params.id,
    driver: req.user.id,
    isActive: true,
  });

  if (!credential) {
    return res.status(404).json({ message: " Credential not found" });
  }

  let status = credential.status;

  // 👉 Apply expiry logic ONLY if verified
  if (credential.status === "verified" && credential.expiryDate) {
    const diffDays =
      (new Date(credential.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) {
      status = "expired";
    } else if (diffDays <= 30) {
      status = "expiringSoon";
    }
  }

  const result = {
    ...credential.toObject(),
    status,
  };

  res.json({ data: result });
};
