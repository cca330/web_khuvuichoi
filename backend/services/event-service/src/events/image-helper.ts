import * as fs from 'fs';
import * as path from 'path';

// Base path for storing images
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types and their magic bytes signatures
const ALLOWED_TYPES: Record<string, number[]> = {
  'jpeg': [255, 216, 255],
  'jpg': [255, 216, 255],
  'png': [137, 80, 78, 71, 13, 10, 26, 10],
  'gif': [71, 73, 70, 56],
  'webp': [82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80],
};

// Ensure upload directory exists
export function ensureUploadDir() {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
}

// Validate file type by checking magic bytes
function validateImageMagicBytes(buffer: Buffer): boolean {
  for (const signature of Object.values(ALLOWED_TYPES)) {
    const isValid = signature.every((byte, index) => buffer[index] === byte);
    if (isValid) return true;
  }
  return false;
}

// Check if string is base64 data URL
export function isBase64Image(data: string): boolean {
  if (!data || typeof data !== 'string') return false;
  return data.startsWith('data:image/');
}

// Extract base64 data from data URL
export function extractBase64Data(dataUrl: string): { mimeType: string; data: string } | null {
  if (!dataUrl) return null;

  const match = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) return null;

  return {
    mimeType: match[1],
    data: match[2],
  };
}

// Save base64 image to file and return filename
export function saveBase64Image(dataUrl: string, prefix: string = 'img'): string {
  ensureUploadDir();

  const extracted = extractBase64Data(dataUrl);
  if (!extracted) {
    // Not base64, return as is (could be existing filename)
    return dataUrl;
  }

  try {
    const { mimeType, data } = extracted;

    // Normalize mime type
    const normalizedMime = mimeType.toLowerCase();

    // Validate MIME type is allowed
    if (!ALLOWED_TYPES[normalizedMime]) {
      throw new Error('Invalid image type. Allowed types: JPEG, PNG, GIF, WebP');
    }

    // Decode base64
    const buffer = Buffer.from(data, 'base64');

    // Validate file size
    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Validate magic bytes to ensure it's actually an image
    if (!validateImageMagicBytes(buffer)) {
      throw new Error('Invalid image file content');
    }

    // Generate safe filename
    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${normalizedMime}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Write file
    fs.writeFileSync(filepath, buffer);

    return filename;
  } catch (error) {
    console.error('Error saving base64 image:', error);
    throw error;
  }
}

// Save multiple base64 images
export function saveBase64Images(images: string[], prefix: string = 'img'): string[] {
  if (!images || !Array.isArray(images)) return [];

  return images.map((img, index) => saveBase64Image(img, `${prefix}_${index}`));
}

// Get full URL for image
export function getImageUrl(filename: string): string {
  if (!filename) return '';

  // If it's already a full URL or base64, return as is
  if (filename.startsWith('http') || filename.startsWith('data:')) {
    return filename;
  }

  // Return the filename, frontend will construct full URL
  return filename;
}
