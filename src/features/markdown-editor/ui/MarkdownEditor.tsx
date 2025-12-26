"use client";

import { useRef, useCallback } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { useMarkdownStore } from "../model/useMarkdownStore";
import { EditorPanel } from "./EditorPanel";
import { PreviewPanel } from "./PreviewPanel";
import { Toolbar } from "./Toolbar";
import { StatsBar } from "./StatsBar";
import { DocumentList } from "./DocumentList";
import { TemplateSelector } from "./TemplateSelector";
import { ExportPanel } from "./ExportPanel";
import { Input } from "@/shared/ui/input";
import { FileEdit, Eye } from "lucide-react";

type MonacoEditor = {
  getSelection: () => { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number } | null;
  getModel: () => { getOffsetAt: (position: { lineNumber: number; column: number }) => number } | null;
  executeEdits: (source: string, edits: Array<{ range: unknown; text: string }>) => void;
  setPosition: (position: { lineNumber: number; column: number }) => void;
  focus: () => void;
};

export function MarkdownEditor() {
  const { title, setTitle, content, setContent } = useMarkdownStore();
  const editorRef = useRef<MonacoEditor | null>(null);

  const handleEditorMount = useCallback((editor: unknown) => {
    editorRef.current = editor as MonacoEditor;
  }, []);

  const handleFormat = useCallback(
    (prefix: string, suffix: string) => {
      const editor = editorRef.current;
      if (!editor) {
        // Fallback: append to content
        setContent(content + prefix + suffix);
        return;
      }

      const selection = editor.getSelection();
      const model = editor.getModel();
      if (!selection || !model) return;

      const startOffset = model.getOffsetAt({
        lineNumber: selection.startLineNumber,
        column: selection.startColumn,
      });
      const endOffset = model.getOffsetAt({
        lineNumber: selection.endLineNumber,
        column: selection.endColumn,
      });

      const selectedText = content.slice(startOffset, endOffset);
      const newText = `${prefix}${selectedText}${suffix}`;

      // Use Monaco's edit API
      editor.executeEdits("toolbar", [
        {
          range: selection,
          text: newText,
        },
      ]);

      // Set cursor position after the prefix
      const newPosition = {
        lineNumber: selection.startLineNumber,
        column: selection.startColumn + prefix.length + selectedText.length,
      };
      editor.setPosition(newPosition);
      editor.focus();
    },
    [content, setContent]
  );

  return (
    <div className="space-y-6">
      {/* Title Input */}
      <div className="flex items-center gap-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="문서 제목을 입력하세요"
          className="text-xl font-semibold h-12 border-none shadow-none focus-visible:ring-0 px-0 bg-transparent"
        />
      </div>

      {/* Main Editor Area */}
      <Card className="overflow-hidden">
        <Toolbar onFormat={handleFormat} />
        <StatsBar />
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2 min-h-[500px]">
            {/* Editor Panel */}
            <div className="border-r">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b">
                <FileEdit className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  편집
                </span>
              </div>
              <div className="h-[calc(500px-41px)]">
                <EditorPanel onEditorMount={handleEditorMount} />
              </div>
            </div>

            {/* Preview Panel */}
            <div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  미리보기
                </span>
              </div>
              <div className="h-[calc(500px-41px)] overflow-auto">
                <PreviewPanel />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid md:grid-cols-3 gap-4">
        <DocumentList />
        <TemplateSelector />
        <ExportPanel />
      </div>
    </div>
  );
}
