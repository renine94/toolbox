'use client'

import { useRef } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import { useWordCounterStore } from '../model/useWordCounterStore'

export function TextInput() {
  const { text, setText, clear } = useWordCounterStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.txt')) {
      toast.error('.txt 파일만 업로드할 수 있습니다')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setText(content)
      toast.success(`${file.name} 파일을 불러왔습니다`)
    }
    reader.onerror = () => {
      toast.error('파일을 읽는 중 오류가 발생했습니다')
    }
    reader.readAsText(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClear = () => {
    clear()
    toast.success('텍스트가 초기화되었습니다')
  }

  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-base font-medium">텍스트 입력</Label>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-1" />
            파일
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={!text}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            초기화
          </Button>
        </div>
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="텍스트를 입력하거나 .txt 파일을 업로드하세요..."
        className="flex-1 min-h-[300px] resize-none"
      />
    </Card>
  )
}
