// API base URL for images
const API_BASE_URL = 'http://localhost:8000';

/**
 * Build full image URL from filename or URL
 * @param {string} image - Image filename or URL
 * @returns {string} Full image URL
 */
export function getImageUrl(image) {
  if (!image) return '';

  // If it's already a full URL (http/https) or data URL (base64), return as is
  if (image.startsWith('http') || image.startsWith('https') || image.startsWith('data:')) {
    return image;
  }

  // Otherwise, construct full URL
  return `${API_BASE_URL}/uploads/${image}`;
}

/**
 * Build full image URLs from array of images
 * @param {string[]} images - Array of image filenames or URLs
 * @returns {string[]} Array of full image URLs
 */
export function getImageUrls(images) {
  if (!images || !Array.isArray(images)) return [];
  return images.map((img) => getImageUrl(img));
}

/**
 * Check if string is a data URL (base64)
 * @param {string} str - String to check
 * @returns {boolean}
 */
export function isBase64Image(str) {
  return str && str.startsWith('data:image/');
}