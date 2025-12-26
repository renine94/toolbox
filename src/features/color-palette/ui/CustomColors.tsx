"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePaletteStore } from "../model/usePaletteStore";
import { isValidColor, toHex } from "../lib/harmony";

export function CustomColors() {
  const { harmonyType, customColors, addCustomColor, clearCustomColors } =
    usePaletteStore();
  const [inputColor, setInputColor] = useState("#");

  if (harmonyType !== "custom") {
    return null;
  }

  const handleAddColor = () => {
    if (!inputColor || inputColor === "#") {
      toast.error("색상을 입력해주세요");
      return;
    }

    if (!isValidColor(inputColor)) {
      toast.error("유효하지 않은 색상입니다");
      return;
    }

    addCustomColor(toHex(inputColor));
    setInputColor("#");
    toast.success("색상이 추가되었습니다");
  };

  const handleClearAll = () => {
    if (customColors.length === 0) {
      toast.error("삭제할 색상이 없습니다");
      return;
    }
    clearCustomColors();
    toast.success("모든 색상이 삭제되었습니다");
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">커스텀 색상 추가</Label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <div
            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded border"
            style={{
              backgroundColor: isValidColor(inputColor) ? inputColor : "#fff",
            }}
          />
          <Input
            value={inputColor}
            onChange={(e) => setInputColor(e.target.value)}
            placeholder="#000000"
            className="pl-10 font-mono uppercase"
            onKeyDown={(e) => e.key === "Enter" && handleAddColor()}
          />
        </div>
        <Button onClick={handleAddColor} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {customColors.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          className="w-full text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          전체 삭제 ({customColors.length}색)
        </Button>
      )}

      <p className="text-xs text-muted-foreground">
        HEX, RGB, HSL 등 다양한 형식 지원
      </p>
    </div>
  );
}
