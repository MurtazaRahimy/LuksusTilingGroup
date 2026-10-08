import sharp from "sharp";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_WIDTH = 1600;

// Cloudinary reads CLOUDINARY_URL from the environment automatically.
const useCloudinary = Boolean(process.env.CLOUDINARY_URL);

async function optimise(file: File): Promise<Buffer> {
  const input = Buffer.from(await file.arrayBuffer());
  return sharp(input)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "luksus", resource_type: "image", public_id: randomUUID() },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Upload failed"));
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

export async function saveOptimizedImage(file: File): Promise<string> {
  const buffer = await optimise(file);

  if (useCloudinary) {
    return uploadToCloudinary(buffer);
  }

  // Local development: save to public/uploads like before.
  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.webp`;
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/${filename}`;
}

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB — Netlify's request size limit
