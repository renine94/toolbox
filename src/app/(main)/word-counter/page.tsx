import { WordCounter } from '@/features/tools/word-counter'

export default function WordCounterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Word Counter</h1>
      <p className="text-muted-foreground mb-8">
        텍스트를 입력하면 단어 수, 문자 수, 줄 수 등의 통계를 실시간으로
        확인할 수 있습니다.
      </p>
      <WordCounter />
    </div>
  )
}
