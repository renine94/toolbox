"use client";

import { useTranslations } from "next-intl";
import { LanguageSelector } from "./LanguageSelector";
import { CodeEditor } from "./CodeEditor";
import { CodeOutput } from "./CodeOutput";
import { ControlPanel } from "./ControlPanel";

export function CodeRunner() {
  const t = useTranslations("tools.codeRunner.ui");

  return (
    <div className="space-y-6">
      {/* Header with Language Selector and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <LanguageSelector />
        <ControlPanel />
      </div>

      {/* Editor and Output */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeEditor />
        <CodeOutput />
      </div>

      {/* Info Section */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <h3 className="font-medium text-foreground mb-2">{t("tips")}</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>{t("tipJs")}</li>
          <li>{t("tipPython")}</li>
          <li>{t("tipTimeout")}</li>
          <li>{t("tipPythonLoad")}</li>
        </ul>
      </div>
    </div>
  );
}
