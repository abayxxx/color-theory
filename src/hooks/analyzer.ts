import {
  analyzeColors,
  Season,
  FlatteringColor,
} from "../../lib/color-analysis";

export interface ColorInfo {
  hex: string;
  name: string;
}

export interface AnalysisResult {
  skinTone: ColorInfo;
  hairColor: ColorInfo;
  eyeColor: ColorInfo;
  season?: Season;
  flatteringColors?: FlatteringColor[];
  avoidColors?: FlatteringColor[];
}

export async function analyzeFromColors(colors: {
  skinTone: string;
  hairColor: string;
  eyeColor: string;
}): Promise<AnalysisResult> {
  // Simulate a short processing delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const analysis = analyzeColors(colors);

  return {
    skinTone: { hex: colors.skinTone.toUpperCase(), name: "Selected Skin" },
    hairColor: { hex: colors.hairColor.toUpperCase(), name: "Selected Hair" },
    eyeColor: { hex: colors.eyeColor.toUpperCase(), name: "Selected Eye" },
    season: analysis.season,
    flatteringColors: analysis.flatteringColors,
    avoidColors: analysis.avoidColors,
  };
}
