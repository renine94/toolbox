'use client'

import { ImageIcon, Upload, Wand2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useRef } from 'react'
import { toast } from 'sonner'

import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Slider } from '@/shared/ui/slider'
import { Switch } from '@/shared/ui/switch'

import { fileToDataUrl, imageToAscii } from '../lib/image-to-ascii'
import type { AsciiCharSetKey } from '../model/types'
import { useAsciiStore } from '../model/useAsciiStore'

const CHAR_SETS: { value: AsciiCharSetKey; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'blocks', label: 'Blocks' },
  { value: 'simple', label: 'Simple' },
]

export function ImageToAscii() {
  const t = useTranslations('tools.asciiArtGenerator.ui')
  const tCommon = useTranslations('common')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    imageConfig,
    setImageConfig,
    setAsciiOutput,
    setIsLoading,
    isLoading,
    imageData,
    setImageData,
  } = useAsciiStore()

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error(t('invalidImageFormat'))
        return
      }

      try {
        const dataUrl = await fileToDataUrl(file)
        setImageData(dataUrl)
      } catch {
        toast.error(tCommon('toast.error'))
      }
    },
    [setImageData, t, tCommon]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleConvert = useCallback(async () => {
    if (!imageData) {
      toast.error(t('selectImage'))
      return
    }

    setIsLoading(true)
    try {
      const result = await imageToAscii(imageData, imageConfig)
      setAsciiOutput(result)
    } catch {
      toast.error(tCommon('toast.error'))
    } finally {
      setIsLoading(false)
    }
  }, [imageData, imageConfig, setAsciiOutput, setIsLoading, t, tCommon])

  const handleClearImage = () => {
    setImageData(null)
    setAsciiOutput('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">{t('imageInput')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 이미지 업로드 영역 */}
        <div
          className="relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {imageData ? (
            <>
              <img
                src={imageData}
                alt="Preview"
                className="max-h-[140px] max-w-full rounded object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClearImage()
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t('dropImage')}</p>
              <Button variant="secondary" size="sm" className="mt-2">
                <Upload className="mr-2 h-4 w-4" />
                {t('selectFile')}
              </Button>
            </>
          )}
        </div>

        {/* 설정 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t('width')}</Label>
              <span className="text-sm text-muted-foreground">
                {imageConfig.width}
              </span>
            </div>
            <Slider
              value={[imageConfig.width]}
              onValueChange={([value]) => setImageConfig({ width: value })}
              min={20}
              max={200}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('charSet')}</Label>
            <Select
              value={imageConfig.charSet}
              onValueChange={(value: AsciiCharSetKey) =>
                setImageConfig({ charSet: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHAR_SETS.map((set) => (
                  <SelectItem key={set.value} value={set.value}>
                    {set.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="invert-switch">{t('invert')}</Label>
            <Switch
              id="invert-switch"
              checked={imageConfig.invert}
              onCheckedChange={(checked) => setImageConfig({ invert: checked })}
            />
          </div>
        </div>

        <Button
          onClick={handleConvert}
          disabled={isLoading || !imageData}
          className="w-full"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {t('convert')}
        </Button>
      </CardContent>
    </Card>
  )
}
