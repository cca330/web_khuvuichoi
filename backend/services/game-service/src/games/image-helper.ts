import * as fs from 'fs';
import * as path from 'path';

// Base path for storing images
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

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
    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${mimeType}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Decode base64 and write to file
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(filepath, buffer);

    return filename;
  } catch (error) {
    console.error('Error saving base64 image:', error);
    // Return original dataUrl if error
    return dataUrl;
  }
}

// Save multiple base64 images
export function saveBase64Images(images: string[], prefix: string = 'img'): string[] {
  if (!images || !Array.isArray(images)) return [];

  return images.map((img, index) => saveBase64Image(img, `${prefix}_${index}`));
}