const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // ✅ lowercase
  api_key: process.env.CLOUDINARY_API_KEY,       // ✅ lowercase
  api_secret: process.env.CLOUDINARY_API_SECRET, // ✅ lowercase
});

module.exports = cloudinary;