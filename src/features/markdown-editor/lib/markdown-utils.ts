import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import hljs from "highlight.js";

// Configure marked with highlight.js
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Custom renderer for code highlighting
const renderer = new marked.Renderer();
renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
  if (lang && hljs.getLanguage(lang)) {
    const highlighted = hljs.highlight(text, { language: lang }).value;
    return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
  }
  const highlighted = hljs.highlightAuto(text).value;
  return `<pre><code class="hljs">${highlighted}</code></pre>`;
};

marked.use({ renderer });

export function markdownToHtml(markdown: string): string {
  const rawHtml = marked.parse(markdown) as string;
  return DOMPurify.sanitize(rawHtml);
}

export function insertFormatting(
  content: string,
  selectionStart: number,
  selectionEnd: number,
  prefix: string,
  suffix: string
): { newContent: string; newCursorPos: number } {
  const selectedText = content.slice(selectionStart, selectionEnd);
  const newText = `${prefix}${selectedText}${suffix}`;
  const newContent =
    content.slice(0, selectionStart) + newText + content.slice(selectionEnd);

  return {
    newContent,
    newCursorPos: selectionStart + prefix.length + selectedText.length,
  };
}

export const formatActions = {
  bold: { prefix: "**", suffix: "**", label: "굵게" },
  italic: { prefix: "*", suffix: "*", label: "기울임" },
  strikethrough: { prefix: "~~", suffix: "~~", label: "취소선" },
  h1: { prefix: "# ", suffix: "", label: "제목 1" },
  h2: { prefix: "## ", suffix: "", label: "제목 2" },
  h3: { prefix: "### ", suffix: "", label: "제목 3" },
  link: { prefix: "[", suffix: "](url)", label: "링크" },
  image: { prefix: "![alt](", suffix: ")", label: "이미지" },
  code: { prefix: "`", suffix: "`", label: "인라인 코드" },
  codeBlock: { prefix: "```\n", suffix: "\n```", label: "코드 블록" },
  quote: { prefix: "> ", suffix: "", label: "인용" },
  ul: { prefix: "- ", suffix: "", label: "순서 없는 목록" },
  ol: { prefix: "1. ", suffix: "", label: "순서 있는 목록" },
  hr: { prefix: "\n---\n", suffix: "", label: "구분선" },
  table: {
    prefix: "\n| 제목1 | 제목2 | 제목3 |\n|-------|-------|-------|\n| 내용1 | 내용2 | 내용3 |\n",
    suffix: "",
    label: "표",
  },
  checkbox: { prefix: "- [ ] ", suffix: "", label: "체크박스" },
} as const;

export type FormatAction = keyof typeof formatActions;
