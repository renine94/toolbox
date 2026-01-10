"use client";

import { useState } from "react";
import { useGradientStore } from "../model/useGradientStore";
import { generateGradientCSS } from "../lib/gradient-utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Plus, X, GripVertical } from "lucide-react";

export function ColorStops() {
  const { config, addColorStop, updateColorStop, removeColorStop } =
    useGradientStore();
  const [newColor, setNewColor] = useState("#000000");

  const handleAddStop = () => {
    // 새 색상 스톱 위치를 중간에 추가
    const positions = config.colorStops.map((s) => s.position);
    const maxPos = Math.max(...positions);
    const minPos = Math.min(...positions);
    const newPosition = Math.round((maxPos + minPos) / 2);
    addColorStop(newColor, newPosition);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">색상 스톱</Label>
        <span className="text-xs text-muted-foreground">
          {config.colorStops.length}개
        </span>
      </div>

      {/* Gradient Bar */}
      <div className="relative h-6 rounded-lg overflow-hidden border border-border">
        <div
          className="absolute inset-0"
          style={{ background: generateGradientCSS({ ...config, type: "linear", angle: 90 }) }}
        />
        {/* Stop Markers */}
        {config.colorStops.map((stop) => (
          <div
            key={stop.id}
            className="absolute top-0 bottom-0 w-1 -translate-x-1/2 bg-white border border-gray-400 cursor-pointer"
            style={{ left: `${stop.position}%` }}
            title={`${stop.color} at ${stop.position}%`}
          />
        ))}
      </div>

      {/* Color Stop List */}
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {config.colorStops.map((stop) => (
          <div
            key={stop.id}
            className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />

            {/* Color Picker */}
            <div className="relative">
              <input
                type="color"
                value={stop.color}
                onChange={(e) =>
                  updateColorStop(stop.id, e.target.value, stop.position)
                }
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
            </div>

            {/* Hex Input */}
            <Input
              value={stop.color}
              onChange={(e) =>
                updateColorStop(stop.id, e.target.value, stop.position)
              }
              className="w-24 h-8 text-xs font-mono"
            />

            {/* Position Slider */}
            <div className="flex-1 flex items-center gap-2">
              <Slider
                value={[stop.position]}
                onValueChange={([val]) =>
                  updateColorStop(stop.id, stop.color, val)
                }
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10 text-right">
                {stop.position}%
              </span>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => removeColorStop(stop.id)}
              disabled={config.colorStops.length <= 2}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add New Stop */}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border-0"
        />
        <Button onClick={handleAddStop} variant="outline" className="flex-1">
          <Plus className="w-4 h-4 mr-2" />
          색상 추가
        </Button>
      </div>
    </div>
  );
}
