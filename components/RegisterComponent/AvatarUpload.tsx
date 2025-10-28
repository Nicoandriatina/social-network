import { useRef, useState } from "react";
import { Camera, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface AvatarUploadProps {
  onAvatarChange?: (avatarUrl: string) => void;
  isPublic?: boolean;
}

export default function AvatarUpload({ onAvatarChange, isPublic = true }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setError("Type de fichier non autorisé. JPG, PNG, GIF ou WebP uniquement.");
      return;
    }

    // Validation de la taille
    if (file.size > 5 * 1024 * 1024) {
      setError("Fichier trop volumineux. Maximum 5MB.");
      return;
    }

    // Afficher l'aperçu
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setFileName(file.name);
      setError(null);
      setUploadSuccess(false);
    };
    reader.readAsDataURL(file);

    // Uploader le fichier
    await uploadAvatar(file);
  }

  async function uploadAvatar(file: File) {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const uploadUrl = isPublic ? "/api/upload/avatar-public" : "/api/upload/avatar";

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'upload");
      }

      const data = await response.json();
      const avatarUrl = data.avatarUrl;

      console.log("✅ Avatar uploadé:", avatarUrl);

      // Appeler le callback avec l'URL
      if (onAvatarChange) {
        onAvatarChange(avatarUrl);
      }

      // Stocker dans un hidden input si besoin
      const hiddenInput = document.querySelector('input[name="avatarUrl"]') as HTMLInputElement;
      if (hiddenInput) {
        hiddenInput.value = avatarUrl;
      }

      setUploadSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'upload";
      setError(errorMessage);
      console.error("Upload error:", err);
      
      // Réinitialiser l'aperçu en cas d'erreur
      setPreview(null);
      setFileName(null);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Camera className="w-5 h-5 text-indigo-600" />
          Photo de profil
          <span className="text-xs text-gray-400 ml-2">(optionnel)</span>
        </h3>
        <p className="text-sm text-gray-500 mt-1">Format accepté : JPG, PNG, GIF ou WebP (max 5Mo)</p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          uploading 
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
            : uploadSuccess
            ? 'border-green-400 bg-green-50 hover:bg-green-100 cursor-pointer'
            : error
            ? 'border-red-400 bg-red-50 hover:bg-red-100 cursor-pointer'
            : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'
        }`}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {preview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Aperçu"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {uploadSuccess && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-md">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
            
            <div className="text-sm">
              {uploading ? (
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Téléchargement en cours...</span>
                </div>
              ) : uploadSuccess ? (
                <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Fichier uploadé : <strong>{fileName}</strong></span>
                </div>
              ) : (
                <span className="text-gray-600">
                  Fichier sélectionné : <strong>{fileName}</strong>
                </span>
              )}
            </div>
            
            {!uploading && (
              <p className="text-xs text-gray-500">
                Cliquez pour changer d'image
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
              <Upload className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <p className="text-gray-700 font-medium mb-1">
                Glissez-déposez ou cliquez pour importer
              </p>
              <p className="text-sm text-gray-500">
                Votre photo de profil apparaîtra ici
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            <p className="font-medium">Erreur d'upload</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      <input
        type="file"
        id="avatar"
        name="avatar"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      
      <input type="hidden" name="avatarUrl" id="avatarUrl" />
    </div>
  );
}