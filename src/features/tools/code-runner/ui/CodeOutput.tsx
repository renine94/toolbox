"use client";

import { useTranslations } from "next-intl";
import { useCodeStore } from "../model/useCodeStore";

export function CodeOutput() {
  const { output, isRunning, isPyodideLoading } = useCodeStore();
  const t = useTranslations("tools.codeRunner.ui");

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{t("output")}</span>
        {output && (
          <span className="text-xs text-muted-foreground">
            {t("executionTime")}: {output.executionTime.toFixed(2)}ms
          </span>
        )}
      </div>
      <div className="h-[300px] overflow-auto bg-background p-4 font-mono text-sm">
        {isRunning ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            <span>{isPyodideLoading ? t("loadingPython") : t("running")}</span>
          </div>
        ) : output ? (
          <div className="space-y-2">
            {output.stdout && (
              <pre className="whitespace-pre-wrap text-foreground">{output.stdout}</pre>
            )}
            {output.stderr && (
              <pre className="whitespace-pre-wrap text-yellow-600 dark:text-yellow-400">
                {output.stderr}
              </pre>
            )}
            {output.error && (
              <pre className="whitespace-pre-wrap text-red-600 dark:text-red-400">
                Error: {output.error}
              </pre>
            )}
            {!output.stdout && !output.stderr && !output.error && (
              <span className="text-muted-foreground italic">{t("noOutput")}</span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground italic">
            {t("clickToRun")}
          </span>
        )}
      </div>
    </div>
  );
}
