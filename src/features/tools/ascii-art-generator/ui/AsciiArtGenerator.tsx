'use client'

import { ImageIcon, Type } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import type { AsciiTab } from '../model/types'
import { useAsciiStore } from '../model/useAsciiStore'
import { AsciiPreview } from './AsciiPreview'
import { ImageToAscii } from './ImageToAscii'
import { TextToAscii } from './TextToAscii'

export function AsciiArtGenerator() {
  const t = useTranslations('tools.asciiArtGenerator.ui')
  const { activeTab, setActiveTab, asciiOutput, isLoading } = useAsciiStore()

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as AsciiTab)}
      >
        <TabsList className="grid w-full grid-cols-2 h-14">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            {t('textTab')}
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            {t('imageTab')}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <TabsContent value="text" className="m-0">
              <TextToAscii />
            </TabsContent>
            <TabsContent value="image" className="m-0">
              <ImageToAscii />
            </TabsContent>
          </div>

          <AsciiPreview output={asciiOutput} isLoading={isLoading} />
        </div>
      </Tabs>
    </div>
  )
}
