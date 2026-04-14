export type ColorAnalysisInput = {
  skinTone: string; // Hex color
  hairColor: string; // Hex color
  eyeColor: string; // Hex color
};

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export type FlatteringColor = {
  name: string;
  hex: string;
};

// Helper: Hex to HSL
const hexToHSL = (hex: string) => {
  let r = 0, g = 0, b = 0;
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

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

// Logic to determine seasonal palette
export const analyzeColors = (input: ColorAnalysisInput): { season: Season; flatteringColors: FlatteringColor[] } => {
  const skinHSL = hexToHSL(input.skinTone);
  const hairHSL = hexToHSL(input.hairColor);
  const eyeHSL = hexToHSL(input.eyeColor);

  // 1. Determine Temperature (Warm vs Cool)
  // Refined: Warm undertones usually have a hue between 25 and 50 (Golden/Peach)
  // Cool undertones are either < 20 (Pinkish) or have very low saturation.
  let warmScore = 0;
  
  // Skin check
  if (skinHSL.h >= 25 && skinHSL.h <= 50) {
    warmScore += 2; 
  } else if (skinHSL.h < 20 || skinHSL.h > 160) {
    warmScore -= 2; // Cool/Pink or Olive-Cool
  }

  // Hair check
  if (hairHSL.h >= 20 && hairHSL.h <= 50 && hairHSL.s > 20) warmScore += 1;
  if (hairHSL.s < 10) warmScore -= 1; // Ashy/Grey hair is cool

  // Eye check
  if (eyeHSL.h >= 20 && eyeHSL.h <= 60 && eyeHSL.s > 20) warmScore += 1;
  if (eyeHSL.h > 180 && eyeHSL.h < 260) warmScore -= 1; // Blue/Cool eyes

  const isWarm = warmScore > 0;

  // 2. Determine Clarity (Bright/Clear vs Muted)
  const avgSaturation = (skinHSL.s + hairHSL.s + eyeHSL.s) / 3;
  
  // 3. Determine Value (Light vs Dark) and Contrast
  const skinLightness = skinHSL.l;
  const hairLightness = hairHSL.l;
  const contrast = Math.abs(skinLightness - hairLightness);
  
  const isDark = (skinLightness + hairLightness + eyeHSL.l) / 3 < 50;
  const isHighContrast = contrast > 50;

  let season: Season;

  if (isWarm) {
    // Spring (Clear/Light) vs Autumn (Muted/Dark)
    season = (avgSaturation > 40 || !isDark) ? 'Spring' : 'Autumn';
  } else {
    // Winter (Clear/High Contrast/Dark) vs Summer (Muted/Light)
    season = (isHighContrast || isDark || avgSaturation > 40) ? 'Winter' : 'Summer';
  }

  const palettes: Record<Season, FlatteringColor[]> = {
    Spring: [
      { name: 'Peach', hex: '#FFCC99' },
      { name: 'Golden Yellow', hex: '#FFD700' },
      { name: 'Bright Green', hex: '#32CD32' },
      { name: 'Turquoise', hex: '#40E0D0' },
      { name: 'Apricot', hex: '#FBCEB1' },
      { name: 'Coral', hex: '#FF7F50' },
      { name: 'Warm Pink', hex: '#FF69B4' },
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Teal', hex: '#008080' },
      { name: 'Cream', hex: '#FFFDD0' }
    ],
    Summer: [
      { name: 'Dusty Rose', hex: '#C08081' },
      { name: 'Lavender', hex: '#E6E6FA' },
      { name: 'Powder Blue', hex: '#B0E0E6' },
      { name: 'Soft Mint', hex: '#BDFCC9' },
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Cool Charcoal', hex: '#36454F' },
      { name: 'Berry', hex: '#872657' },
      { name: 'Slate', hex: '#708090' },
      { name: 'Mauve', hex: '#E0B0FF' },
      { name: 'Off-white', hex: '#FAF9F6' }
    ],
    Autumn: [
      { name: 'Olive Green', hex: '#556B2F' },
      { name: 'Rust', hex: '#B7410E' },
      { name: 'Mustard Yellow', hex: '#FFDB58' },
      { name: 'Burnt Orange', hex: '#CC5500' },
      { name: 'Forest Green', hex: '#228B22' },
      { name: 'Warm Brown', hex: '#654321' },
      { name: 'Brick Red', hex: '#CB4154' },
      { name: 'Deep Teal', hex: '#004953' },
      { name: 'Moss', hex: '#8A9A5B' },
      { name: 'Pumpkin', hex: '#FF7518' }
    ],
    Winter: [
      { name: 'Royal Blue', hex: '#4169E1' },
      { name: 'Emerald Green', hex: '#50C878' },
      { name: 'Ruby Red', hex: '#E0115F' },
      { name: 'Stark White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Fuchsia', hex: '#FF00FF' },
      { name: 'Icy Blue', hex: '#F0F8FF' },
      { name: 'Cobalt Blue', hex: '#0047AB' },
      { name: 'Deep Purple', hex: '#301934' },
      { name: 'True Silver', hex: '#A9A9A9' }
    ]
  };

  return {
    season,
    flatteringColors: palettes[season]
  };
};
