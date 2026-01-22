'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Copy, Trash2, FileCode, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePhpUnserializerStore } from '../model/usePhpUnserializerStore';

export function PhpUnserializer() {
  const t = useTranslations('tools.phpUnserializer.ui');
  const tCommon = useTranslations('common.toast');

  const {
    input,
    output,
    error,
    indentSize,
    setInput,
    setIndentSize,
    loadExample,
    clear,
  } = usePhpUnserializerStore();

  const handleCopy = () => {
    if (!output) {
      toast.error(t('nothingToCopy'));
      return;
    }
    navigator.clipboard.writeText(output);
    toast.success(tCommon('copied'));
  };

  const handleLoadExample = () => {
    loadExample();
    toast.success(t('exampleLoaded'));
  };

  const handleClear = () => {
    clear();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Control Panel */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            <Button onClick={handleLoadExample} variant="outline" size="sm">
              <FileCode className="w-4 h-4 mr-2" />
              {t('loadExample')}
            </Button>

            <Select
              value={String(indentSize)}
              onValueChange={(v) => setIndentSize(Number(v))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">{t('indent')} 2</SelectItem>
                <SelectItem value="4">{t('indent')} 4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              disabled={!output}
            >
              <Copy className="w-4 h-4 mr-2" />
              {t('copy')}
            </Button>
            <Button
              onClick={handleClear}
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('clear')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Input/Output Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Panel */}
        <Card className="p-4 flex flex-col gap-3">
          <Label htmlFor="php-input" className="text-lg font-semibold">
            {t('inputLabel')}
          </Label>
          <Textarea
            id="php-input"
            placeholder={t('inputPlaceholder')}
            className="flex-1 min-h-[400px] font-mono text-sm resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Card>

        {/* Output Panel */}
        <Card className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="php-output" className="text-lg font-semibold">
              {t('outputLabel')}
            </Label>
            {error && (
              <span className="flex items-center gap-1 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </span>
            )}
          </div>
          <Textarea
            id="php-output"
            readOnly
            placeholder={t('outputPlaceholder')}
            className={`flex-1 min-h-[400px] font-mono text-sm resize-none ${
              error ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            value={output}
          />
        </Card>
      </div>
    </div>
  );
}
