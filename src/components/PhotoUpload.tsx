"use client";

import { useState, useCallback } from "react";

interface PhotoUploadProps {
  onFileSelected: (file: File) => void;
}

export default function PhotoUpload({ onFileSelected }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  return (
    <div
      className={`relative w-full max-w-md aspect-square border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer
        ${
          isDragging
            ? "border-black bg-neutral-50"
            : "border-neutral-200 hover:border-neutral-400"
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="space-y-4">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-500"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-900">
            Upload a photo of your face
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Drag and drop or click to select (JPG, PNG)
          </p>
        </div>
      </div>
    </div>
  );
}
