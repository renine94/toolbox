'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { useDebounceValue } from '@/shared/hooks/use-debounce'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

import { textToAscii } from '../lib/figlet-utils'
import { FIGLET_FONTS, type FigletFont } from '../model/types'
import { useAsciiStore } from '../model/useAsciiStore'

export function TextToAscii() {
  const t = useTranslations('tools.asciiArtGenerator.ui')
  const tCommon = useTranslations('common')

  const { textConfig, setTextConfig, setAsciiOutput, setIsLoading, isLoading } =
    useAsciiStore()

  const { text, font } = textConfig

  // 500ms 디바운싱된 텍스트 값
  const debouncedText = useDebounceValue(text, 500)

  // 폰트 변경 시 디바운싱을 스킵하기 위한 ref
  const skipDebounceRef = useRef(false)

  // ASCII 변환 함수
  const convertToAscii = useCallback(
    async (inputText: string, inputFont: FigletFont) => {
      if (!inputText.trim()) {
        setAsciiOutput('')
        return
      }

      setIsLoading(true)
      try {
        const result = await textToAscii(inputText, inputFont)
        setAsciiOutput(result)
      } catch {
        toast.error(tCommon('toast.error'))
      } finally {
        setIsLoading(false)
      }
    },
    [setAsciiOutput, setIsLoading, tCommon]
  )

  // 디바운싱된 텍스트가 변경될 때 자동 변환
  useEffect(() => {
    // 폰트 변경으로 인한 즉시 변환 후에는 스킵
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false
      return
    }

    convertToAscii(debouncedText, font)
  }, [debouncedText, font, convertToAscii])

  // 폰트 변경 시 즉시 변환 (디바운싱 무시)
  const handleFontChange = useCallback(
    (newFont: FigletFont) => {
      setTextConfig({ font: newFont })

      if (text.trim()) {
        skipDebounceRef.current = true
        convertToAscii(text, newFont)
      }
    },
    [text, setTextConfig, convertToAscii]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">{t('textInput')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-input">{t('text')}</Label>
          <Input
            id="text-input"
            placeholder={t('textPlaceholder')}
            value={text}
            onChange={(e) => setTextConfig({ text: e.target.value })}
          />
          {isLoading && (
            <p className="text-xs text-muted-foreground">{t('converting')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t('font')}</Label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {FIGLET_FONTS.map((f) => (
              <Button
                key={f}
                variant={font === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFontChange(f)}
                className="text-xs"
                disabled={isLoading}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
