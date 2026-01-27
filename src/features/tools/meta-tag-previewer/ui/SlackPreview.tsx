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

export function SlackPreview() {
  const { metaTags, url } = useMetaStore();

  const ogImage = metaTags.ogImage;
  const title = getDisplayTitle(metaTags) || "Page Title";
  const description = getDisplayDescription(metaTags) || "Page description will appear here...";
  const displayUrl = metaTags.ogUrl || url || "example.com";
  const siteName = metaTags.siteName;
  const favicon = metaTags.favicon;

  const domain = extractDomain(displayUrl);
  const truncatedTitle = truncateText(title, 60);
  const truncatedDescription = truncateText(description, 150);

  const titleLimit = checkCharacterLimit(title, "slack", "title");
  const descLimit = checkCharacterLimit(description, "slack", "description");

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border max-w-[560px]">
      {/* Slack Unfurl Preview */}
      <div className="flex">
        {/* Left border accent */}
        <div className="w-1 bg-gray-400 dark:bg-gray-600 rounded-full mr-3 flex-shrink-0" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Site info */}
          <div className="flex items-center gap-2 mb-2">
            {favicon ? (
              <img
                src={favicon}
                alt=""
                className="w-4 h-4"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-4 h-4 rounded bg-gray-200 dark:bg-zinc-700" />
            )}
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {siteName || domain}
            </span>
          </div>

          {/* Title */}
          <a
            href="#"
            className={cn(
              "block text-[#1264A3] dark:text-[#4A9FE8] hover:underline font-bold text-base mb-1",
              titleLimit.isOver && "text-destructive"
            )}
          >
            {truncatedTitle}
          </a>

          {/* Description */}
          <p
            className={cn(
              "text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-2",
              descLimit.isOver && "text-destructive"
            )}
          >
            {truncatedDescription}
          </p>

          {/* Image */}
          {ogImage && (
            <div className="mt-2 rounded overflow-hidden max-w-[360px]">
              <img
                src={ogImage}
                alt=""
                className="max-h-[200px] w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
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
