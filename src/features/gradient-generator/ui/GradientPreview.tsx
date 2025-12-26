"use client";

import { useGradientStore } from "../model/useGradientStore";
import { generateGradientCSS } from "../lib/gradient-utils";

export function GradientPreview() {
  const config = useGradientStore((state) => state.config);
  const gradientCSS = generateGradientCSS(config);

  return (
    <div className="space-y-4">
      {/* Main Preview */}
      <div
        className="w-full aspect-video rounded-xl shadow-lg border border-border/50 transition-all duration-300"
        style={{ background: gradientCSS }}
      />

      {/* Small Previews */}
      <div className="grid grid-cols-3 gap-2">
        <div
          className="aspect-square rounded-lg shadow border border-border/30"
          style={{ background: gradientCSS }}
        />
        <div
          className="aspect-square rounded-full shadow border border-border/30"
          style={{ background: gradientCSS }}
        />
        <div
          className="aspect-square rounded-lg shadow border border-border/30 flex items-center justify-center"
          style={{ background: gradientCSS }}
        >
          <span
            className="text-white font-bold text-lg drop-shadow-lg"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
          >
            Aa
          </span>
        </div>
      </div>
    </div>
  );
}
