import { Metadata } from 'next';
import { DiffChecker } from '@/features/tools/diff-checker';

export const metadata: Metadata = {
  title: 'Diff Checker - 텍스트 비교 도구',
  description:
    '두 텍스트의 차이점을 비교하고 시각적으로 확인하세요. 문자, 단어, 줄 단위 비교와 Unified/Split 뷰를 지원합니다.',
  keywords: ['diff', 'text compare', 'diff checker', 'text diff', '텍스트 비교', '차이점 비교'],
};

export default function DiffCheckerPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Diff Checker</h1>
          <p className="text-muted-foreground">
            두 텍스트의 차이점을 비교하고 시각적으로 확인하세요.
            파일을 드래그&드롭하거나 직접 텍스트를 입력할 수 있습니다.
          </p>
        </div>
        <DiffChecker />
      </main>
    </div>
  );
}
