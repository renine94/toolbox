"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Palette, ImageIcon, Download, Save } from "lucide-react";
import { BaseColorPicker } from "./BaseColorPicker";
import { HarmonySelector } from "./HarmonySelector";
import { PaletteDisplay } from "./PaletteDisplay";
import { CustomColors } from "./CustomColors";
import { ImageExtractor } from "./ImageExtractor";
import { ExportPanel } from "./ExportPanel";
import { SavedPalettes } from "./SavedPalettes";
import { PaletteColor } from "../model/types";

export function ColorPalette() {
  const [currentColors, setCurrentColors] = useState<PaletteColor[]>([]);

  const handleColorsChange = useCallback((colors: PaletteColor[]) => {
    setCurrentColors(colors);
  }, []);

  return (
    <div className="space-y-6">
      {/* Main Palette Section */}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left Panel - Controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5" />
                색상 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <BaseColorPicker />
              <HarmonySelector />
              <CustomColors />
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Palette Display */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">생성된 팔레트</CardTitle>
          </CardHeader>
          <CardContent>
            <PaletteDisplay onColorsChange={handleColorsChange} />
          </CardContent>
        </Card>
      </div>

      {/* Additional Features */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Image Extractor */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              이미지 추출
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageExtractor />
          </CardContent>
        </Card>

        {/* Export Panel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5" />
              내보내기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExportPanel colors={currentColors} />
          </CardContent>
        </Card>

        {/* Saved Palettes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Save className="h-5 w-5" />
              저장된 팔레트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SavedPalettes currentColors={currentColors} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
