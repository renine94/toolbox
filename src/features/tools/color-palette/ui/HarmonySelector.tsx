"use client";

import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { usePaletteStore } from "../model/usePaletteStore";
import { HARMONY_TYPES, HarmonyType } from "../model/types";

export function HarmonySelector() {
  const { harmonyType, setHarmonyType } = usePaletteStore();

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">색상 조화</Label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {HARMONY_TYPES.map((harmony) => (
          <Button
            key={harmony.type}
            variant={harmonyType === harmony.type ? "default" : "outline"}
            size="sm"
            onClick={() => setHarmonyType(harmony.type)}
            className="flex flex-col h-auto py-2 px-3"
          >
            <span className="font-medium">{harmony.nameKo}</span>
            <span className="text-[10px] opacity-70">
              {harmony.type === "custom" ? "직접 추가" : `${harmony.colorCount}색`}
            </span>
          </Button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {HARMONY_TYPES.find((h) => h.type === harmonyType)?.description}
      </p>
    </div>
  );
}
