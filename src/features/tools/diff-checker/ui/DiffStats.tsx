'use client';

import { Plus, Minus, Equal } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import type { DiffStats as DiffStatsType, DiffMode } from '../model/types';

interface DiffStatsProps {
  stats: DiffStatsType;
  mode: DiffMode;
}

export function DiffStats({ stats, mode }: DiffStatsProps) {
  const unit = mode === 'line' ? '줄' : mode === 'word' ? '단어' : '문자';

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          {/* 추가 */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-green-100 dark:bg-green-900/30">
              <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-green-600 dark:text-green-400 font-medium">
              +{stats.additions} {unit} 추가
            </span>
          </div>

          {/* 구분선 */}
          <div className="w-px h-6 bg-border hidden sm:block" />

          {/* 삭제 */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-red-100 dark:bg-red-900/30">
              <Minus className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-red-600 dark:text-red-400 font-medium">
              -{stats.deletions} {unit} 삭제
            </span>
          </div>

          {/* 구분선 */}
          <div className="w-px h-6 bg-border hidden sm:block" />

          {/* 변경 없음 */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-muted">
              <Equal className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-muted-foreground font-medium">
              {stats.unchanged} {unit} 동일
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
