'use client';

import { useRef } from 'react';
import { CodeInput } from './CodeInput';
import { PreviewPanel, PreviewPanelRef } from './PreviewPanel';
import { SettingsPanel } from './SettingsPanel';
import { ExportPanel } from './ExportPanel';

export function CodeTypingGif() {
  const previewRef = useRef<PreviewPanelRef>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 왼쪽: 코드 입력 & 설정 */}
      <div className="space-y-6">
        <CodeInput />
        <SettingsPanel />
      </div>

      {/* 오른쪽: 미리보기 & 내보내기 */}
      <div className="space-y-6">
        <PreviewPanel ref={previewRef} />
        <ExportPanel previewRef={previewRef} />
      </div>
    </div>
  );
}
