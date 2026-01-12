"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BookOpen, Sparkles } from "lucide-react";
import { CronInput } from "./CronInput";
import { CronBuilder } from "./CronBuilder";
import { ExpressionExplain } from "./ExpressionExplain";
import { ExecutionSchedule } from "./ExecutionSchedule";
import { PresetExamples } from "./PresetExamples";
import { CronCheatSheet } from "./CronCheatSheet";

type SidebarTab = "presets" | "cheatsheet";

export function CronParser() {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("presets");
  const t = useTranslations("tools.cronParser.ui");

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 space-y-6">
        {/* 입력 섹션 */}
        <CronInput />

        {/* 빌더 섹션 */}
        <CronBuilder />

        {/* 결과 섹션 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ExpressionExplain />
          <ExecutionSchedule />
        </div>
      </div>

      {/* 사이드바 */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="p-4 bg-card rounded-lg border lg:sticky lg:top-4">
          {/* 탭 */}
          <div className="flex gap-1 mb-4 border-b -mx-4 px-4">
            <button
              onClick={() => setSidebarTab("presets")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                sidebarTab === "presets"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              {t("presets")}
            </button>
            <button
              onClick={() => setSidebarTab("cheatsheet")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                sidebarTab === "cheatsheet"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              {t("cheatsheet")}
            </button>
          </div>

          {/* 콘텐츠 */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {sidebarTab === "presets" && <PresetExamples />}
            {sidebarTab === "cheatsheet" && <CronCheatSheet />}
          </div>
        </div>
      </div>
    </div>
  );
}
