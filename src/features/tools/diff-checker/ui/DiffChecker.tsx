'use client';

import { ArrowLeftRight, RotateCcw, Copy, GitCompare } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group';
import { useDiff } from '../model/useDiff';
import { DIFF_MODE_OPTIONS, VIEW_MODE_OPTIONS } from '../model/types';
import { DiffInput } from './DiffInput';
import { DiffStats } from './DiffStats';
import { DiffResultUnified } from './DiffResultUnified';
import { DiffResultSplit } from './DiffResultSplit';

export function DiffChecker() {
  const {
    original,
    modified,
    diffMode,
    viewMode,
    results,
    lineDiffs,
    stats,
    isCompared,
    setOriginal,
    setModified,
    setDiffMode,
    setViewMode,
    compare,
    swap,
    clear,
    copyResult,
    handleFileDrop,
  } = useDiff();

  return (
    <div className="space-y-6">
      {/* 모드 선택 영역 */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* 비교 모드 */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">비교 모드:</span>
              <ToggleGroup
                type="single"
                value={diffMode}
                onValueChange={(value) => value && setDiffMode(value as typeof diffMode)}
              >
                {DIFF_MODE_OPTIONS.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    aria-label={option.description}
                    className="px-3"
                  >
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* 뷰 모드 */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">뷰 모드:</span>
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={(value) => value && setViewMode(value as typeof viewMode)}
              >
                {VIEW_MODE_OPTIONS.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    aria-label={option.label}
                    className="px-3"
                  >
                    <span className="mr-1">{option.icon}</span>
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 입력 영역 */}
      <div className="grid gap-6 md:grid-cols-2">
        <DiffInput
          title="Original"
          value={original}
          onChange={setOriginal}
          onFileDrop={(file) => handleFileDrop(file, 'original')}
          placeholder="원본 텍스트를 입력하세요..."
        />
        <DiffInput
          title="Modified"
          value={modified}
          onChange={setModified}
          onFileDrop={(file) => handleFileDrop(file, 'modified')}
          placeholder="수정된 텍스트를 입력하세요..."
        />
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={compare} size="lg" className="gap-2">
          <GitCompare className="w-4 h-4" />
          비교하기
        </Button>
        <Button onClick={swap} variant="outline" size="lg" className="gap-2">
          <ArrowLeftRight className="w-4 h-4" />
          스왑
        </Button>
        <Button onClick={clear} variant="outline" size="lg" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          초기화
        </Button>
      </div>

      {/* 통계 (비교 완료 시에만 표시) */}
      {isCompared && <DiffStats stats={stats} mode={diffMode} />}

      {/* 결과 영역 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Diff 결과</CardTitle>
            {isCompared && results.length > 0 && (
              <Button onClick={copyResult} variant="outline" size="sm" className="gap-2">
                <Copy className="w-4 h-4" />
                복사
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-4 min-h-[200px] overflow-auto max-h-[500px]">
            {viewMode === 'unified' ? (
              <DiffResultUnified results={results} />
            ) : (
              <DiffResultSplit lineDiffs={lineDiffs} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
