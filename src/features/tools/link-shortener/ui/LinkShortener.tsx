"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Link2, Sparkles, History } from "lucide-react";
import { UrlInputPanel } from "./UrlInputPanel";
import { ResultPanel } from "./ResultPanel";
import { ShortenHistory } from "./ShortenHistory";

export function LinkShortener() {
  return (
    <div className="space-y-6">
      {/* Main Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Panel - Input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              URL 입력
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UrlInputPanel />
          </CardContent>
        </Card>

        {/* Right Panel - Result */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              결과
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResultPanel />
          </CardContent>
        </Card>
      </div>

      {/* History Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            단축 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ShortenHistory />
        </CardContent>
      </Card>
    </div>
  );
}
