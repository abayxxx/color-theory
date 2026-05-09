/* eslint-disable @typescript-eslint/no-explicit-any */
export type ColorAnalysisInput = {
  skinTone: string;
  hairColor: string;
  eyeColor: string;
};

export type Season =
  | "Light Spring"
  | "Warm Spring"
  | "Clear Spring"
  | "Light Summer"
  | "Cool Summer"
  | "Soft Summer"
  | "Soft Autumn"
  | "Warm Autumn"
  | "Deep Autumn"
  | "Clear Winter"
  | "Cool Winter"
  | "Deep Winter";

export type FlatteringColor = {
  name: string;
  hex: string;
};

const hexToHSL = (hex: string) => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0;
  let s = (max + min) / 2;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

export const analyzeColors = (
  input: ColorAnalysisInput,
): {
  season: Season;
  flatteringColors: FlatteringColor[];
  avoidColors: FlatteringColor[];
} => {
  const skin = hexToHSL(input.skinTone);
  const hair = hexToHSL(input.hairColor);
  const eye = hexToHSL(input.eyeColor);

  const contrast =
    Math.max(skin.l, hair.l, eye.l) - Math.min(skin.l, hair.l, eye.l);
  const avgSaturation = (skin.s + hair.s + eye.s) / 3;

  let warmScore = 0;
  if (skin.h >= 25 && skin.h <= 50) warmScore += 4;
  if (skin.h < 20 || skin.h > 330) warmScore -= 4;
  if (hair.h >= 20 && hair.h <= 55 && hair.s > 20) warmScore += 1;
  if (hair.s < 10) warmScore -= 2;
  if (eye.h > 180 && eye.h < 260) warmScore -= 1;

  const isWarm = warmScore > 0;
  const isVeryWarm = warmScore >= 5;
  const isVeryCool = warmScore <= -5;

  let season: Season;
  if (hair.l < 25 && eye.l < 35) {
    season = isWarm ? "Deep Autumn" : "Deep Winter";
  } else if (hair.l > 70 || (skin.l > 75 && hair.l > 50)) {
    season = isWarm ? "Light Spring" : "Light Summer";
  } else if (isVeryWarm) {
    season = avgSaturation > 35 ? "Warm Spring" : "Warm Autumn";
  } else if (isVeryCool) {
    season = contrast > 40 ? "Cool Winter" : "Cool Summer";
  } else if (avgSaturation > 45 && contrast > 50) {
    season = isWarm ? "Clear Spring" : "Clear Winter";
  } else {
    season = isWarm ? "Soft Autumn" : "Soft Summer";
  }

  const palettes: Record<Season, FlatteringColor[]> = {
    "Light Spring": [
      { name: "Peach", hex: "#FFDAB9" },
      { name: "Salmon", hex: "#FA8072" },
      { name: "Coral", hex: "#FF7F50" },
      { name: "Yellow Green", hex: "#9ACD32" },
      { name: "Aqua", hex: "#00FFFF" },
      { name: "Light Teal", hex: "#20B2AA" },
      { name: "Camel", hex: "#C19A6B" },
      { name: "Ivory", hex: "#FFFFF0" },
      { name: "Powder Blue", hex: "#B0E0E6" },
      { name: "Warm Pink", hex: "#FF69B4" },
      { name: "Apricot", hex: "#FBCEB1" },
      { name: "Golden Yellow", hex: "#FFD700" },
      { name: "Leaf Green", hex: "#32CD32" },
      { name: "Sky Blue", hex: "#87CEEB" },
      { name: "Champagne", hex: "#F7E7CE" },
      { name: "Sand", hex: "#C2B280" },
      { name: "Dove Grey", hex: "#6D6E71" },
      { name: "Bright Red-Orange", hex: "#FF4500" },
      { name: "Periwinkle", hex: "#CCCCFF" },
      { name: "Seafoam", hex: "#9FE2BF" },
    ],
    "Warm Spring": [
      { name: "Golden Yellow", hex: "#FFD700" },
      { name: "Bright Coral", hex: "#FF7F50" },
      { name: "Kelly Green", hex: "#4CBB17" },
      { name: "Warm Teal", hex: "#008080" },
      { name: "Poppy Red", hex: "#E2583E" },
      { name: "Apricot", hex: "#FBCEB1" },
      { name: "Camel", hex: "#C19A6B" },
      { name: "Golden Brown", hex: "#996515" },
      { name: "Turquoise", hex: "#40E0D0" },
      { name: "Lime Green", hex: "#32CD32" },
      { name: "Mango", hex: "#FF8243" },
      { name: "Sunshine Yellow", hex: "#FFFD37" },
      { name: "Terracotta", hex: "#E2725B" },
      { name: "Peach", hex: "#FFDAB9" },
      { name: "Ivory", hex: "#FFFFF0" },
      { name: "Bronze", hex: "#CD7F32" },
      { name: "Copper", hex: "#B87333" },
      { name: "Leaf Green", hex: "#7CFC00" },
      { name: "Aqua", hex: "#00FFFF" },
      { name: "Warm Pink", hex: "#FF1493" },
    ],
    "Clear Spring": [
      { name: "Hot Pink", hex: "#FF69B4" },
      { name: "Emerald Green", hex: "#50C878" },
      { name: "Royal Blue", hex: "#4169E1" },
      { name: "Bright Yellow", hex: "#FFFF00" },
      { name: "Poppy Red", hex: "#FF4500" },
      { name: "Lime Green", hex: "#00FF00" },
      { name: "Turquoise", hex: "#40E0D0" },
      { name: "Cobalt", hex: "#0047AB" },
      { name: "Magenta", hex: "#FF00FF" },
      { name: "Tangerine", hex: "#FF8C00" },
      { name: "Pure Black", hex: "#000000" },
      { name: "Crisp White", hex: "#FFFFFF" },
      { name: "Lemon", hex: "#FFF44F" },
      { name: "Mint", hex: "#3EB489" },
      { name: "Fuchsia", hex: "#C154C1" },
      { name: "Electric Blue", hex: "#7DF9FF" },
      { name: "Bright Violet", hex: "#9400D3" },
      { name: "Kelly Green", hex: "#4CBB17" },
      { name: "Coral", hex: "#FF7F50" },
      { name: "Ice Blue", hex: "#F0F8FF" },
    ],
    "Light Summer": [
      { name: "Powder Blue", hex: "#B0E0E6" },
      { name: "Pale Pink", hex: "#FADADD" },
      { name: "Lavender", hex: "#E6E6FA" },
      { name: "Mint", hex: "#98FF98" },
      { name: "Soft Grey", hex: "#D3D3D3" },
      { name: "Sky Blue", hex: "#87CEEB" },
      { name: "Rose Pink", hex: "#FF66CC" },
      { name: "Periwinkle", hex: "#CCCCFF" },
      { name: "Off-white", hex: "#FAF9F6" },
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Cocoa", hex: "#D2691E" },
      { name: "Mauve", hex: "#E0B0FF" },
      { name: "Seafoam", hex: "#9FE2BF" },
      { name: "Orchid", hex: "#DA70D6" },
      { name: "Baby Blue", hex: "#89CFF0" },
      { name: "Dusty Rose", hex: "#C08081" },
      { name: "Cool Green", hex: "#009B77" },
      { name: "Heather", hex: "#9B7EBD" },
      { name: "Amethyst", hex: "#9966CC" },
      { name: "Shell Pink", hex: "#FFD1DC" },
    ],
    "Cool Summer": [
      { name: "Slate Blue", hex: "#6A5ACD" },
      { name: "Rose", hex: "#FF007F" },
      { name: "Pine Green", hex: "#01796F" },
      { name: "Orchid", hex: "#DA70D6" },
      { name: "Cool Grey", hex: "#808080" },
      { name: "Charcoal", hex: "#36454F" },
      { name: "Burgundy", hex: "#800020" },
      { name: "Spruce", hex: "#005A43" },
      { name: "Plum", hex: "#8E4585" },
      { name: "Lavender", hex: "#E6E6FA" },
      { name: "Navy", hex: "#000080" },
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Raspberry", hex: "#E30B5D" },
      { name: "Mint", hex: "#3EB489" },
      { name: "Berry", hex: "#990066" },
      { name: "Cocoa", hex: "#483C32" },
      { name: "Cornflower", hex: "#6495ED" },
      { name: "Teal", hex: "#008080" },
      { name: "Mauve", hex: "#E0B0FF" },
      { name: "Off-white", hex: "#FAF9F6" },
    ],
    "Soft Summer": [
      { name: "Dusty Rose", hex: "#C08081" },
      { name: "Mauve", hex: "#E0B0FF" },
      { name: "Soft Teal", hex: "#71A6D2" },
      { name: "Taupe", hex: "#483C32" },
      { name: "Amethyst", hex: "#9966CC" },
      { name: "Charcoal", hex: "#36454F" },
      { name: "Sage", hex: "#9C9F84" },
      { name: "Cocoa", hex: "#483C32" },
      { name: "Slate", hex: "#708090" },
      { name: "Rosewood", hex: "#65000B" },
      { name: "Plum", hex: "#8E4585" },
      { name: "Grey Blue", hex: "#6699CC" },
      { name: "Moss", hex: "#8A9A5B" },
      { name: "Periwinkle", hex: "#CCCCFF" },
      { name: "Pewter", hex: "#8E9294" },
      { name: "Burgundy", hex: "#800020" },
      { name: "Navy", hex: "#000080" },
      { name: "Mint Grey", hex: "#98FB98" },
      { name: "Sand", hex: "#C2B280" },
      { name: "Heather", hex: "#9B7EBD" },
    ],
    "Soft Autumn": [
      { name: "Olive", hex: "#808000" },
      { name: "Rust", hex: "#B7410E" },
      { name: "Sage", hex: "#9C9F84" },
      { name: "Mustard", hex: "#FFDB58" },
      { name: "Terra Cotta", hex: "#E2725B" },
      { name: "Khaki", hex: "#F0E68C" },
      { name: "Camel", hex: "#C19A6B" },
      { name: "Mocha", hex: "#49311C" },
      { name: "Forest Green", hex: "#228B22" },
      { name: "Amber", hex: "#FFBF00" },
      { name: "Warm Teal", hex: "#008080" },
      { name: "Copper", hex: "#B87333" },
      { name: "Sand", hex: "#C2B280" },
      { name: "Muted Peach", hex: "#E9967A" },
      { name: "Rosewood", hex: "#65000B" },
      { name: "Mahogany", hex: "#C04000" },
      { name: "Moss", hex: "#8A9A5B" },
      { name: "Goldenrod", hex: "#DAA520" },
      { name: "Ivory", hex: "#FFFFF0" },
      { name: "Grey Green", hex: "#5F9EA0" },
    ],
    "Warm Autumn": [
      { name: "Pumpkin", hex: "#FF7518" },
      { name: "Forest Green", hex: "#228B22" },
      { name: "Bronze", hex: "#CD7F32" },
      { name: "Deep Gold", hex: "#AA6C39" },
      { name: "Cinnabar", hex: "#E34234" },
      { name: "Coffee", hex: "#6F4E37" },
      { name: "Rust", hex: "#B7410E" },
      { name: "Olive", hex: "#808000" },
      { name: "Mustard", hex: "#FFDB58" },
      { name: "Copper", hex: "#B87333" },
      { name: "Deep Teal", hex: "#004953" },
      { name: "Mahogany", hex: "#C04000" },
      { name: "Cream", hex: "#FFFDD0" },
      { name: "Tan", hex: "#D2B48C" },
      { name: "Amber", hex: "#FFBF00" },
      { name: "Eggplant", hex: "#614051" },
      { name: "Moss", hex: "#8A9A5B" },
      { name: "Brick", hex: "#CB4154" },
      { name: "Burnt Orange", hex: "#CC5500" },
      { name: "Khaki", hex: "#F0E68C" },
    ],
    "Deep Autumn": [
      { name: "Chocolate", hex: "#7B3F00" },
      { name: "Aubergine", hex: "#3B1E30" },
      { name: "Dark Teal", hex: "#004953" },
      { name: "Maroon", hex: "#800000" },
      { name: "Espresso", hex: "#3D2B1F" },
      { name: "Warm Black", hex: "#0B0B0B" },
      { name: "Forest Green", hex: "#228B22" },
      { name: "Rust", hex: "#B7410E" },
      { name: "Mustard", hex: "#FFDB58" },
      { name: "Copper", hex: "#B87333" },
      { name: "Dark Olive", hex: "#556B2F" },
      { name: "Gold", hex: "#D4AF37" },
      { name: "Tomato Red", hex: "#FF6347" },
      { name: "Pine", hex: "#01796F" },
      { name: "Charcoal", hex: "#36454F" },
      { name: "Terracotta", hex: "#E2725B" },
      { name: "Burgundy", hex: "#800020" },
      { name: "Bronze", hex: "#CD7F32" },
      { name: "Warm Navy", hex: "#000080" },
      { name: "Khaki", hex: "#F0E68C" },
    ],
    "Clear Winter": [
      { name: "Emerald", hex: "#50C878" },
      { name: "Royal Blue", hex: "#4169E1" },
      { name: "Magenta", hex: "#FF00FF" },
      { name: "Icy Yellow", hex: "#FFFFE0" },
      { name: "True Black", hex: "#000000" },
      { name: "Crisp White", hex: "#FFFFFF" },
      { name: "Hot Pink", hex: "#FF69B4" },
      { name: "Cobalt", hex: "#0047AB" },
      { name: "Fuchsia", hex: "#FF00FF" },
      { name: "Lemon", hex: "#FFF44F" },
      { name: "Electric Blue", hex: "#7DF9FF" },
      { name: "Icy Lime", hex: "#CCFF00" },
      { name: "Ice Blue", hex: "#F0F8FF" },
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Charcoal", hex: "#333333" },
      { name: "Ruby", hex: "#E0115F" },
      { name: "Violet", hex: "#8F00FF" },
      { name: "Bright Turquoise", hex: "#00CED1" },
      { name: "Purple", hex: "#800080" },
      { name: "Neon Pink", hex: "#FF1493" },
    ],
    "Cool Winter": [
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Sapphire", hex: "#0F52BA" },
      { name: "Cool Red", hex: "#D70270" },
      { name: "Imperial Purple", hex: "#602F6B" },
      { name: "Arctic Blue", hex: "#F0F8FF" },
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Royal Blue", hex: "#4169E1" },
      { name: "Emerald", hex: "#50C878" },
      { name: "Charcoal", hex: "#333333" },
      { name: "Fuchsia", hex: "#FF00FF" },
      { name: "Cool Burgundy", hex: "#800020" },
      { name: "Navy", hex: "#000080" },
      { name: "Plum", hex: "#8E4585" },
      { name: "Icy Pink", hex: "#FADADD" },
      { name: "Icy Mint", hex: "#98FF98" },
      { name: "Icy Lemon", hex: "#FFFFE0" },
      { name: "Cobalt", hex: "#0047AB" },
      { name: "Spruce", hex: "#005A43" },
      { name: "Orchid", hex: "#DA70D6" },
    ],
    "Deep Winter": [
      { name: "Midnight", hex: "#191970" },
      { name: "Burgundy", hex: "#800020" },
      { name: "Indigo", hex: "#4B0082" },
      { name: "Pine", hex: "#01796F" },
      { name: "Charcoal", hex: "#36454F" },
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Ruby", hex: "#E0115F" },
      { name: "Dark Emerald", hex: "#043927" },
      { name: "Cool Chocolate", hex: "#483C32" },
      { name: "Dark Plum", hex: "#4B0082" },
      { name: "Navy", hex: "#000080" },
      { name: "Royal Blue", hex: "#4169E1" },
      { name: "Dark Fuchsia", hex: "#911B5A" },
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Icy Blue", hex: "#F0F8FF" },
      { name: "Deep Violet", hex: "#330066" },
      { name: "Dark Teal", hex: "#004953" },
      { name: "Cool Espresso", hex: "#3D2B1F" },
      { name: "Cool Maroon", hex: "#800000" },
    ],
  };

  const avoidPalettes: Record<Season, FlatteringColor[]> = Object.keys(
    palettes,
  ).reduce((acc, s) => {
    const key = s as Season;
    const colors = isWarm
      ? [
          { name: "Icy Blue", hex: "#F0F8FF" },
          { name: "Stark White", hex: "#FFFFFF" },
          { name: "Cool Grey", hex: "#808080" },
          { name: "Silver", hex: "#C0C0C0" },
          { name: "Pink Lavender", hex: "#E6E6FA" },
          { name: "Mauve", hex: "#E0B0FF" },
          { name: "Dusty Rose", hex: "#C08081" },
          { name: "Cool Charcoal", hex: "#36454F" },
          { name: "Black", hex: "#000000" },
          { name: "Powder Blue", hex: "#B0E0E6" },
        ]
      : [
          { name: "Orange", hex: "#FFA500" },
          { name: "Golden Yellow", hex: "#FFD700" },
          { name: "Mustard", hex: "#FFDB58" },
          { name: "Rust", hex: "#B7410E" },
          { name: "Camel", hex: "#C19A6B" },
          { name: "Terracotta", hex: "#E2725B" },
          { name: "Olive Green", hex: "#808000" },
          { name: "Peach", hex: "#FFDAB9" },
          { name: "Cream", hex: "#FFFDD0" },
          { name: "Golden Brown", hex: "#996515" },
        ];
    acc[key] = colors;
    return acc;
  }, {} as any);

  return {
    season,
    flatteringColors: palettes[season],
    avoidColors: avoidPalettes[season],
  };
};
