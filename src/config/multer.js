const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads")); // Folder penyimpanan
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Format nama file
  },
});

// Filter untuk memastikan hanya gambar yang di-upload
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Maksimal ukuran 5MB
  fileFilter: fileFilter,
});

module.exports = upload;
