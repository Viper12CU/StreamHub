"use client";

import { CloudUpload } from "lucide-react";

interface UploadAreaProps {
  onFileSelect?: (file: File) => void;
}

export function UploadArea({ onFileSelect }: UploadAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <label className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center text-center hover:border-blue-500/50 transition-colors cursor-pointer group">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <CloudUpload className="w-8 h-8 text-blue-500" />
      </div>
      <h4 className="font-semibold text-lg mb-1">Subir captura de pantalla</h4>
      <p className="text-neutral-400 text-sm">
        Arrastra tu comprobante aqui o haz clic para buscar
      </p>
    </label>
  );
}
