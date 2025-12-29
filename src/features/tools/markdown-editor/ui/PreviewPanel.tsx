"use client";

import { useMemo } from "react";
import { useMarkdownStore } from "../model/useMarkdownStore";
import { markdownToHtml } from "../lib/markdown-utils";
import "highlight.js/styles/github-dark.css";

export function PreviewPanel() {
  const { content } = useMarkdownStore();

  const html = useMemo(() => markdownToHtml(content), [content]);

  return (
    <div className="h-full overflow-auto p-6 bg-background">
      <div
        className="prose prose-sm dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-2xl prose-h1:border-b prose-h1:pb-2
          prose-h2:text-xl
          prose-h3:text-lg
          prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg
          prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic
          prose-table:border prose-th:bg-muted prose-th:p-2 prose-td:p-2 prose-td:border
          prose-img:rounded-lg prose-img:shadow-md
          prose-hr:border-border"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
