'use client';

import { useTranslations } from 'next-intl';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { FileCode2, RotateCcw } from 'lucide-react';
import { useTypingGifStore } from '../model/useTypingGifStore';
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, SupportedLanguage } from '../model/types';

export function CodeInput() {
  const t = useTranslations('tools.codeTypingGif.ui');
  const { code, setCode, settings, setLanguage, loadTemplate } = useTypingGifStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode2 className="h-5 w-5" />
          {t('codeInput')}
        </CardTitle>
        <CardDescription>{t('codeInputDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 언어 선택 */}
        <div className="flex items-center gap-4">
          <Select
            value={settings.language}
            onValueChange={(value) => setLanguage(value as SupportedLanguage)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectLanguage')} />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={loadTemplate}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('loadTemplate')}
          </Button>
        </div>

        {/* 코드 입력 영역 */}
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t('codePlaceholder')}
          className="min-h-[300px] font-mono text-sm resize-none"
          spellCheck={false}
        />

        {/* 문자 수 표시 */}
        <div className="text-sm text-muted-foreground text-right">
          {t('charCount', { count: code.length })}
        </div>
      </CardContent>
    </Card>
  );
}
