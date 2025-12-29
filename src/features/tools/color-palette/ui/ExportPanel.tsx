"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";
import { PaletteColor } from "../model/types";
import { exportPalette, EXPORT_OPTIONS, ExportFormatType } from "../lib/export";

interface ExportPanelProps {
  colors: PaletteColor[];
}

export function ExportPanel({ colors }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatType>("css");
  const [copied, setCopied] = useState(false);

  const exportedCode = exportPalette(colors, selectedFormat);

  const handleCopy = async () => {
    if (colors.length === 0) {
      toast.error("내보낼 색상이 없습니다");
      return;
    }

    try {
      await navigator.clipboard.writeText(exportedCode);
      setCopied(true);
      toast.success("클립보드에 복사되었습니다");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  const handleDownload = () => {
    if (colors.length === 0) {
      toast.error("내보낼 색상이 없습니다");
      return;
    }

    const extensions: Record<ExportFormatType, string> = {
      css: "css",
      "css-rgb": "css",
      tailwind: "js",
      "tailwind-v4": "css",
      scss: "scss",
      json: "json",
    };

    const blob = new Blob([exportedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `palette.${extensions[selectedFormat]}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("파일이 다운로드되었습니다");
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">내보내기</Label>

      {/* Format selector */}
      <div className="flex flex-wrap gap-1">
        {EXPORT_OPTIONS.map((option) => (
          <Button
            key={option.type}
            variant={selectedFormat === option.type ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFormat(option.type)}
            className="text-xs"
          >
            {option.name}
          </Button>
        ))}
      </div>

      {/* Code preview */}
      <div className="relative">
        <pre className="p-3 bg-muted rounded-lg text-xs font-mono overflow-auto max-h-48 whitespace-pre-wrap">
          {colors.length === 0
            ? "// 팔레트에 색상을 추가해주세요"
            : exportedCode}
        </pre>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex-1"
          disabled={colors.length === 0}
        >
          {copied ? (
            <Check className="h-4 w-4 mr-1" />
          ) : (
            <Copy className="h-4 w-4 mr-1" />
          )}
          복사
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex-1"
          disabled={colors.length === 0}
        >
          <Download className="h-4 w-4 mr-1" />
          다운로드
        </Button>
      </div>
    </div>
  );
}
