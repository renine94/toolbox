"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { useImageStore } from "../model/useImageStore";
import { ImageUploader } from "./ImageUploader";
import { ImageCanvas } from "./ImageCanvas";
import { FilterControls } from "./FilterControls";
import { TransformControls } from "./TransformControls";
import { ResizeControls } from "./ResizeControls";
import { ExportPanel } from "./ExportPanel";
import { Toolbar } from "./Toolbar";

const TABS = [
  { id: "filters" as const, label: "필터", icon: "🎨" },
  { id: "transform" as const, label: "변환", icon: "🔄" },
  { id: "resize" as const, label: "크기", icon: "📐" },
] as const;

export function ImageEditor() {
  const { originalImage, activeTab, setActiveTab, cleanup } = useImageStore();

  // 컴포넌트 언마운트 시 Worker 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // 이미지가 없으면 업로더 표시
  if (!originalImage) {
    return <ImageUploader />;
  }

  return (
    <div className="space-y-6">
      {/* 툴바 */}
      <Toolbar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 이미지 캔버스 */}
        <div className="lg:col-span-2 space-y-4">
          <ImageCanvas />
        </div>

        {/* 오른쪽: 컨트롤 패널 */}
        <div className="space-y-4">
          {/* 탭 버튼 */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            {TABS.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 cursor-pointer"
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>

          {/* 활성 탭 컨트롤 */}
          <div className="max-h-[500px] overflow-y-auto">
            {activeTab === "filters" && <FilterControls />}
            {activeTab === "transform" && <TransformControls />}
            {activeTab === "resize" && <ResizeControls />}
          </div>

          {/* 내보내기 패널 */}
          <ExportPanel />
        </div>
      </div>
    </div>
  );
}
