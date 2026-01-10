"use client";

import { useCallback, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { Skeleton } from "@/shared/ui/skeleton";
import { Copy, ExternalLink, Link2Off } from "lucide-react";
import { toast } from "sonner";
import { useLinkShortenerStore } from "../model/useLinkShortenerStore";
import { copyToClipboard, truncateUrl } from "../lib/link-shortener-utils";

export function ResultPanel() {
  const { currentResult, status } = useLinkShortenerStore();

  const handleCopy = useCallback(async () => {
    if (!currentResult) return;

    try {
      await copyToClipboard(currentResult.shortUrl);
      toast.success("클립보드에 복사되었습니다");
    } catch {
      toast.error("복사에 실패했습니다");
    }
  }, [currentResult]);

  const truncatedOriginal = useMemo(() => {
    if (!currentResult) return "";
    return truncateUrl(currentResult.originalUrl, 40);
  }, [currentResult]);

  // 로딩 상태
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <Skeleton className="h-32 w-32 rounded-lg" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  // 빈 상태
  if (!currentResult || status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <Link2Off className="h-12 w-12 mb-4 opacity-50" />
        <p>단축된 URL이 없습니다</p>
        <p className="text-sm mt-1">URL을 입력하고 단축하기를 클릭하세요</p>
      </div>
    );
  }

  // 결과 표시
  return (
    <div className="space-y-4">
      {/* QR 코드 */}
      <div className="flex justify-center">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <QRCodeSVG
            value={currentResult.shortUrl}
            size={128}
            level="M"
            includeMargin={false}
          />
        </div>
      </div>

      <Separator />

      {/* 단축 URL */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">단축 URL</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono truncate">
            {currentResult.shortUrl}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            title="복사"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            asChild
            title="새 탭에서 열기"
          >
            <a
              href={currentResult.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* 원본 URL */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">원본 URL</p>
        <p
          className="text-sm text-muted-foreground truncate"
          title={currentResult.originalUrl}
        >
          {truncatedOriginal}
        </p>
      </div>

      {/* 제공자 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">제공자:</span>
        <Badge variant="secondary">{currentResult.provider}</Badge>
      </div>
    </div>
  );
}
