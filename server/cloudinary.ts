import { v2 as cloudinary } from 'cloudinary';

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  sizeBytes: number;
  folder: string;
}

export async function uploadImageToCloudinary(
  fileDataUrl: string,
  targetFolder: string = 'bitvolt/general'
): Promise<CloudinaryUploadResult> {
  let folder = targetFolder;
  if (!folder.startsWith('bitvolt/')) {
    folder = `bitvolt/${folder.replace(/^\/+/, '')}`;
  }

  if (!isCloudinaryConfigured()) {
    console.log('[Cloudinary] Keys not provided in environment. Falling back to local data URL storage.');
    const mockPublicId = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      publicId: mockPublicId,
      secureUrl: fileDataUrl,
      format: 'png',
      width: 1200,
      height: 800,
      sizeBytes: Math.round((fileDataUrl.length * 3) / 4),
      folder,
    };
  }

  const uploadRes = await cloudinary.uploader.upload(fileDataUrl, {
    folder,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });

  return {
    publicId: uploadRes.public_id,
    secureUrl: uploadRes.secure_url,
    format: uploadRes.format || 'png',
    width: uploadRes.width || 1200,
    height: uploadRes.height || 800,
    sizeBytes: uploadRes.bytes || 100000,
    folder: uploadRes.folder || folder,
  };
}

export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured() || !publicId) return true;
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === 'ok' || res.result === 'not found';
  } catch (err) {
    console.error('Cloudinary deletion error:', err);
    return false;
  }
}
