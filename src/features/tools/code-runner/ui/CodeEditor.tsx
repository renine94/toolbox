"use client";

import { useCodeStore } from "../model/useCodeStore";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-muted rounded-lg">
      <div className="animate-pulse text-muted-foreground">Loading editor...</div>
    </div>
  ),
});

const languageMap = {
  javascript: "javascript",
  python: "python",
} as const;

export function CodeEditor() {
  const { code, language, setCode } = useCodeStore();
  const { resolvedTheme } = useTheme();

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Code</span>
        <span className="text-xs text-muted-foreground">
          {language === "javascript" ? "ES6+" : "Python 3.x"}
        </span>
      </div>
      <Editor
        height="400px"
        language={languageMap[language]}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}
