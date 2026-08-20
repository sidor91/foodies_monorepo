import multer from "multer";

const imageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, callback) => {
    if (!imageMimeTypes.has(file.mimetype)) {
      callback(new Error("Only JPEG, PNG, and WebP images are allowed"));
      return;
    }

    callback(null, true);
  },
});
