"use client";

import { useMetaStore } from "../model/useMetaStore";
import {
  extractDomain,
  truncateText,
  getDisplayTitle,
  getDisplayDescription,
  checkCharacterLimit,
} from "../lib/meta-utils";
import { cn } from "@/shared/lib/utils";

export function LinkedInPreview() {
  const { metaTags, url } = useMetaStore();

  const ogImage = metaTags.ogImage;
  const title = getDisplayTitle(metaTags) || "Page Title";
  const description = getDisplayDescription(metaTags) || "Page description will appear here...";
  const displayUrl = metaTags.ogUrl || url || "example.com";

  const domain = extractDomain(displayUrl);
  const truncatedTitle = truncateText(title, 70);

  const titleLimit = checkCharacterLimit(title, "linkedin", "title");
  const descLimit = checkCharacterLimit(description, "linkedin", "description");

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border overflow-hidden max-w-[552px]">
      {/* Image */}
      <div className="aspect-[1.91/1] bg-gray-200 dark:bg-zinc-800 relative">
        {ogImage ? (
          <img
            src={ogImage}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 border-t border-gray-200 dark:border-zinc-700">
        <h3
          className={cn(
            "font-semibold text-sm leading-tight mb-1",
            "text-gray-900 dark:text-gray-100",
            titleLimit.isOver && "text-destructive"
          )}
        >
          {truncatedTitle}
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {domain}
        </div>
      </div>

      {/* Character count info */}
      <div className="p-3 border-t text-xs text-muted-foreground space-y-1">
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
        <p className="text-xs text-muted-foreground mt-2">
          Note: LinkedIn primarily shows title only in feed
        </p>
      </div>
    </div>
  );
}
