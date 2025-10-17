// // // import { useRef, useState } from "react";

// // // export default function AvatarUpload() {
// // //   const inputRef = useRef<HTMLInputElement>(null);
// // //   const [preview, setPreview] = useState<string | null>(null);
// // //   const [fileName, setFileName] = useState<string | null>(null);

// // //   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
// // //     const file = e.target.files?.[0];
// // //     if (!file) return;

// // //     if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
// // //       alert("Type de fichier non autorisé. JPG, PNG ou GIF uniquement.");
// // //       return;
// // //     }
// // //     if (file.size > 5 * 1024 * 1024) {
// // //       alert("Fichier trop volumineux. Maximum 5MB.");
// // //       return;
// // //     }

// // //     const reader = new FileReader();
// // //     reader.onloadend = () => {
// // //       setPreview(reader.result as string);
// // //       setFileName(file.name);
// // //     };
// // //     reader.readAsDataURL(file);
// // //   }

// // //   return (
// // //     <div className="space-y-4">
// // //       <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
// // //         📷 Photo de profil (optionnel)
// // //       </h3>

// // //       <div
// // //         className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:border-indigo-400 transition cursor-pointer"
// // //         onClick={() => inputRef.current?.click()}
// // //       >
// // //         <div className="text-gray-500 text-sm">
// // //           {fileName ? (
// // //             <>
// // //               Fichier sélectionné : <strong>{fileName}</strong>
// // //             </>
// // //           ) : (
// // //             "Glissez-déposez ou cliquez pour importer une image (max 5Mo)"
// // //           )}
// // //         </div>
// // //         {preview && (
// // //           <img
// // //             src={preview}
// // //             alt="Preview"
// // //             className="mt-4 mx-auto w-24 h-24 rounded-full object-cover border"
// // //           />
// // //         )}
// // //       </div>

// // //       <input
// // //         type="file"
// // //         id="avatar"
// // //         name="avatar"
// // //         accept="image/*"
// // //         ref={inputRef}
// // //         className="hidden"
// // //         onChange={handleFileChange}
// // //       />
// // //     </div>
// // //   );
// // // }

// // import { useRef, useState } from "react";

// // export default function AvatarUpload({ onAvatarChange }: { onAvatarChange?: (base64: string) => void }) {
// //   const inputRef = useRef<HTMLInputElement>(null);
// //   const [preview, setPreview] = useState<string | null>(null);
// //   const [fileName, setFileName] = useState<string | null>(null);

// //   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
// //     const file = e.target.files?.[0];
// //     if (!file) return;

// //     if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
// //       alert("Type de fichier non autorisé. JPG, PNG, GIF ou WebP uniquement.");
// //       return;
// //     }
// //     if (file.size > 5 * 1024 * 1024) {
// //       alert("Fichier trop volumineux. Maximum 5MB.");
// //       return;
// //     }

// //     const reader = new FileReader();
// //     reader.onloadend = () => {
// //       const base64 = reader.result as string;
// //       setPreview(base64);
// //       setFileName(file.name);
      
// //       // ✅ Appeler le callback avec la string base64
// //       if (onAvatarChange) {
// //         onAvatarChange(base64);
// //       }
      
// //       // ✅ Stocker aussi dans un hidden input si besoin
// //       const hiddenInput = document.querySelector('input[name="avatar"]') as HTMLInputElement;
// //       if (hiddenInput) {
// //         hiddenInput.value = base64;
// //       }
// //     };
// //     reader.readAsDataURL(file);
// //   }

// //   return (
// //     <div className="space-y-4">
// //       <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
// //         📷 Photo de profil (optionnel)
// //       </h3>

// //       <div
// //         className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:border-indigo-400 transition cursor-pointer"
// //         onClick={() => inputRef.current?.click()}
// //       >
// //         <div className="text-gray-500 text-sm">
// //           {fileName ? (
// //             <>
// //               Fichier sélectionné : <strong>{fileName}</strong>
// //             </>
// //           ) : (
// //             "Glissez-déposez ou cliquez pour importer une image (max 5Mo)"
// //           )}
// //         </div>
// //         {preview && (
// //           <img
// //             src={preview}
// //             alt="Preview"
// //             className="mt-4 mx-auto w-24 h-24 rounded-full object-cover border border-indigo-300"
// //           />
// //         )}
// //       </div>

// //       <input
// //         type="file"
// //         id="avatar"
// //         name="avatar"
// //         accept="image/*"
// //         ref={inputRef}
// //         className="hidden"
// //         onChange={handleFileChange}
// //       />
      
// //       {/* ✅ Hidden input pour stocker la base64 */}
// //       <input type="hidden" name="avatarData" id="avatarData" />
// //     </div>
// //   );
// // }

// // components/RegisterComponent/AvatarUpload.tsx
// import { useRef, useState } from "react";

// interface AvatarUploadProps {
//   onAvatarChange?: (avatarUrl: string) => void;
// }

// export default function AvatarUpload({ onAvatarChange }: AvatarUploadProps) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validation du type
//     if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
//       setError("Type de fichier non autorisé. JPG, PNG, GIF ou WebP uniquement.");
//       return;
//     }

//     // Validation de la taille
//     if (file.size > 5 * 1024 * 1024) {
//       setError("Fichier trop volumineux. Maximum 5MB.");
//       return;
//     }

//     // Afficher l'aperçu
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreview(reader.result as string);
//       setFileName(file.name);
//       setError(null);
//     };
//     reader.readAsDataURL(file);

//     // Uploader le fichier
//     await uploadAvatar(file);
//   }

//   async function uploadAvatar(file: File) {
//     try {
//       setUploading(true);
//       setError(null);

//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await fetch("/api/upload/avatar", {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Erreur lors de l'upload");
//       }

//       const data = await response.json();
//       const avatarUrl = data.avatarUrl;

//       // Appeler le callback avec l'URL
//       if (onAvatarChange) {
//         onAvatarChange(avatarUrl);
//       }

//       // Stocker dans un hidden input si besoin
//       const hiddenInput = document.querySelector('input[name="avatarUrl"]') as HTMLInputElement;
//       if (hiddenInput) {
//         hiddenInput.value = avatarUrl;
//       }
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'upload";
//       setError(errorMessage);
//       console.error("Upload error:", err);
//     } finally {
//       setUploading(false);
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
//         📷 Photo de profil (optionnel)
//       </h3>

//       <div
//         className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:border-indigo-400 transition cursor-pointer"
//         onClick={() => inputRef.current?.click()}
//       >
//         <div className="text-gray-500 text-sm">
//           {uploading ? (
//             <>
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
//               Téléchargement en cours...
//             </>
//           ) : fileName ? (
//             <>
//               Fichier sélectionné : <strong>{fileName}</strong>
//             </>
//           ) : (
//             "Glissez-déposez ou cliquez pour importer une image (max 5Mo)"
//           )}
//         </div>
        
//         {preview && (
//           <img
//             src={preview}
//             alt="Preview"
//             className="mt-4 mx-auto w-24 h-24 rounded-full object-cover border border-indigo-300"
//           />
//         )}
//       </div>

//       {error && (
//         <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
//           ⚠️ {error}
//         </div>
//       )}

//       <input
//         type="file"
//         id="avatar"
//         name="avatar"
//         accept="image/*"
//         ref={inputRef}
//         className="hidden"
//         onChange={handleFileChange}
//         disabled={uploading}
//       />
      
//       {/* Hidden input pour stocker l'URL */}
//       <input type="hidden" name="avatarUrl" id="avatarUrl" />
//     </div>
//   );
// }
// components/RegisterComponent/AvatarUpload.tsx
import { useRef, useState } from "react";

interface AvatarUploadProps {
  onAvatarChange?: (avatarUrl: string) => void;
  isPublic?: boolean; // Pour différencier inscription vs édition
}

export default function AvatarUpload({ onAvatarChange, isPublic = true }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Utiliser la route publique pour l'inscription, privée pour l'édition
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'upload";
      setError(errorMessage);
      console.error("Upload error:", err);
      
      // Réinitialiser l'aperçu en cas d'erreur
      setPreview(null);
      setFileName(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        📷 Photo de profil (optionnel)
      </h3>

      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center bg-gray-50 transition ${
          uploading ? 'border-gray-300 cursor-not-allowed' : 'border-gray-300 hover:border-indigo-400 cursor-pointer'
        }`}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <div className="text-gray-500 text-sm">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
              Téléchargement en cours...
            </>
          ) : fileName ? (
            <>
              Fichier sélectionné : <strong>{fileName}</strong>
              <p className="text-xs text-green-600 mt-1">✓ Upload réussi</p>
            </>
          ) : (
            "Glissez-déposez ou cliquez pour importer une image (max 5Mo)"
          )}
        </div>
        
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 mx-auto w-24 h-24 rounded-full object-cover border-2 border-indigo-300 shadow-md"
          />
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          ⚠️ {error}
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
      
      {/* Hidden input pour stocker l'URL */}
      <input type="hidden" name="avatarUrl" id="avatarUrl" />
    </div>
  );
}