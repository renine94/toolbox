"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Save, Trash2, Clock, X } from "lucide-react";
import { toast } from "sonner";
import { usePaletteStore } from "../model/usePaletteStore";
import { PaletteColor } from "../model/types";

interface SavedPalettesProps {
  currentColors: PaletteColor[];
}

export function SavedPalettes({ currentColors }: SavedPalettesProps) {
  const [paletteName, setPaletteName] = useState("");
  const { savedPalettes, savePalette, loadPalette, deletePalette, clearAllPalettes } =
    usePaletteStore();

  const handleSave = () => {
    if (currentColors.length === 0) {
      toast.error("저장할 색상이 없습니다");
      return;
    }

    const name = paletteName.trim() || `팔레트 ${savedPalettes.length + 1}`;
    savePalette(name, currentColors);
    setPaletteName("");
    toast.success("팔레트가 저장되었습니다");
  };

  const handleLoad = (palette: (typeof savedPalettes)[0]) => {
    loadPalette(palette);
    toast.success("팔레트를 불러왔습니다");
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deletePalette(id);
    toast.success("팔레트가 삭제되었습니다");
  };

  const handleClearAll = () => {
    if (savedPalettes.length === 0) {
      toast.error("삭제할 팔레트가 없습니다");
      return;
    }
    clearAllPalettes();
    toast.success("모든 팔레트가 삭제되었습니다");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Save current palette */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">팔레트 저장</Label>
        <div className="flex gap-2">
          <Input
            value={paletteName}
            onChange={(e) => setPaletteName(e.target.value)}
            placeholder="팔레트 이름..."
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <Button onClick={handleSave} size="icon">
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Saved palettes list */}
      {savedPalettes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              저장된 팔레트 ({savedPalettes.length})
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-600 h-6 px-2 text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              전체 삭제
            </Button>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-auto pr-1">
            {savedPalettes.map((palette) => (
              <div
                key={palette.id}
                className="p-2 bg-muted/50 rounded-lg border hover:bg-muted transition-colors cursor-pointer group"
                onClick={() => handleLoad(palette)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium truncate flex-1">
                    {palette.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(palette.createdAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDelete(e, palette.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-0.5 h-4">
                  {palette.colors.slice(0, 6).map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm first:rounded-l last:rounded-r"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                  {palette.colors.length > 6 && (
                    <div className="flex-1 bg-muted rounded-r text-[8px] flex items-center justify-center">
                      +{palette.colors.length - 6}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {savedPalettes.length === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>저장된 팔레트가 없습니다</p>
        </div>
      )}
    </div>
  );
}
