"use client";

import { useState } from "react";
import { useMarkdownStore } from "../model/useMarkdownStore";
import {
  downloadMarkdown,
  downloadHtml,
  downloadPdf,
  copyToClipboard,
  copyHtmlToClipboard,
} from "../lib/export-utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Download,
  FileText,
  FileCode,
  FileType,
  Copy,
  Clipboard,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export function ExportPanel() {
  const { content, title } = useMarkdownStore();
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const sanitizeFilename = (name: string) => {
    return name.replace(/[^a-zA-Z0-9가-힣\s-_]/g, "").trim() || "document";
  };

  const handleExport = async (format: "markdown" | "html" | "pdf") => {
    if (!content.trim()) {
      toast.error("내보낼 내용이 없습니다");
      return;
    }

    setIsExporting(format);
    const filename = sanitizeFilename(title);

    try {
      switch (format) {
        case "markdown":
          await downloadMarkdown(content, filename);
          toast.success("Markdown 파일이 다운로드되었습니다");
          break;
        case "html":
          await downloadHtml(content, filename);
          toast.success("HTML 파일이 다운로드되었습니다");
          break;
        case "pdf":
          await downloadPdf(content, filename);
          toast.success("PDF 파일이 다운로드되었습니다");
          break;
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "내보내기에 실패했습니다"
      );
    } finally {
      setIsExporting(null);
    }
  };

  const handleCopy = async (type: "markdown" | "html") => {
    if (!content.trim()) {
      toast.error("복사할 내용이 없습니다");
      return;
    }

    try {
      const success =
        type === "markdown"
          ? await copyToClipboard(content)
          : await copyHtmlToClipboard(content);

      if (success) {
        toast.success(
          type === "markdown"
            ? "Markdown이 클립보드에 복사되었습니다"
            : "HTML이 클립보드에 복사되었습니다"
        );
      } else {
        toast.error("복사에 실패했습니다");
      }
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Download className="h-4 w-4" />
          내보내기
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("markdown")}
            disabled={isExporting !== null}
            className="h-auto flex-col gap-1 py-2"
          >
            {isExporting === "markdown" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            <span className="text-xs">.md</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("html")}
            disabled={isExporting !== null}
            className="h-auto flex-col gap-1 py-2"
          >
            {isExporting === "html" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileCode className="h-4 w-4" />
            )}
            <span className="text-xs">.html</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("pdf")}
            disabled={isExporting !== null}
            className="h-auto flex-col gap-1 py-2"
          >
            {isExporting === "pdf" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileType className="h-4 w-4" />
            )}
            <span className="text-xs">.pdf</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy("markdown")}
            className="h-8 gap-1.5 text-xs"
          >
            <Copy className="h-3.5 w-3.5" />
            MD 복사
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy("html")}
            className="h-8 gap-1.5 text-xs"
          >
            <Clipboard className="h-3.5 w-3.5" />
            HTML 복사
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
