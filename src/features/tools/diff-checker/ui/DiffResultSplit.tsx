'use client';

import { cn } from '@/shared/lib/utils';
import type { LineDiff } from '../model/types';

interface DiffResultSplitProps {
  lineDiffs: LineDiff[];
}

export function DiffResultSplit({ lineDiffs }: DiffResultSplitProps) {
  if (lineDiffs.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        비교 결과가 여기에 표시됩니다
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-0 font-mono text-sm border rounded-lg overflow-hidden">
      {/* 왼쪽: Original */}
      <div className="border-r">
        <div className="bg-muted px-3 py-2 font-semibold text-muted-foreground border-b">
          Original
        </div>
        <div className="overflow-auto max-h-[400px]">
          {lineDiffs.map((line, index) => (
            <div
              key={`original-${index}`}
              className={cn(
                'flex',
                line.type === 'delete' && 'bg-red-100 dark:bg-red-900/30',
                line.type === 'insert' && 'bg-muted/50'
              )}
            >
              {/* 줄 번호 */}
              <div className="w-10 flex-shrink-0 text-right pr-2 py-1 text-muted-foreground bg-muted/50 select-none border-r">
                {line.lineNumber.original || ''}
              </div>
              {/* 내용 */}
              <div
                className={cn(
                  'flex-1 px-2 py-1 whitespace-pre-wrap break-all',
                  line.type === 'delete' && 'text-red-800 dark:text-red-300',
                  line.type === 'insert' && 'text-muted-foreground'
                )}
              >
                {line.type === 'delete' && (
                  <span className="mr-1 text-red-600 dark:text-red-400">-</span>
                )}
                {line.originalValue || (line.type === 'insert' ? '' : '\u00A0')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽: Modified */}
      <div>
        <div className="bg-muted px-3 py-2 font-semibold text-muted-foreground border-b">
          Modified
        </div>
        <div className="overflow-auto max-h-[400px]">
          {lineDiffs.map((line, index) => (
            <div
              key={`modified-${index}`}
              className={cn(
                'flex',
                line.type === 'insert' && 'bg-green-100 dark:bg-green-900/30',
                line.type === 'delete' && 'bg-muted/50'
              )}
            >
              {/* 줄 번호 */}
              <div className="w-10 flex-shrink-0 text-right pr-2 py-1 text-muted-foreground bg-muted/50 select-none border-r">
                {line.lineNumber.modified || ''}
              </div>
              {/* 내용 */}
              <div
                className={cn(
                  'flex-1 px-2 py-1 whitespace-pre-wrap break-all',
                  line.type === 'insert' && 'text-green-800 dark:text-green-300',
                  line.type === 'delete' && 'text-muted-foreground'
                )}
              >
                {line.type === 'insert' && (
                  <span className="mr-1 text-green-600 dark:text-green-400">+</span>
                )}
                {line.modifiedValue || (line.type === 'delete' ? '' : '\u00A0')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
