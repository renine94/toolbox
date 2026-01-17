"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import { Input } from "@/shared/ui/input";
import { toast } from "sonner";
import { Copy, Trash2, Settings2, FileCode } from "lucide-react";
import { jsonToTypescript } from "../lib/converter";
import { ConversionOptions, DEFAULT_OPTIONS } from "../model/types";

export function JsonToTypescript() {
  const t = useTranslations("tools.jsonToTypescript.ui");
  const tCommon = useTranslations("common");

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ConversionOptions>(DEFAULT_OPTIONS);

  // 실시간 변환
  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    const result = jsonToTypescript(input, options);

    if (result.success) {
      setOutput(result.output);
      setError(null);
    } else {
      setOutput("");
      setError(result.error || t("invalidJson"));
    }
  }, [input, options, t]);

  // 입력이나 옵션 변경 시 자동 변환
  useEffect(() => {
    const timeoutId = setTimeout(convert, 300);
    return () => clearTimeout(timeoutId);
  }, [convert]);

  const handleCopy = async () => {
    if (!output) {
      toast.error(t("nothingToCopy"));
      return;
    }
    try {
      await navigator.clipboard.writeText(output);
      toast.success(tCommon("toast.copied"));
    } catch {
      toast.error(tCommon("toast.copyError"));
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const updateOption = <K extends keyof ConversionOptions>(
    key: K,
    value: ConversionOptions[K]
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 왼쪽: JSON 입력 */}
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            {t("input")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            className="flex-1 min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            spellCheck={false}
          />
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="h-4 w-4 mr-1" />
              {t("clear")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 오른쪽: TypeScript 출력 + 옵션 */}
      <div className="flex flex-col gap-4">
        {/* 옵션 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              {t("options")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 루트 타입 이름 */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-32 shrink-0">
                {t("rootName")}
              </span>
              <Input
                value={options.rootName}
                onChange={(e) => updateOption("rootName", e.target.value || "Root")}
                className="h-8 font-mono"
                placeholder="Root"
              />
            </div>

            {/* Interface vs Type */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {options.useInterface ? t("useInterface") : t("useType")}
              </span>
              <Switch
                checked={options.useInterface}
                onCheckedChange={(checked) => updateOption("useInterface", checked)}
              />
            </div>

            {/* Export */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t("exportTypes")}
              </span>
              <Switch
                checked={options.exportTypes}
                onCheckedChange={(checked) => updateOption("exportTypes", checked)}
              />
            </div>

            {/* Optional */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t("optionalProperties")}
              </span>
              <Switch
                checked={options.optionalProperties}
                onCheckedChange={(checked) => updateOption("optionalProperties", checked)}
              />
            </div>

            {/* Readonly */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t("readonlyProperties")}
              </span>
              <Switch
                checked={options.readonlyProperties}
                onCheckedChange={(checked) => updateOption("readonlyProperties", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* TypeScript 출력 */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t("output")}</CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-1" />
                {t("copy")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <pre className="h-full min-h-[250px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm font-mono overflow-auto whitespace-pre">
              {output || (
                <span className="text-muted-foreground">
                  {t("outputPlaceholder")}
                </span>
              )}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
