// lib/cloudinary-helper.ts

/**
 * Extraire le cloud_name depuis CLOUDINARY_URL
 * Format: cloudinary://api_key:api_secret@cloud_name
 */
export function getCloudName(): string {
  const url = process.env.CLOUDINARY_URL;
  if (!url) {
    throw new Error('CLOUDINARY_URL non définie');
  }
  
  // Extraire le cloud_name après le @
  const match = url.match(/@([^/]+)/);
  return match ? match[1] : '';
}

/**
 * Générer une URL Cloudinary optimisée pour l'affichage
 * @param publicUrl - URL complète du fichier sur Cloudinary
 * @param options - Options de transformation
 */
export function getOptimizedImageUrl(
  publicUrl: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
  }
): string {
  if (!publicUrl || !publicUrl.includes('cloudinary.com')) {
    return publicUrl;
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options || {};

  // Séparer l'URL en deux parties: avant et après /upload/
  const parts = publicUrl.split('/upload/');
  if (parts.length !== 2) return publicUrl;

  // Construire les transformations
  const transforms: string[] = [];
  
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);
  
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);

  // Reconstruire l'URL avec les transformations
  return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
}

/**
 * Vérifier si une URL est hébergée sur Cloudinary
 */
export function isCloudinaryUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('res.cloudinary.com');
}

/**
 * Obtenir l'URL publique de base pour afficher les images
 * (utile côté client pour construire des URLs)
 */
export function getCloudinaryBaseUrl(): string {
  const cloudName = getCloudName();
  return `https://res.cloudinary.com/${cloudName}/image/upload`;
}

/**
 * Générer une URL avec signature pour les fichiers privés
 * (nécessite l'API Cloudinary côté serveur)
 */
export async function getSignedUrl(publicId: string): Promise<string> {
  // Cette fonction doit être appelée depuis une route API
  const response = await fetch('/api/cloudinary/sign-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId })
  });
  
  const data = await response.json();
  return data.signedUrl;
}