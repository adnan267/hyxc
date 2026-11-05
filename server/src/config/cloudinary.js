import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConfigured = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

export function initCloudinary() {
  if (!cloudinaryConfigured()) {
    console.warn('Cloudinary is not configured: uploads are disabled until CLOUDINARY_* env vars are set.');
    return;
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Signed upload parameters for DIRECT browser -> Cloudinary uploads.
 * Files never pass through the API, which matters on Vercel (4.5 MB request limit)
 * and is required for video. The API secret never leaves the server: only a signature is returned.
 */
export function signUpload(folder = 'hyxc') {
  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder, timestamp };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    folder,
    signature,
  };
}
