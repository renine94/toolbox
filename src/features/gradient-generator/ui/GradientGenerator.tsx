"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Palette, Settings, Code, Bookmark, Sparkles } from "lucide-react";
import { GradientPreview } from "./GradientPreview";
import { GradientControls } from "./GradientControls";
import { ColorStops } from "./ColorStops";
import { CodeOutput } from "./CodeOutput";
import { PresetGradients } from "./PresetGradients";
import { SavedGradients } from "./SavedGradients";

export function GradientGenerator() {
  return (
    <div className="space-y-6">
      {/* Main Section */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left Panel - Preview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5" />
              미리보기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GradientPreview />
          </CardContent>
        </Card>

        {/* Right Panel - Controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                그라디언트 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GradientControls />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5" />
                색상 스톱
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ColorStops />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Features */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Presets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              프리셋
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PresetGradients />
          </CardContent>
        </Card>

        {/* Code Output */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-5 w-5" />
              코드 출력
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeOutput />
          </CardContent>
        </Card>

        {/* Saved Gradients */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              저장된 그라디언트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SavedGradients />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
