"use client";

import { AnalysisResult } from "@/hooks/analyzer";

interface ColorResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

const seasonalDescriptions = {
  "Light Spring":
    "Fresh and delicate. You are dominated by light, warm, and clear tones.",
  "Warm Spring":
    "Vibrant and golden. Your palette is purely warm, bright, and energetic.",
  "Clear Spring":
    "Bright and high-contrast. You shine in the most vivid, warm-leaning colors.",
  "Light Summer":
    "Soft and airy. Your palette is dominated by light, cool, and delicate tones.",
  "Cool Summer":
    "Elegant and purely cool. You look best in soft, muted, blue-based colors.",
  "Soft Summer":
    "Muted and sophisticated. Your palette is a blend of soft grey and cool tones.",
  "Soft Autumn":
    "Earthy and gentle. You are flattered by muted, warm, and low-contrast tones.",
  "Warm Autumn":
    "Rich and organic. Your palette is purely warm, golden, and deeply earthy.",
  "Deep Autumn":
    "Mysterious and intense. You shine in dark, warm, and saturated earthy tones.",
  "Clear Winter":
    "Brilliant and high-contrast. Your palette is vivid, cool-leaning, and crisp.",
  "Cool Winter":
    "Striking and purely cool. You look best in bright, high-contrast, blue-based colors.",
  "Deep Winter":
    "Bold and dramatic. You are dominated by dark, cool, and high-intensity colors.",
};

export default function ColorResults({ result, onReset }: ColorResultsProps) {
  const items = [
    { label: "Skin", data: result.skinTone },
    { label: "Hair", data: result.hairColor },
    { label: "Eye", data: result.eyeColor },
  ];

  return (
    <div className="w-full max-w-4xl space-y-12 animate-fade-in pb-12">
      {/* Seasonal Result Header */}
      {result.season && (
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
              Your Profile
            </h2>
            <p className="text-5xl font-black text-neutral-900 tracking-tighter italic font-serif">
              {result.season}
            </p>
          </div>
          <p className="text-sm text-neutral-500 leading-relaxed px-4">
            {
              seasonalDescriptions[
                result.season as keyof typeof seasonalDescriptions
              ]
            }
          </p>
        </div>
      )}

      {/* Extracted Colors - Larger & More Prominent */}
      <div className="flex justify-center gap-6">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center space-y-2 p-4 rounded-3xl bg-neutral-50 border border-neutral-100 min-w-[120px]"
          >
            <div
              className="w-16 h-16 rounded-2xl shadow-inner border border-white/20"
              style={{ backgroundColor: item.data.hex }}
            />
            <div className="text-center">
              <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                {item.label}
              </h4>
              <p className="text-xs font-bold text-neutral-900 uppercase">
                {item.data.hex}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Flattering Colors Section - Compact Swatches */}
      {result.flatteringColors && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900 shrink-0">
              Flattering Palette
            </h3>
            <div className="h-[1px] flex-1 bg-neutral-100" />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {result.flatteringColors.map((color) => (
              <div key={color.name} className="group relative">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:z-10 group-hover:shadow-xl cursor-help"
                  style={{ backgroundColor: color.hex }}
                />
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[8px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                  {color.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Colors to Avoid Section */}
      {result.avoidColors && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 shrink-0">
              Less Ideal
            </h3>
            <div className="h-[1px] flex-1 bg-red-50" />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {result.avoidColors.map((color) => (
              <div key={color.name} className="group relative">
                <div
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm transition-all hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-red-500 text-white text-[8px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                  {color.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-black text-white rounded-full text-xs font-bold hover:bg-neutral-800 transition-all duration-300 active:scale-95 shadow-lg tracking-widest uppercase"
        >
          Retake Analysis
        </button>
      </div>
    </div>
  );
}
