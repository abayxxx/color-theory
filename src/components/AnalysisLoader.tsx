"use client";

export default function AnalysisLoader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-2 border-neutral-100 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center animate-pulse">
        <h3 className="text-lg font-medium text-neutral-900">
          Analyzing features
        </h3>
        <p className="text-sm text-neutral-500 mt-1">
          Identifying color palette...
        </p>
      </div>
    </div>
  );
}
