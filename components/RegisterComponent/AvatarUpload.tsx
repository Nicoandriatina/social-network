import { useRef, useState } from "react";

export default function AvatarUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert("Type de fichier non autorisé. JPG, PNG ou GIF uniquement.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Fichier trop volumineux. Maximum 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        📷 Photo de profil (optionnel)
      </h3>

      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:border-indigo-400 transition cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <div className="text-gray-500 text-sm">
          {fileName ? (
            <>
              Fichier sélectionné : <strong>{fileName}</strong>
            </>
          ) : (
            "Glissez-déposez ou cliquez pour importer une image (max 5Mo)"
          )}
        </div>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 mx-auto w-24 h-24 rounded-full object-cover border"
          />
        )}
      </div>

      <input
        type="file"
        id="avatar"
        name="avatar"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
