"use client";

import { AnalysisResult } from "@/lib/analyzer";

interface ColorResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ColorResults({ result, onReset }: ColorResultsProps) {
  const items = [
    { label: "Skin Tone", data: result.skinTone },
    { label: "Hair Color", data: result.hairColor },
    { label: "Eye Color", data: result.eyeColor },
  ];

  return (
    <div className="w-full max-w-2xl space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center space-y-4">
            <div
              className="w-24 h-24 rounded-2xl shadow-sm border border-neutral-100 transition-transform hover:scale-105 duration-300"
              style={{ backgroundColor: item.data.hex }}
            />
            <div className="text-center">
              <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest">
                {item.label}
              </h4>
              <p className="text-xl font-medium text-neutral-900 mt-2">
                {item.data.name}
              </p>
              <p className="text-sm font-mono text-neutral-400 mt-1 uppercase">
                {item.data.hex}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center pt-8 border-t border-neutral-100">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-all duration-300 active:scale-95"
        >
          Analyze Another Photo
        </button>
      </div>
    </div>
  );
}
