/**
 * Supabase Storage Upload Utility
 * Handles file uploads to Supabase Storage buckets
 */

import supabase from '../config/supabase.js';

const BUCKET_NAME = 'packet-images';
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 5MB limit' };
  }

  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!ALLOWED_FORMATS.includes(fileExtension)) {
    return { 
      valid: false, 
      error: `Invalid file format. Allowed: ${ALLOWED_FORMATS.join(', ')}` 
    };
  }

  return { valid: true, error: null };
};

/**
 * Upload image to Supabase Storage
 * @param {File} file - File to upload
 * @param {string} folder - Folder path in bucket (e.g., 'destinations')
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export const uploadImageToSupabase = async (file, folder = 'destinations') => {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    console.log(`[Upload] Starting upload for file: ${file.name}`);

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${folder}/${timestamp}-${randomStr}.${fileExtension}`;

    console.log(`[Upload] Uploading to: ${uniqueFilename}`);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueFilename, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (error) {
      console.error('[Upload] Supabase upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('[Upload] File uploaded successfully:', data);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    const publicUrl = publicUrlData.publicUrl;
    console.log('[Upload] Public URL:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('[Upload] Error:', error.message);
    throw error;
  }
};

/**
 * Delete image from Supabase Storage
 * @param {string} imageUrl - Public URL of the image to delete
 * @returns {Promise<boolean>} - True if deleted successfully
 */
export const deleteImageFromSupabase = async (imageUrl) => {
  try {
    if (!imageUrl) {
      return true;
    }

    // Extract path from public URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/storage/v1/object/public/packet-images/');
    if (pathParts.length < 2) {
      console.warn('[Delete] Could not extract path from URL:', imageUrl);
      return false;
    }

    const filePath = decodeURIComponent(pathParts[1]);
    console.log(`[Delete] Deleting: ${filePath}`);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('[Delete] Error:', error);
      return false;
    }

    console.log('[Delete] File deleted successfully');
    return true;
  } catch (error) {
    console.error('[Delete] Error:', error.message);
    return false;
  }
};

export default {
  validateFile,
  uploadImageToSupabase,
  deleteImageFromSupabase,
  BUCKET_NAME,
  ALLOWED_FORMATS,
  MAX_FILE_SIZE
};
