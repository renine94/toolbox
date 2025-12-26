"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { useImageStore } from "../model/useImageStore";
import { ExportFormat, exportFormats } from "../model/types";
import { downloadImage } from "../lib/image-utils";
import { toast } from "sonner";

export function ExportPanel() {
  const { exportImage, currentSize, originalImage } = useImageStore();
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState(92);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!originalImage) return;

    setIsExporting(true);
    try {
      const dataUrl = await exportImage({
        format,
        quality: quality / 100,
        width: currentSize?.width,
        height: currentSize?.height,
      });

      const filename = `edited-image-${Date.now()}.${format}`;
      downloadImage(dataUrl, filename);
      toast.success(`이미지가 ${format.toUpperCase()} 형식으로 저장되었습니다.`);
    } catch {
      toast.error("이미지 내보내기에 실패했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!originalImage) return;

    setIsExporting(true);
    try {
      const dataUrl = await exportImage({
        format: "png",
        quality: 1,
        width: currentSize?.width,
        height: currentSize?.height,
      });

      // Data URL을 Blob으로 변환
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      toast.success("이미지가 클립보드에 복사되었습니다.");
    } catch {
      toast.error("클립보드에 복사하지 못했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!originalImage) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">내보내기</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 형식 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">파일 형식</Label>
          <div className="flex items-center gap-2">
            {exportFormats.map((f) => (
              <Button
                key={f}
                variant={format === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFormat(f)}
                className="flex-1 uppercase"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {/* 품질 설정 (JPEG, WEBP만) */}
        {format !== "png" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">품질</Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {quality}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setQuality(60)}
              >
                저 (60%)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setQuality(80)}
              >
                중 (80%)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setQuality(100)}
              >
                고 (100%)
              </Button>
            </div>
          </div>
        )}

        {/* 출력 크기 정보 */}
        <div className="p-3 bg-muted/50 rounded-lg text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>출력 크기</span>
            <span className="font-mono">
              {currentSize?.width}×{currentSize?.height}px
            </span>
          </div>
        </div>

        {/* 내보내기 버튼 */}
        <div className="space-y-2">
          <Button
            onClick={handleExport}
            className="w-full"
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                내보내는 중...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                다운로드
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleCopyToClipboard}
            className="w-full"
            disabled={isExporting}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            클립보드에 복사
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
