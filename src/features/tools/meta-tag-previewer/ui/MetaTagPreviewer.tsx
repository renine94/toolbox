"use client";

import { URLFetcher } from "./URLFetcher";
import { MetaTagEditor } from "./MetaTagEditor";
import { PreviewTabs } from "./PreviewTabs";
import { CodeOutput } from "./CodeOutput";

export function MetaTagPreviewer() {
  return (
    <div className="space-y-6">
      {/* URL Input */}
      <URLFetcher />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Editor */}
        <div className="space-y-6">
          <MetaTagEditor />
        </div>

        {/* Right Column: Preview & Code */}
        <div className="space-y-6">
          <PreviewTabs />
          <CodeOutput />
        </div>
      </div>
    </div>
  );
}
