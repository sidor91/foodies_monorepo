import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface ICloudinaryService {
  uploadImage(file: Buffer, folder: string): Promise<CloudinaryUploadResult>;
  deleteImage(publicId: string): Promise<void>;
}

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

class CloudinaryService implements ICloudinaryService {
  uploadImage(file: Buffer, folder: string): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary returned no upload result"));
            return;
          }

          resolve({ secureUrl: result.secure_url, publicId: result.public_id });
        },
      );

      uploadStream.end(file);
    });
  }

  deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, { resource_type: "image" }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (result.result !== "ok" && result.result !== "not found") {
          reject(new Error(`Cloudinary deletion failed: ${result.result}`));
          return;
        }

        resolve();
      });
    });
  }
}

export const cloudinaryService: ICloudinaryService = new CloudinaryService();
