"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RegexInput } from "./RegexInput";
import { FlagSelector } from "./FlagSelector";
import { TestInput } from "./TestInput";
import { MatchResults } from "./MatchResults";
import { ControlPanel } from "./ControlPanel";
import { CheatSheet } from "./CheatSheet";
import { History } from "./History";
import { BookOpen, Clock } from "lucide-react";

type SidebarTab = "cheatsheet" | "history";

export function RegexTester() {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("cheatsheet");
  const t = useTranslations("tools.regexTester.ui");

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Input Section */}
        <div className="space-y-4 p-4 bg-card rounded-lg border">
          <RegexInput />
          <FlagSelector />
        </div>

        {/* Test & Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 bg-card rounded-lg border">
            <TestInput />
          </div>
          <div className="p-4 bg-card rounded-lg border">
            <MatchResults />
          </div>
        </div>

        {/* Control Panel */}
        <div className="p-4 bg-card rounded-lg border">
          <ControlPanel />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="p-4 bg-card rounded-lg border sticky top-4">
          {/* Sidebar Tabs */}
          <div className="flex gap-2 mb-4 border-b">
            <button
              onClick={() => setSidebarTab("cheatsheet")}
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                sidebarTab === "cheatsheet"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {t("cheatsheet")}
            </button>
            <button
              onClick={() => setSidebarTab("history")}
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                sidebarTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="w-4 h-4" />
              {t("history")}
            </button>
          </div>

          {/* Sidebar Content */}
          {sidebarTab === "cheatsheet" && <CheatSheet />}
          {sidebarTab === "history" && <History />}
        </div>
      </div>
    </div>
  );
}
