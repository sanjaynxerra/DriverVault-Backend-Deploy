
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");


// 🔥 Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "driver_vault/profile_photos",
    // transformation: [{ width: 300, height: 300, crop: "fill" }],  
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

module.exports = upload;
