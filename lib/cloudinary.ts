// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// Configuration avec CLOUDINARY_URL
// Format: cloudinary://<api_key>:<api_secret>@<cloud_name>
if (process.env.CLOUDINARY_URL) {
  // Cloudinary configure automatiquement avec CLOUDINARY_URL
  cloudinary.config({
    url: process.env.CLOUDINARY_URL
  });
} else {
  throw new Error('CLOUDINARY_URL n\'est pas définie dans les variables d\'environnement');
}

/**
 * Upload un fichier vers Cloudinary
 * @param file - Fichier à uploader
 * @param folder - Dossier dans Cloudinary (ex: "avatars", "cvs")
 * @param resourceType - Type de ressource ("image", "raw" pour PDF/DOCX)
 */
export async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: 'image' | 'raw' = 'image'
) {
  try {
    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload vers Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `educonnect/${folder}`,
          resource_type: resourceType,
          // Générer un nom unique
          public_id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Erreur upload Cloudinary:', error);
    throw error;
  }
}

/**
 * Supprimer un fichier de Cloudinary
 * @param publicId - ID public du fichier (extrait de l'URL)
 * @param resourceType - Type de ressource
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'raw' = 'image'
) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Erreur suppression Cloudinary:', error);
    throw error;
  }
}

/**
 * Extraire le public_id d'une URL Cloudinary
 * @param url - URL complète du fichier
 */
export function extractPublicId(url: string): string {
  // Exemple: https://res.cloudinary.com/demo/image/upload/v1234567890/educonnect/avatars/file.jpg
  // On veut: educonnect/avatars/file
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return '';
  
  // Prendre tout après "upload/v1234567890/"
  const pathParts = parts.slice(uploadIndex + 2);
  const fullPath = pathParts.join('/');
  
  // Retirer l'extension
  return fullPath.replace(/\.[^/.]+$/, '');
}

export default cloudinary;