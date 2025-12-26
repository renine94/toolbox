"use client";

import { useState } from "react";
import { useGradientStore } from "../model/useGradientStore";
import {
  generateCode,
  copyToClipboard,
  EXPORT_OPTIONS,
  ExportFormat,
} from "../lib/gradient-utils";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function CodeOutput() {
  const config = useGradientStore((state) => state.config);
  const [format, setFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);

  const code = generateCode(config, format);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      toast.success("클립보드에 복사되었습니다");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("복사에 실패했습니다");
    }
  };

  return (
    <div className="space-y-4">
      {/* Format Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">출력 형식</Label>
        <div className="flex flex-wrap gap-1">
          {EXPORT_OPTIONS.map((option) => (
            <Button
              key={option.format}
              variant={format === option.format ? "default" : "outline"}
              size="sm"
              onClick={() => setFormat(option.format)}
              className="text-xs"
            >
              {option.nameKo}
            </Button>
          ))}
        </div>
      </div>

      {/* Code Display */}
      <div className="relative">
        <pre className="p-4 rounded-lg bg-secondary/50 border border-border text-xs font-mono overflow-x-auto max-h-[200px] whitespace-pre-wrap break-all">
          {code}
        </pre>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Format Description */}
      <p className="text-xs text-muted-foreground">
        {EXPORT_OPTIONS.find((o) => o.format === format)?.description}
      </p>
    </div>
  );
}
