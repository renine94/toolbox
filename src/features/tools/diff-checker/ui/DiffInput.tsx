'use client';

import { useCallback, useState, DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Textarea } from '@/shared/ui/textarea';
import { cn } from '@/shared/lib/utils';

interface DiffInputProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  onFileDrop: (file: File) => Promise<void>;
  placeholder?: string;
}

export function DiffInput({
  title,
  value,
  onChange,
  onFileDrop,
  placeholder = '텍스트를 입력하세요...',
}: DiffInputProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        await onFileDrop(files[0]);
      }
    },
    [onFileDrop]
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-muted-foreground">📄</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-transparent'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-lg">
              <div className="flex flex-col items-center gap-2 text-primary">
                <Upload className="w-8 h-8" />
                <span className="text-sm font-medium">파일을 여기에 놓으세요</span>
              </div>
            </div>
          )}
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[250px] resize-none font-mono text-sm"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          텍스트를 직접 입력하거나 파일을 드래그&드롭하세요
        </p>
      </CardContent>
    </Card>
  );
}
