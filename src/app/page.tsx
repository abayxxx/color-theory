"use client";

import { useState } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import AnalysisLoader from "@/components/AnalysisLoader";
import ColorResults from "@/components/ColorResults";
import ImageColorPicker from "@/components/ImageColorPicker";
import { analyzeFromColors, AnalysisResult } from "@/lib/analyzer";

export default function Home() {
  const [status, setStatus] = useState<
    "idle" | "picking" | "analyzing" | "results" | "error"
  >("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("picking");
  };

  const handleColorsPicked = async (colors: {
    skinTone: string;
    hairColor: string;
    eyeColor: string;
  }) => {
    setStatus("analyzing");
    try {
      const data = await analyzeFromColors(colors);
      setResult(data);
      setStatus("results");
    } catch (error) {
      console.error("Analysis failed:", error);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setResult(null);
    setFile(null);
    setStatus("idle");
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-24 bg-white">
      <div className="w-full max-w-4xl flex flex-col items-center space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-neutral-900 sm:text-7xl">
            Color Theory
          </h1>
          <p className="text-lg text-neutral-500 max-w-lg mx-auto leading-relaxed">
            Discover your natural palette. Upload a photo to identify your skin,
            hair, and eye colors.
          </p>
        </header>

        {/* Dynamic Content Section */}
        <section className="w-full flex justify-center py-12">
          {status === "idle" && (
            <div className="w-full max-w-md animate-slide-up">
              <PhotoUpload onFileSelected={handleFileSelected} />
            </div>
          )}

          {status === "picking" && file && (
            <ImageColorPicker
              file={file}
              onComplete={handleColorsPicked}
              onCancel={handleReset}
            />
          )}

          {status === "analyzing" && (
            <div className="w-full max-w-md animate-fade-in">
              <AnalysisLoader />
            </div>
          )}

          {status === "results" && result && (
            <div className="w-full flex justify-center animate-slide-up">
              <ColorResults result={result} onReset={handleReset} />
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-4">
              <p className="text-red-500">
                Something went wrong. Please try again.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-neutral-100 rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                Go Back
              </button>
            </div>
          )}
        </section>

        {/* Footer info (optional, minimal) */}
        <footer className="text-center pt-24">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium">
            Made with ❤️ &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  );
}
