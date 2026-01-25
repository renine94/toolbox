'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Slider } from '@/shared/ui/slider';
import { Switch } from '@/shared/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Settings } from 'lucide-react';
import { useTypingGifStore } from '../model/useTypingGifStore';
import {
  THEMES,
  THEME_LABELS,
  CURSOR_STYLES,
  WINDOW_STYLES,
  GIF_QUALITY_PRESETS,
  GIF_QUALITY_CONFIG,
  Theme,
  CursorStyle,
  WindowStyle,
  GifQualityPreset,
} from '../model/types';

export function SettingsPanel() {
  const t = useTranslations('tools.codeTypingGif.ui');
  const {
    settings,
    setTheme,
    setTypingSpeed,
    setCursorStyle,
    setWindowStyle,
    setFontSize,
    setGifWidth,
    setShowLineNumbers,
    setGifQuality,
  } = useTypingGifStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t('settings')}
        </CardTitle>
        <CardDescription>{t('settingsDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 테마 */}
        <div className="space-y-2">
          <Label>{t('theme')}</Label>
          <Select
            value={settings.theme}
            onValueChange={(value) => setTheme(value as Theme)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THEMES.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {THEME_LABELS[theme]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 타이핑 속도 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>{t('typingSpeed')}</Label>
            <span className="text-sm text-muted-foreground">{settings.typingSpeed}ms</span>
          </div>
          <Slider
            value={[settings.typingSpeed]}
            onValueChange={([value]) => setTypingSpeed(value)}
            min={20}
            max={200}
            step={10}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t('fast')}</span>
            <span>{t('slow')}</span>
          </div>
        </div>

        {/* 커서 스타일 */}
        <div className="space-y-2">
          <Label>{t('cursorStyle')}</Label>
          <Select
            value={settings.cursorStyle}
            onValueChange={(value) => setCursorStyle(value as CursorStyle)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURSOR_STYLES.map((style) => (
                <SelectItem key={style} value={style}>
                  {t(`cursorStyles.${style}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 창 스타일 */}
        <div className="space-y-2">
          <Label>{t('windowStyle')}</Label>
          <Select
            value={settings.windowStyle}
            onValueChange={(value) => setWindowStyle(value as WindowStyle)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WINDOW_STYLES.map((style) => (
                <SelectItem key={style} value={style}>
                  {t(`windowStyles.${style}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 폰트 크기 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>{t('fontSize')}</Label>
            <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
          </div>
          <Slider
            value={[settings.fontSize]}
            onValueChange={([value]) => setFontSize(value)}
            min={12}
            max={20}
            step={1}
          />
        </div>

        {/* GIF 너비 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>{t('gifWidth')}</Label>
            <span className="text-sm text-muted-foreground">{settings.gifWidth}px</span>
          </div>
          <Slider
            value={[settings.gifWidth]}
            onValueChange={([value]) => setGifWidth(value)}
            min={400}
            max={1000}
            step={50}
          />
        </div>

        {/* GIF 화질 */}
        <div className="space-y-2">
          <Label>{t('gifQuality')}</Label>
          <Select
            value={settings.gifQuality}
            onValueChange={(value) => setGifQuality(value as GifQualityPreset)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GIF_QUALITY_PRESETS.map((preset) => (
                <SelectItem key={preset} value={preset}>
                  {t(`gifQualityPresets.${preset}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {t(`gifQualityDesc.${settings.gifQuality}`)}
          </p>
        </div>

        {/* 줄 번호 표시 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="show-line-numbers">{t('showLineNumbers')}</Label>
          <Switch
            id="show-line-numbers"
            checked={settings.showLineNumbers}
            onCheckedChange={setShowLineNumbers}
          />
        </div>
      </CardContent>
    </Card>
  );
}
