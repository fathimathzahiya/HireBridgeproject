const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const directories = {
  resume: path.join(__dirname, '../uploads/resume'),
  profileImage: path.join(__dirname, '../uploads/student'),
  certification: path.join(__dirname, '../uploads'),
};

Object.values(directories).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      cb(null, directories.resume);
    } else if (file.fieldname === 'profileImage') {
      cb(null, directories.profileImage);
    } else {
      cb(null, directories.certification);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for specific constraints
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume' || file.fieldname === 'certification') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: PDF`), false);
    }
  } else if (file.fieldname === 'profileImage') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: Images`), false);
    }
  } else {
    cb(null, true);
  }
};

const studentUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = studentUpload;
