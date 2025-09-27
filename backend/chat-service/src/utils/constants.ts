export const MAX_FILE_SIZE_IN_BYTES = 100 * 1024 * 1024; // 100 MB limit for file uploads
export const MAX_AUDIO_SIZE_IN_BYTES = 10 * 1024 * 1024; // 16 MB limit for audio uploads
export const MAX_IMAGE_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5 MB limit for image uploads
export const MAX_LENGTH_MESSAGE = 2000; // 2000 characters limit for messages
export const MAX_LENGTH_BIO = 150; // 150 characters limit for user bio

// valid languages
export const VALID_LANGUAGES = ['en', 'fr'];
// Allowed MIME types for chat file uploads
export const ALLOWED_MIMETYPES_CHAT = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/octet-stream",
  "audio/webm",
  "audio/mpeg",
  "text/plain",
];