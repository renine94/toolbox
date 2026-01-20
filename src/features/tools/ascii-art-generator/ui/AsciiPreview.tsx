'use client'

import { Copy, Download, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

interface AsciiPreviewProps {
  output: string
  isLoading: boolean
}

export function AsciiPreview({ output, isLoading }: AsciiPreviewProps) {
  const t = useTranslations('tools.asciiArtGenerator.ui')
  const tCommon = useTranslations('common')

  const handleCopy = async () => {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      toast.success(tCommon('toast.copied'))
    } catch {
      toast.error(tCommon('toast.error'))
    }
  }

  const handleDownload = () => {
    if (!output) return

    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ascii-art.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(tCommon('toast.downloaded'))
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{t('preview')}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!output || isLoading}
          >
            <Copy className="mr-1 h-4 w-4" />
            {tCommon('buttons.copy')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!output || isLoading}
          >
            <Download className="mr-1 h-4 w-4" />
            {tCommon('buttons.download')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative min-h-[300px] rounded-lg bg-muted p-4 font-mono text-xs leading-none">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : output ? (
            <pre className="overflow-auto whitespace-pre">{output}</pre>
          ) : (
            <p className="text-muted-foreground">{t('emptyPreview')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
