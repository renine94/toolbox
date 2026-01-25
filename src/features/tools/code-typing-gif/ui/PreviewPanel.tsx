'use client';

import { useEffect, useRef, useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { Play, Pause, RotateCcw, Eye } from 'lucide-react';
import { useTypingGifStore } from '../model/useTypingGifStore';
import { WindowFrame } from './WindowFrame';
import { highlightPartialCode, splitCodeIntoLines } from '../lib/code-highlighter';
import { getThemeStyles, getThemeColors } from '../lib/themes';

export interface PreviewPanelRef {
  setCharIndexForCapture: (index: number) => Promise<void>;
  getPreviewElement: () => HTMLDivElement | null;
  getCodeContainerElement: () => HTMLDivElement | null;
  setCaptureMinHeight: (height: number | null) => void;
}

export const PreviewPanel = forwardRef<PreviewPanelRef>(function PreviewPanel(_, ref) {
  const t = useTranslations('tools.codeTypingGif.ui');
  const {
    code,
    settings,
    playbackState,
    currentCharIndex,
    progress,
    play,
    pause,
    reset,
    setCurrentCharIndex,
    setPlaybackState,
  } = useTypingGifStore();

  const cursorRef = useRef<HTMLSpanElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [internalCharIndex, setInternalCharIndex] = useState(0);
  const [captureMinHeight, setCaptureMinHeight] = useState<number | null>(null);

  const colors = getThemeColors(settings.theme);

  // 외부에서 charIndex를 설정할 수 있도록 ref 노출
  useImperativeHandle(ref, () => ({
    setCharIndexForCapture: async (index: number) => {
      setInternalCharIndex(index);
      setCurrentCharIndex(index);
      // 렌더링 대기
      await new Promise((resolve) => setTimeout(resolve, 10));
    },
    getPreviewElement: () => previewRef.current,
    getCodeContainerElement: () => codeContainerRef.current,
    setCaptureMinHeight: (height: number | null) => setCaptureMinHeight(height),
  }));

  // 커서 깜빡임 애니메이션
  useEffect(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: settings.cursorBlinkSpeed / 1000 / 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      });
    }

    return () => {
      if (cursorRef.current) {
        gsap.killTweensOf(cursorRef.current);
      }
    };
  }, [settings.cursorBlinkSpeed]);

  // 타이핑 애니메이션
  const typeNextChar = useCallback(() => {
    if (playbackState !== 'playing') return;

    if (currentCharIndex < code.length) {
      const nextIndex = currentCharIndex + 1;
      setCurrentCharIndex(nextIndex);
      setInternalCharIndex(nextIndex);
      animationRef.current = setTimeout(typeNextChar, settings.typingSpeed);
    } else {
      setPlaybackState('finished');
    }
  }, [code.length, currentCharIndex, playbackState, setCurrentCharIndex, setPlaybackState, settings.typingSpeed]);

  useEffect(() => {
    if (playbackState === 'playing') {
      animationRef.current = setTimeout(typeNextChar, settings.typingSpeed);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [playbackState, typeNextChar, settings.typingSpeed]);

  // 내부 인덱스 동기화
  useEffect(() => {
    setInternalCharIndex(currentCharIndex);
  }, [currentCharIndex]);

  // 현재 표시할 코드
  const displayedCode = code.slice(0, internalCharIndex);
  const highlightedHtml = highlightPartialCode(displayedCode, displayedCode.length, settings.language);
  const lines = splitCodeIntoLines(displayedCode);

  // 커서 스타일
  const getCursorStyle = () => {
    const baseStyle = {
      backgroundColor: colors.cursor,
    };

    switch (settings.cursorStyle) {
      case 'block':
        return { ...baseStyle, width: '8px', height: '1.2em' };
      case 'line':
        return { ...baseStyle, width: '2px', height: '1.2em' };
      case 'underscore':
        return { ...baseStyle, width: '8px', height: '2px', marginTop: '1em' };
      default:
        return baseStyle;
    }
  };

  const handlePlayPause = () => {
    if (playbackState === 'playing') {
      pause();
    } else if (playbackState === 'finished') {
      reset();
      setTimeout(play, 10);
    } else {
      play();
    }
  };

  const handleReset = () => {
    reset();
    setInternalCharIndex(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          {t('preview')}
        </CardTitle>
        <CardDescription>{t('previewDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 컨트롤 버튼 */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePlayPause}
            variant={playbackState === 'playing' ? 'secondary' : 'default'}
            size="sm"
          >
            {playbackState === 'playing' ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                {t('pause')}
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                {t('play')}
              </>
            )}
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('reset')}
          </Button>
        </div>

        {/* 진행률 */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t('progress')}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* 미리보기 영역 */}
        <div
          ref={previewRef}
          style={{ width: settings.gifWidth, maxWidth: '100%' }}
          className="mx-auto"
        >
          <style dangerouslySetInnerHTML={{ __html: getThemeStyles(settings.theme) }} />
          <WindowFrame
            windowStyle={settings.windowStyle}
            theme={settings.theme}
            title={`code.${settings.language === 'typescript' ? 'ts' : settings.language === 'javascript' ? 'js' : settings.language}`}
          >
            <div
              ref={codeContainerRef}
              className="code-preview-container overflow-auto"
              style={{
                backgroundColor: colors.background,
                padding: '16px',
                minHeight: captureMinHeight ? `${captureMinHeight}px` : '200px',
                fontSize: `${settings.fontSize}px`,
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
              }}
            >
              <div className="flex">
                {/* 줄 번호 */}
                {settings.showLineNumbers && (
                  <div
                    className="code-line-number select-none pr-4 text-right"
                    style={{
                      color: colors.lineNumber,
                      minWidth: '2em',
                    }}
                  >
                    {lines.map((_, index) => (
                      <div key={index}>{index + 1}</div>
                    ))}
                    {lines.length === 0 && <div>1</div>}
                  </div>
                )}

                {/* 코드 영역 */}
                <div className="flex-1 relative">
                  <pre className="m-0 whitespace-pre-wrap break-words">
                    <code
                      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                    />
                    {/* 커서 */}
                    <span
                      ref={cursorRef}
                      className="inline-block code-cursor"
                      style={getCursorStyle()}
                    />
                  </pre>
                </div>
              </div>
            </div>
          </WindowFrame>
        </div>
      </CardContent>
    </Card>
  );
});
