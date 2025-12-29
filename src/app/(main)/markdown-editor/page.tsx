import { Metadata } from "next";
import { MarkdownEditor } from "@/features/tools/markdown-editor";

export const metadata: Metadata = {
  title: "Markdown Editor | DevTools",
  description:
    "마크다운 문서를 작성하고 실시간으로 미리보기합니다. 문서 저장, 템플릿, MD/HTML/PDF 내보내기를 지원합니다.",
  keywords: [
    "markdown",
    "editor",
    "마크다운",
    "에디터",
    "문서 작성",
    "실시간 미리보기",
    "PDF 내보내기",
  ],
};

export default function MarkdownEditorPage() {
  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Markdown Editor
        </h1>
        <p className="text-muted-foreground">
          마크다운 문서를 작성하고 실시간으로 미리보기합니다. 문서 저장, 템플릿,
          다양한 형식으로 내보내기를 지원합니다.
        </p>
      </div>
      <MarkdownEditor />
    </div>
  );
}
