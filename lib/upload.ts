import { cloudinary, cloudinaryReady } from "@/lib/cloudinary";

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  resourceType: "image" | "video" | "raw";
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
};

type UploadOptions = {
  folder?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
};

export async function uploadToCloudinary(
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  if (!cloudinaryReady()) {
    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  }

  const {
    folder = "truelove",
    resourceType = "auto"
  } = options;

  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType
        },
        (error, result) => {
          if (error || !result) {
            reject(
              error ??
                new Error(
                  "CLOUDINARY_UPLOAD_FAILED"
                )
            );

            return;
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            resourceType:
              result.resource_type as
                | "image"
                | "video"
                | "raw",
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes
          });
        }
      );

    uploadStream.end(buffer);
  });
}