"use client";

import { useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useMarkdownStore } from "../model/useMarkdownStore";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-muted">
      <div className="animate-pulse text-muted-foreground">
        에디터 로딩 중...
      </div>
    </div>
  ),
});

interface EditorPanelProps {
  onEditorMount?: (editor: unknown) => void;
}

export function EditorPanel({ onEditorMount }: EditorPanelProps) {
  const { content, setContent, isAutoSaveEnabled, saveDocument } =
    useMarkdownStore();
  const { resolvedTheme } = useTheme();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced auto-save
  const handleChange = useCallback(
    (value: string | undefined) => {
      setContent(value || "");

      if (isAutoSaveEnabled) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          saveDocument();
        }, 1500);
      }
    },
    [setContent, isAutoSaveEnabled, saveDocument]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language="markdown"
        value={content}
        onChange={handleChange}
        onMount={onEditorMount}
        theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          quickSuggestions: false,
          tabSize: 2,
          renderWhitespace: "none",
          folding: true,
          lineHeight: 1.6,
        }}
      />
    </div>
  );
}
