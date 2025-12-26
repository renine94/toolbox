"use client";

import { useState } from "react";
import { useGradientStore } from "../model/useGradientStore";
import { generateGradientCSS } from "../lib/gradient-utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export function SavedGradients() {
  const {
    savedGradients,
    saveGradient,
    loadSavedGradient,
    deleteSavedGradient,
    clearSavedGradients,
  } = useGradientStore();
  const [name, setName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("이름을 입력해주세요");
      return;
    }
    saveGradient(name.trim());
    setName("");
    setShowSaveInput(false);
    toast.success("그라디언트가 저장되었습니다");
  };

  const handleLoad = (gradient: (typeof savedGradients)[0]) => {
    loadSavedGradient(gradient);
    toast.success(`${gradient.name} 그라디언트를 불러왔습니다`);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSavedGradient(id);
    toast.success("삭제되었습니다");
  };

  return (
    <div className="space-y-4">
      {/* Save Button / Input */}
      {showSaveInput ? (
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="그라디언트 이름"
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
          <Button size="icon" onClick={handleSave}>
            <Save className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowSaveInput(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setShowSaveInput(true)}
          variant="outline"
          className="w-full"
        >
          <Save className="w-4 h-4 mr-2" />
          현재 그라디언트 저장
        </Button>
      )}

      {/* Saved Gradients List */}
      {savedGradients.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
            {savedGradients.map((gradient) => (
              <div
                key={gradient.id}
                onClick={() => handleLoad(gradient)}
                className="group relative aspect-video rounded-lg overflow-hidden border border-border hover:ring-2 hover:ring-primary transition-all cursor-pointer"
              >
                <div
                  className="absolute inset-0"
                  style={{ background: generateGradientCSS(gradient.config) }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium drop-shadow px-2 truncate max-w-full">
                    {gradient.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 text-white hover:text-red-400 hover:bg-white/20"
                    onClick={(e) => handleDelete(gradient.id, e)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Clear All */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-destructive"
            onClick={() => {
              clearSavedGradients();
              toast.success("모든 저장된 그라디언트가 삭제되었습니다");
            }}
          >
            <Trash2 className="w-3 h-3 mr-2" />
            모두 삭제
          </Button>
        </>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          저장된 그라디언트가 없습니다
        </p>
      )}
    </div>
  );
}
