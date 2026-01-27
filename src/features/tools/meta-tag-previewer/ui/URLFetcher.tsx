"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Globe, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { useMetaStore } from "../model/useMetaStore";
import { isValidUrl } from "../lib/meta-utils";
import type { FetchMetaResponse } from "../model/types";

export function URLFetcher() {
  const t = useTranslations("tools.metaTagPreviewer.ui");
  const tCommon = useTranslations("common.toast");

  const { url, setUrl, setMetaTags, setLoading, isLoading, setError } = useMetaStore();
  const [inputUrl, setInputUrl] = useState(url);

  const handleFetch = async () => {
    if (!inputUrl.trim()) {
      toast.error(t("enterUrl"));
      return;
    }

    // URL에 프로토콜이 없으면 https:// 추가
    let normalizedUrl = inputUrl.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    if (!isValidUrl(normalizedUrl)) {
      toast.error(t("invalidUrl"));
      return;
    }

    setUrl(normalizedUrl);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/fetch-meta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      const result: FetchMetaResponse = await response.json();

      if (result.success && result.data) {
        setMetaTags(result.data);
        toast.success(t("fetchSuccess"));
      } else {
        setError(result.error || t("fetchFailed"));
        toast.error(result.error || t("fetchFailed"));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t("fetchFailed");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleFetch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t("urlInput")}
        </CardTitle>
        <CardDescription>{t("urlInputDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="url"
              placeholder={t("urlPlaceholder")}
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="pr-10"
            />
          </div>
          <Button onClick={handleFetch} disabled={isLoading || !inputUrl.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {t("fetch")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
