"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { useQuickAccessStore } from "../model/useQuickAccessStore";
import { isValidToolId } from "../lib/tool-registry";

/**
 * 도구 사용 추적 컴포넌트
 * 현재 경로가 유효한 도구 페이지인 경우 사용 기록을 저장합니다.
 * 레이아웃에 한 번만 렌더링하면 됩니다.
 */
export function ToolUsageTracker() {
  const pathname = usePathname();
  const recordUsage = useQuickAccessStore((state) => state.recordUsage);
  const lastRecordedPath = useRef<string | null>(null);

  useEffect(() => {
    // pathname이 이미 locale prefix가 제거된 상태 (@/i18n/navigation의 usePathname 사용)
    // 예: /json-formatter, /color-picker
    const toolId = pathname.replace(/^\//, ""); // 앞의 / 제거

    // 유효한 도구 ID이고, 이전에 기록하지 않은 경로인 경우에만 기록
    if (isValidToolId(toolId) && lastRecordedPath.current !== pathname) {
      recordUsage(toolId);
      lastRecordedPath.current = pathname;
    }
  }, [pathname, recordUsage]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}
