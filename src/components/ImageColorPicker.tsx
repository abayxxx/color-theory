/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

interface ImageColorPickerProps {
  file: File;
  onComplete: (colors: {
    skinTone: string;
    hairColor: string;
    eyeColor: string;
  }) => void;
  onCancel: () => void;
}

type PickingState = "skinTone" | "hairColor" | "eyeColor";

export default function ImageColorPicker({
  file,
  onComplete,
  onCancel,
}: ImageColorPickerProps) {
  const [currentStep, setCurrentStep] = useState<PickingState>("skinTone");
  const [colors, setColors] = useState({
    skinTone: "",
    hairColor: "",
    eyeColor: "",
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialTouchPos = useRef({ x: 0, y: 0 });
  const isTouchInteraction = useRef(false);
  const lastStepTime = useRef(0);

  const steps: { key: PickingState; label: string }[] = useMemo(
    () => [
      { key: "skinTone", label: "Skin Tone" },
      { key: "hairColor", label: "Hair Color" },
      { key: "eyeColor", label: "Eye Color" },
    ],
    [],
  );

  useEffect(() => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx?.drawImage(img, 0, 0);
      offscreenCanvasRef.current = canvas;
      setImageLoaded(true);
    };
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const getColorAtPosition = (clientX: number, clientY: number) => {
    const img = imgRef.current;
    const canvas = offscreenCanvasRef.current;
    if (!img || !canvas) return null;

    const rect = img.getBoundingClientRect();
    const xOnElem = clientX - rect.left;
    const yOnElem = clientY - rect.top;

    const x = (xOnElem / rect.width) * canvas.width;
    const y = (yOnElem / rect.height) * canvas.height;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
      const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      return `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
        .toString(16)
        .slice(1)}`.toUpperCase();
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouchInteraction.current) return;
    setMousePos({ x: e.clientX, y: e.clientY });
    const color = getColorAtPosition(e.clientX, e.clientY);
    setHoverColor(color);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isTouchInteraction.current = false;
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    initialTouchPos.current = { x: e.clientX, y: e.clientY };
  };

  // Mobile Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    isTouchInteraction.current = true;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartPos.current = {
      x: touch.clientX - offset.x,
      y: touch.clientY - offset.y,
    };
    initialTouchPos.current = { x: touch.clientX, y: touch.clientY };

    // Show magnifier on touch start
    setMousePos({ x: touch.clientX, y: touch.clientY });
    const color = getColorAtPosition(touch.clientX, touch.clientY);
    setHoverColor(color);

    // Do NOT preventDefault here to allow buttons and UI to still work
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];

    setOffset({
      x: touch.clientX - dragStartPos.current.x,
      y: touch.clientY - dragStartPos.current.y,
    });

    setMousePos({ x: touch.clientX, y: touch.clientY });
    const color = getColorAtPosition(touch.clientX, touch.clientY);
    setHoverColor(color);

    if (e.cancelable) e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.changedTouches[0];

    const dist = Math.sqrt(
      Math.pow(touch.clientX - initialTouchPos.current.x, 2) +
        Math.pow(touch.clientY - initialTouchPos.current.y, 2),
    );

    // If it was a tap (small movement), pick the color
    if (dist < 15) {
      const now = Date.now();
      if (now - lastStepTime.current > 300) {
        const color = getColorAtPosition(touch.clientX, touch.clientY);
        if (color) {
          setColors((prev) => ({ ...prev, [currentStep]: color }));
          const currentIndex = steps.findIndex((s) => s.key === currentStep);
          if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1].key);
            lastStepTime.current = now;
          }
        }
      }
    }

    setIsDragging(false);
    setHoverColor(null);
    if (e.cancelable) e.preventDefault(); // Stop ghost mouse events
  };

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && !isTouchInteraction.current) {
        setOffset({
          x: e.clientX - dragStartPos.current.x,
          y: e.clientY - dragStartPos.current.y,
        });
      }
    },
    [isDragging],
  );

  const handleGlobalMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isDragging && !isTouchInteraction.current) {
        const dist = Math.sqrt(
          Math.pow(e.clientX - initialTouchPos.current.x, 2) +
            Math.pow(e.clientY - initialTouchPos.current.y, 2),
        );

        if (dist < 5) {
          const now = Date.now();
          if (now - lastStepTime.current > 300) {
            const color = getColorAtPosition(e.clientX, e.clientY);
            if (color) {
              setColors((prev) => ({ ...prev, [currentStep]: color }));
              const currentIndex = steps.findIndex(
                (s) => s.key === currentStep,
              );
              if (currentIndex < steps.length - 1) {
                setCurrentStep(steps[currentIndex + 1].key);
                lastStepTime.current = now;
              }
            }
          }
        }
        setIsDragging(false);
      }
    },
    [isDragging, currentStep, steps],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY;
      const newZoom = Math.min(Math.max(zoom + delta * 0.01, 1), 8);
      setZoom(newZoom);
    }
  };

  const isComplete = colors.skinTone && colors.hairColor && colors.eyeColor;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center space-y-6 animate-fade-in scroll-mt-24 px-4 sm:px-0">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-neutral-900">
          Pick your colors
        </h2>
        <p className="text-neutral-500 text-sm">
          Select your{" "}
          <span className="font-semibold text-black uppercase">
            {steps.find((s) => s.key === currentStep)?.label}
          </span>
          . Use buttons to zoom.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {steps.map((step) => (
          <button
            key={step.key}
            onClick={() => setCurrentStep(step.key)}
            className={`px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all
              ${
                currentStep === step.key
                  ? "bg-black text-white shadow-lg ring-2 ring-black ring-offset-2"
                  : colors[step.key]
                    ? "bg-neutral-100 text-neutral-900"
                    : "bg-neutral-50 text-neutral-400"
              }`}
          >
            <div className="flex items-center space-x-2">
              {colors[step.key] && (
                <div
                  className="w-3 h-3 rounded-full border border-neutral-200"
                  style={{ backgroundColor: colors[step.key] }}
                />
              )}
              <span>{step.label}</span>
            </div>
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        onWheel={handleWheel}
        className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-neutral-50 cursor-crosshair border border-neutral-200 touch-none select-none"
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="w-8 h-8 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
          </div>
        )}

        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
          style={{
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            ref={imgRef}
            src={URL.createObjectURL(file)}
            alt="Upload"
            className="max-w-full max-h-full object-contain pointer-events-none"
            onLoad={(e) =>
              URL.revokeObjectURL((e.target as HTMLImageElement).src)
            }
          />
        </div>

        {/* Magnifier / Tooltip */}
        {hoverColor && (
          <div
            className="fixed pointer-events-none z-50 flex flex-col items-center space-y-2 -translate-x-1/2 -translate-y-[130%]"
            style={{ left: mousePos.x, top: mousePos.y }}
          >
            <div className="bg-white p-1 rounded-full shadow-2xl border-2 border-white ring-1 ring-black/5 overflow-hidden">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  backgroundColor: hoverColor,
                  color:
                    parseInt(hoverColor.slice(1), 16) > 0xffffff / 2
                      ? "black"
                      : "white",
                }}
              >
                {hoverColor}
              </div>
            </div>
            <div className="bg-black/80 backdrop-blur text-white text-[9px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest shadow-lg">
              {isDragging && zoom > 1 ? "Panning..." : "Release to Pick"}
            </div>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoom((prev) => Math.min(prev + 1, 8));
            }}
            className="w-12 h-12 bg-white/90 backdrop-blur shadow-xl rounded-2xl flex items-center justify-center text-2xl font-light hover:bg-white active:scale-90 transition-all border border-neutral-100"
          >
            +
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoom(1);
              setOffset({ x: 0, y: 0 });
            }}
            className="w-12 h-12 bg-white/90 backdrop-blur shadow-xl rounded-2xl flex items-center justify-center text-[10px] font-black hover:bg-white active:scale-90 transition-all border border-neutral-100 uppercase tracking-tighter"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoom((prev) => Math.max(prev - 1, 1));
            }}
            className="w-12 h-12 bg-white/90 backdrop-blur shadow-xl rounded-2xl flex items-center justify-center text-2xl font-light hover:bg-white active:scale-90 transition-all border border-neutral-100"
          >
            -
          </button>
        </div>
      </div>

      <div className="flex space-x-3 w-full justify-center">
        <button
          onClick={onCancel}
          className="flex-1 max-w-[140px] py-4 bg-neutral-100 text-neutral-600 rounded-full text-sm font-bold hover:bg-neutral-200 transition-all"
        >
          Cancel
        </button>
        <button
          disabled={!isComplete}
          onClick={() => onComplete(colors as any)}
          className={`flex-1 max-w-[200px] py-4 rounded-full text-sm font-bold transition-all shadow-xl
            ${
              isComplete
                ? "bg-black text-white hover:bg-neutral-800 scale-100 active:scale-95"
                : "bg-neutral-100 text-neutral-300 cursor-not-allowed shadow-none"
            }`}
        >
          Continue to Analysis
        </button>
      </div>
    </div>
  );
}
