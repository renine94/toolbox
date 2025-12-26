"use client";

import { useGradientStore } from "../model/useGradientStore";
import { GRADIENT_TYPES, GradientType } from "../model/types";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Shuffle } from "lucide-react";

export function GradientControls() {
  const { config, setType, setAngle, setCenter, randomize } = useGradientStore();

  return (
    <div className="space-y-4">
      {/* Gradient Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">그라디언트 타입</Label>
        <div className="grid grid-cols-3 gap-2">
          {GRADIENT_TYPES.map(({ type, nameKo }) => (
            <Button
              key={type}
              variant={config.type === type ? "default" : "outline"}
              size="sm"
              onClick={() => setType(type as GradientType)}
              className="text-xs"
            >
              {nameKo}
            </Button>
          ))}
        </div>
      </div>

      {/* Angle Control (for linear and conic) */}
      {(config.type === "linear" || config.type === "conic") && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">
              {config.type === "linear" ? "각도" : "시작 각도"}
            </Label>
            <span className="text-sm text-muted-foreground">{config.angle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={config.angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="grid grid-cols-4 gap-1">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <Button
                key={angle}
                variant="ghost"
                size="sm"
                onClick={() => setAngle(angle)}
                className="text-xs h-7 px-1"
              >
                {angle}°
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Center Position (for radial and conic) */}
      {(config.type === "radial" || config.type === "conic") && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">중심 위치</Label>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">X</span>
              <span className="text-xs text-muted-foreground">{config.centerX}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={config.centerX}
              onChange={(e) => setCenter(Number(e.target.value), config.centerY)}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Y</span>
              <span className="text-xs text-muted-foreground">{config.centerY}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={config.centerY}
              onChange={(e) => setCenter(config.centerX, Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: "↖", x: 0, y: 0 },
              { label: "↑", x: 50, y: 0 },
              { label: "↗", x: 100, y: 0 },
              { label: "←", x: 0, y: 50 },
              { label: "●", x: 50, y: 50 },
              { label: "→", x: 100, y: 50 },
              { label: "↙", x: 0, y: 100 },
              { label: "↓", x: 50, y: 100 },
              { label: "↘", x: 100, y: 100 },
            ].map(({ label, x, y }) => (
              <Button
                key={label}
                variant="ghost"
                size="sm"
                onClick={() => setCenter(x, y)}
                className="text-xs h-7"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Random Button */}
      <Button onClick={randomize} variant="outline" className="w-full">
        <Shuffle className="w-4 h-4 mr-2" />
        랜덤 생성
      </Button>
    </div>
  );
}
