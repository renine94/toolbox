"use client";

import { LanguageSelector } from "./LanguageSelector";
import { CodeEditor } from "./CodeEditor";
import { CodeOutput } from "./CodeOutput";
import { ControlPanel } from "./ControlPanel";

export function CodeRunner() {
  return (
    <div className="space-y-6">
      {/* Header with Language Selector and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <LanguageSelector />
        <ControlPanel />
      </div>

      {/* Editor and Output */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeEditor />
        <CodeOutput />
      </div>

      {/* Info Section */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <h3 className="font-medium text-foreground mb-2">Tips</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>JavaScript: Use console.log() to output values</li>
          <li>Python: Use print() to output values</li>
          <li>Execution timeout: JavaScript (5s), Python (10s)</li>
          <li>Python runtime loads on first execution (may take a few seconds)</li>
        </ul>
      </div>
    </div>
  );
}
