# Color Theory Project Overview

This project is a Next.js application designed to discover a user's natural color palette based on a photo. It identifies skin, hair, and eye colors and determines the user's seasonal color palette (Spring, Summer, Autumn, or Winter).

## Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript

## Project Structure
- `src/app/`: Contains the main page and layout.
  - `page.tsx`: The primary entry point, managing the analysis state machine (idle -> analyzing -> results/error).
- `src/components/`: UI components for the analysis workflow.
  - `PhotoUpload.tsx`: Handles image selection and upload.
  - `AnalysisLoader.tsx`: Visual feedback during the analysis process.
  - `ColorResults.tsx`: Displays the extracted colors and seasonal palette.
- `src/lib/`:
  - `analyzer.ts`: Placeholder for image analysis logic (currently returns mock data).
- `lib/`:
  - `color-analysis.ts`: Core logic for determining the seasonal palette and flattering colors based on input hex codes.

## Core Logic
The seasonal analysis (`lib/color-analysis.ts`) uses HSL values to evaluate:
1. **Temperature:** Warm vs. Cool (based on hue and saturation).
2. **Clarity:** Bright/Clear vs. Muted (based on average saturation).
3. **Value & Contrast:** Light vs. Dark and High vs. Low Contrast (based on lightness and the difference between skin and hair lightness).

## Development
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint for code quality checks.
