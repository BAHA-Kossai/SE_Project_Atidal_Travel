import multer from 'multer';
import path from 'path';
import fs from 'fs';

const rootUploadDir = path.resolve(process.cwd(), 'server', 'uploads');

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const fieldDirectoryMap = {
  destination_picture: 'destinations',
  picture: 'destinations',
  cover_image: path.join('guided-trips', 'images')
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = fieldDirectoryMap[file.fieldname] || 'misc';
    const targetDir = path.join(rootUploadDir, subDir);
    ensureDir(targetDir);
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

export const upload = multer({ storage });

export default upload;

