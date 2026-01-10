"use client";

import { useState, useCallback } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Link2, Loader2, RotateCcw } from "lucide-react";
import { useLinkShortenerStore } from "../model/useLinkShortenerStore";
import { PROVIDER_OPTIONS, type ShortenerProvider } from "../model/types";
import { isValidUrl } from "../lib/link-shortener-utils";

export function UrlInputPanel() {
  const {
    inputUrl,
    provider,
    status,
    errorMessage,
    setInputUrl,
    setProvider,
    shorten,
    reset,
  } = useLinkShortenerStore();

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      setInputUrl(url);

      // 실시간 유효성 검증
      if (url && !isValidUrl(url)) {
        setValidationError("유효한 URL을 입력하세요 (http:// 또는 https://)");
      } else {
        setValidationError(null);
      }
    },
    [setInputUrl]
  );

  const handleShorten = useCallback(async () => {
    if (!inputUrl.trim()) {
      setValidationError("URL을 입력하세요");
      return;
    }

    if (!isValidUrl(inputUrl)) {
      setValidationError("유효한 URL을 입력하세요 (http:// 또는 https://)");
      return;
    }

    setValidationError(null);
    await shorten();
  }, [inputUrl, shorten]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleShorten();
      }
    },
    [handleShorten]
  );

  const isLoading = status === "loading";
  const hasError = validationError || (status === "error" && errorMessage);

  return (
    <div className="space-y-4">
      {/* URL 입력 */}
      <div className="space-y-2">
        <Label htmlFor="url-input">URL 입력</Label>
        <Input
          id="url-input"
          type="url"
          placeholder="https://example.com/very-long-url..."
          value={inputUrl}
          onChange={handleUrlChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className={hasError ? "border-destructive" : ""}
        />
        {hasError && (
          <p className="text-sm text-destructive">
            {validationError || errorMessage}
          </p>
        )}
      </div>

      {/* 제공자 선택 */}
      <div className="space-y-2">
        <Label>서비스 제공자</Label>
        <Select
          value={provider}
          onValueChange={(value) => setProvider(value as ShortenerProvider)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="서비스 선택" />
          </SelectTrigger>
          <SelectContent>
            {PROVIDER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          is.gd 실패 시 자동으로 v.gd로 재시도합니다
        </p>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex gap-2 pt-2">
        <Button
          onClick={handleShorten}
          disabled={isLoading || !inputUrl.trim()}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              단축 중...
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4 mr-2" />
              URL 단축하기
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={reset}
          disabled={isLoading}
          title="초기화"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
