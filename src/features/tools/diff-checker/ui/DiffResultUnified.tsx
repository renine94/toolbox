'use client';

import { cn } from '@/shared/lib/utils';
import type { DiffResult } from '../model/types';

interface DiffResultUnifiedProps {
  results: DiffResult[];
}

export function DiffResultUnified({ results }: DiffResultUnifiedProps) {
  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        비교 결과가 여기에 표시됩니다
      </div>
    );
  }

  return (
    <div className="font-mono text-sm whitespace-pre-wrap break-all">
      {results.map((result, index) => (
        <span
          key={index}
          className={cn(
            'inline',
            result.type === 'insert' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            result.type === 'delete' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 line-through',
            result.type === 'equal' && 'text-foreground'
          )}
        >
          {result.value}
        </span>
      ))}
    </div>
  );
}
