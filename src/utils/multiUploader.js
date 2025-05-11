import multer from 'multer';
import path from 'path';

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed'));
  } else {
    cb(null, true);
  }
};

// Middleware for multiple file uploads
const multiUploader = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
}).fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 5 },
]);

export { multiUploader };
