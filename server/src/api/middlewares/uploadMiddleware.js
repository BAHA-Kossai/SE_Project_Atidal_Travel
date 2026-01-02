import multer from 'multer';

// Use memory storage so we can directly upload to Supabase
const storage = multer.memoryStorage();

// File filter to validate file types and sizes
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP`));
  } else {
    cb(null, true);
  }
};

// Configure multer for Supabase upload
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export default upload;

