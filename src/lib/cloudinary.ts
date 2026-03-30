/**
 * Server-side Cloudinary utilities.
 * Never import this in client components — it uses the secret API key.
 */
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

/**
 * Delete a single asset from Cloudinary by its public_id.
 * Call this in server actions when a model document is deleted and
 * the image is no longer needed.
 */
export async function deleteCloudinaryAsset(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

/**
 * Extract the Cloudinary public_id from a full secure_url.
 * e.g. "https://res.cloudinary.com/<cloud>/image/upload/v123/folder/file.jpg"
 *       → "folder/file"
 */
export function extractPublicId(url: string): string {
  try {
    const parts = url.split('/upload/')
    if (parts.length < 2) return ''
    // Strip version segment (v\d+/) if present, then strip file extension
    const withoutVersion = parts[1].replace(/^v\d+\//, '')
    return withoutVersion.replace(/\.[^/.]+$/, '')
  } catch {
    return ''
  }
}
