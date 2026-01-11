"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Loader2, Play, Copy, Trash2 } from "lucide-react";
import { useCodeStore } from "../model/useCodeStore";
import { executeCode } from "../lib/executor";
import { toast } from "sonner";

export function ControlPanel() {
  const {
    code,
    language,
    isRunning,
    setOutput,
    setIsRunning,
    setIsPyodideLoading,
    clear,
  } = useCodeStore();
  const t = useTranslations("tools.codeRunner.ui");

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error(t("enterCode"));
      return;
    }

    setIsRunning(true);
    setOutput(null);

    try {
      const result = await executeCode(
        code,
        language,
        () => setIsPyodideLoading(true),
        () => setIsPyodideLoading(false)
      );
      setOutput(result);

      if (result.error) {
        toast.error(t("executionFailed"));
      } else {
        toast.success(t("executedIn", { time: result.executionTime.toFixed(2) }));
      }
    } catch {
      toast.error(t("unexpectedError"));
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(t("codeCopied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  const handleClear = () => {
    clear();
    toast.success(t("codeCleared"));
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleRun}
        disabled={isRunning}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {isRunning ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t("running")}
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            {t("run")}
          </>
        )}
      </Button>
      <Button variant="outline" onClick={handleCopy} disabled={isRunning}>
        <Copy className="h-4 w-4 mr-2" />
        {t("copy")}
      </Button>
      <Button variant="outline" onClick={handleClear} disabled={isRunning}>
        <Trash2 className="h-4 w-4 mr-2" />
        {t("clear")}
      </Button>
    </div>
  );
}
