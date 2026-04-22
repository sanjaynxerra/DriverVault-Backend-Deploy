const express = require("express");
const router = express.Router();

const credentialController = require("../controllers/credential.controller");

const { protect } = require("../../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const asyncHandler = require("express-async-handler");
const upload = require("../../../middlewares/upload.middleware");

const {
  createCredentialSchema,
} = require("../validators/credential.validator");

const validate = require("../../../middlewares/validate.middleware");

// ================= CREDENTIAL ROUTES =================

// ================= CREATE CREDENTIAL  =================
router.post(
  "/",
  protect,
  authorizeRoles("driver"),
  validate(createCredentialSchema),
  upload.single("document"),
  asyncHandler(credentialController.createCredential),
);
// ================= GET ALL CREDENTIAL =================

router.get(
  "/",
  protect,
  authorizeRoles("driver"),
  credentialController.getCredentials,
);

// ================= GET SINGLE CREDENTIAL =================

router.get(
  "/:id",
  protect,
  authorizeRoles("driver"),
  credentialController.getSingleCredential,
);

module.exports = router;
