# 🎨 Color Theory

A professional-grade personal color analysis tool built with Next.js 15. This application helps users discover their natural seasonal palette by analyzing skin, hair, and eye colors using a sophisticated 12-season flow system.

## ✨ Key Features

- **Professional 12-Season Analysis:** Goes beyond the basic 4 seasons to provide a detailed sub-season profile (e.g., _Clear Winter_, _Soft Autumn_, _Deep Winter_) based on dominant characteristics.
- **Precision Color Picker:** Interactive photo preview with:
  - **8x Zoom & Pan:** Precisely target features in high-resolution photos.
  - **Offscreen Sampling:** 100% color accuracy mapping display coordinates to source pixels.
  - **Real-time Magnifier:** Live hex-code preview under the cursor.
- **Curated Palettes:**
  - **20 Flattering Colors:** A unique, non-repetitive palette of your best shades.
  - **10 "Colors to Avoid":** Highlights shades that might clash with your natural undertones.
- **Modern Aesthetic:** Clean, minimalist UI inspired by premium studios, featuring the _Space Grotesk_ typeface and elegant editorial serif typography.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Typography:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) & [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Language:** TypeScript

## 🧪 The Science

The analysis engine uses an advanced HSL (Hue, Saturation, Lightness) algorithm to evaluate three primary axes:

1. **Temperature:** Warm (Golden/Peach) vs. Cool (Blue/Pink) undertones.
2. **Value:** Light vs. Deep features.
3. **Chroma:** Clear (Bright/High Contrast) vs. Soft (Muted/Low Contrast).

By identifying the **Dominant Characteristic**, the tool assigns one of the 12 flow seasons, mirroring the methodology used by professional image consultants.

## 🚀 Getting Started

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Run Development Server:**

   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## 📝 License

abayxxx © 2026. Built with focus on precision and aesthetic.
