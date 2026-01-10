"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Progress } from "@/shared/ui/progress";
import { Loader2, Download, Copy, X } from "lucide-react";
import { useImageStore } from "../model/useImageStore";
import { ExportFormat, exportFormats } from "../model/types";
import { downloadImage } from "../lib/image-utils";
import { toast } from "sonner";

export function ExportPanel() {
  const { exportImage, cancelExport, currentSize, originalImage, exportProgress } = useImageStore();
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState(92);
  const [isExporting, setIsExporting] = useState(false);

  const isProcessing = exportProgress !== null;

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

        {/* 진행률 표시 */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">처리 중...</span>
              <span className="font-mono tabular-nums">{exportProgress}%</span>
            </div>
            <Progress value={exportProgress ?? 0} className="h-2" />
            <Button
              variant="outline"
              size="sm"
              onClick={cancelExport}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              취소
            </Button>
          </div>
        )}

        {/* 내보내기 버튼 */}
        {!isProcessing && (
          <div className="space-y-2">
            <Button
              onClick={handleExport}
              className="w-full"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  준비 중...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
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
              <Copy className="w-4 h-4 mr-2" />
              클립보드에 복사
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
