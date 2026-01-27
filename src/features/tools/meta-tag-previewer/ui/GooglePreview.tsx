"use client";

import { useMetaStore } from "../model/useMetaStore";
import { extractDomain, truncateText, checkCharacterLimit } from "../lib/meta-utils";
import { cn } from "@/shared/lib/utils";

export function GooglePreview() {
  const { metaTags, url } = useMetaStore();

  const title = metaTags.title || "Page Title";
  const description = metaTags.description || "Page description will appear here...";
  const displayUrl = metaTags.ogUrl || url || "example.com";
  const favicon = metaTags.favicon;

  const domain = extractDomain(displayUrl);
  const truncatedTitle = truncateText(title, 60);
  const truncatedDescription = truncateText(description, 160);

  const titleLimit = checkCharacterLimit(title, "google", "title");
  const descLimit = checkCharacterLimit(description, "google", "description");

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border">
      {/* Google Search Result Preview */}
      <div className="max-w-[600px]">
        {/* URL Row */}
        <div className="flex items-center gap-2 mb-1">
          {favicon ? (
            <img
              src={favicon}
              alt=""
              className="w-7 h-7 rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {domain.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {domain}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500 truncate max-w-[400px]">
              {displayUrl}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "text-xl leading-tight mb-1 cursor-pointer hover:underline",
            "text-[#1a0dab] dark:text-[#8ab4f8]",
            titleLimit.isOver && "text-destructive"
          )}
        >
          {truncatedTitle}
        </h3>

        {/* Description */}
        <p
          className={cn(
            "text-sm leading-snug",
            "text-gray-600 dark:text-gray-400",
            descLimit.isOver && "text-destructive"
          )}
        >
          {truncatedDescription}
        </p>
      </div>

      {/* Character count info */}
      <div className="mt-4 pt-4 border-t text-xs text-muted-foreground space-y-1">
        <div className="flex justify-between">
          <span>Title:</span>
          <span className={cn(titleLimit.isOver && "text-destructive")}>
            {titleLimit.count}/{titleLimit.limit} characters
          </span>
        </div>
        <div className="flex justify-between">
          <span>Description:</span>
          <span className={cn(descLimit.isOver && "text-destructive")}>
            {descLimit.count}/{descLimit.limit} characters
          </span>
        </div>
      </div>
    </div>
  );
}
