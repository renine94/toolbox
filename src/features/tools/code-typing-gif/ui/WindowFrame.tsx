'use client';

import { WindowStyle, Theme } from '../model/types';
import { getThemeColors } from '../lib/themes';

interface WindowFrameProps {
  windowStyle: WindowStyle;
  theme: Theme;
  title?: string;
  children: React.ReactNode;
}

export function WindowFrame({ windowStyle, theme, title = 'code.ts', children }: WindowFrameProps) {
  const colors = getThemeColors(theme);

  if (windowStyle === 'none') {
    return (
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: colors.background }}
      >
        {children}
      </div>
    );
  }

  if (windowStyle === 'macos') {
    return (
      <div
        className="rounded-lg overflow-hidden shadow-lg"
        style={{
          backgroundColor: colors.windowBg,
          border: `1px solid ${colors.windowBorder}`,
        }}
      >
        {/* macOS 타이틀바 */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ backgroundColor: colors.windowBg }}
        >
          {/* 트래픽 라이트 버튼 */}
          <div className="flex gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.windowButtonClose }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.windowButtonMinimize }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.windowButtonMaximize }}
            />
          </div>
          {/* 파일명 */}
          <div
            className="flex-1 text-center text-sm opacity-60"
            style={{ color: colors.foreground }}
          >
            {title}
          </div>
          {/* 오른쪽 공간 맞추기 */}
          <div className="w-14" />
        </div>
        {/* 컨텐츠 */}
        {children}
      </div>
    );
  }

  // Windows 스타일
  return (
    <div
      className="rounded-sm overflow-hidden shadow-lg"
      style={{
        backgroundColor: colors.windowBg,
        border: `1px solid ${colors.windowBorder}`,
      }}
    >
      {/* Windows 타이틀바 */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ backgroundColor: colors.windowBg }}
      >
        {/* 파일명 */}
        <div
          className="text-sm opacity-80"
          style={{ color: colors.foreground }}
        >
          {title}
        </div>
        {/* 윈도우 버튼 */}
        <div className="flex">
          <button
            className="px-4 py-1 hover:bg-white/10"
            style={{ color: colors.foreground }}
          >
            ─
          </button>
          <button
            className="px-4 py-1 hover:bg-white/10"
            style={{ color: colors.foreground }}
          >
            □
          </button>
          <button
            className="px-4 py-1 hover:bg-red-600"
            style={{ color: colors.foreground }}
          >
            ✕
          </button>
        </div>
      </div>
      {/* 컨텐츠 */}
      {children}
    </div>
  );
}
