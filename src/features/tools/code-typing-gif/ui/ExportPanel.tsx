'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { Download, Loader2, Film, RefreshCw } from 'lucide-react';
import { useTypingGifStore } from '../model/useTypingGifStore';
import { GIF_QUALITY_CONFIG } from '../model/types';
import { generateTypingGif, downloadGif, estimateGifSize, estimateGenerationTime } from '../lib/gif-generator';
import type { PreviewPanelRef } from './PreviewPanel';

interface ExportPanelProps {
  previewRef: React.RefObject<PreviewPanelRef | null>;
}

export function ExportPanel({ previewRef }: ExportPanelProps) {
  const t = useTranslations('tools.codeTypingGif.ui');
  const tCommon = useTranslations('common.toast');

  const {
    code,
    settings,
    gifState,
    gifProgress,
    generatedGifUrl,
    startGifGeneration,
    setGifProgress,
    completeGifGeneration,
    failGifGeneration,
    resetGifGeneration,
    reset,
  } = useTypingGifStore();

  const blobRef = useRef<Blob | null>(null);

  // 화질 설정에 따른 예상 파일 크기 및 시간 계산
  const qualityConfig = GIF_QUALITY_CONFIG[settings.gifQuality];
  const frameCount = Math.ceil(code.length / 3) + 10;
  const estimatedSize = estimateGifSize(settings.gifWidth, 300, frameCount, qualityConfig.quality);
  const estimatedTime = estimateGenerationTime(frameCount, qualityConfig.quality, qualityConfig.dither);

  const handleGenerateGif = async () => {
    if (!previewRef.current) return;

    const previewElement = previewRef.current.getPreviewElement();
    const codeContainerElement = previewRef.current.getCodeContainerElement();
    if (!previewElement) return;

    startGifGeneration();
    reset(); // 애니메이션 리셋

    try {
      const blob = await generateTypingGif(
        previewElement,
        code.length,
        async (index) => {
          await previewRef.current?.setCharIndexForCapture(index);
        },
        {
          width: settings.gifWidth,
          typingSpeed: settings.typingSpeed,
          onProgress: setGifProgress,
          quality: qualityConfig.quality,
          dither: qualityConfig.dither,
          workers: 4,
          codeContainerElement,
          setCaptureMinHeight: (height) => previewRef.current?.setCaptureMinHeight(height),
        }
      );

      blobRef.current = blob;
      const url = URL.createObjectURL(blob);
      completeGifGeneration(url);
      toast.success(t('generateSuccess'));
    } catch (error) {
      console.error('GIF generation failed:', error);
      failGifGeneration();
      toast.error(t('generateError'));
    } finally {
      // GIF 생성 완료 후 minHeight 리셋
      previewRef.current?.setCaptureMinHeight(null);
    }
  };

  const handleDownload = () => {
    if (blobRef.current) {
      downloadGif(blobRef.current, `code-typing-${Date.now()}.gif`);
      toast.success(tCommon('downloaded'));
    }
  };

  const handleReset = () => {
    if (generatedGifUrl) {
      URL.revokeObjectURL(generatedGifUrl);
    }
    blobRef.current = null;
    resetGifGeneration();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="h-5 w-5" />
          {t('export')}
        </CardTitle>
        <CardDescription>{t('exportDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 예상 정보 */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('estimatedFrames')}</span>
            <span>{frameCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('estimatedSize')}</span>
            <span>{estimatedSize}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('dimensions')}</span>
            <span>{settings.gifWidth} x auto</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('estimatedTime')}</span>
            <span>{estimatedTime}</span>
          </div>
        </div>

        {/* 생성 상태 */}
        {gifState === 'generating' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('generating')}</span>
              <span>{gifProgress}%</span>
            </div>
            <Progress value={gifProgress} className="h-2" />
          </div>
        )}

        {/* 생성 완료 미리보기 */}
        {gifState === 'completed' && generatedGifUrl && (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <img
                src={generatedGifUrl}
                alt="Generated GIF"
                className="w-full"
              />
            </div>
            {blobRef.current && (
              <div className="text-sm text-muted-foreground text-center">
                {t('actualSize')}: {(blobRef.current.size / 1024).toFixed(1)} KB
              </div>
            )}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-2">
          {gifState === 'idle' || gifState === 'error' ? (
            <Button
              onClick={handleGenerateGif}
              disabled={code.length === 0}
              className="flex-1"
            >
              <Film className="h-4 w-4 mr-2" />
              {t('generateGif')}
            </Button>
          ) : gifState === 'generating' ? (
            <Button disabled className="flex-1">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('generating')}
            </Button>
          ) : (
            <>
              <Button onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                {t('download')}
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
