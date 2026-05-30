const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads/company directory if it doesn't exist
const companyUploadsDir = path.join(__dirname, '../uploads/company');
if (!fs.existsSync(companyUploadsDir)) {
  fs.mkdirSync(companyUploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, companyUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profilePhoto-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for image only
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and WEBP image files are allowed!'), false);
  }
};

const companyUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = companyUpload;
