"use client";

import { useMetaStore } from "../model/useMetaStore";
import {
  extractDomain,
  truncateText,
  getTwitterTitle,
  getTwitterDescription,
  getTwitterImage,
  checkCharacterLimit,
} from "../lib/meta-utils";
import { cn } from "@/shared/lib/utils";

export function TwitterPreview() {
  const { metaTags, url } = useMetaStore();

  const image = getTwitterImage(metaTags);
  const title = getTwitterTitle(metaTags) || "Page Title";
  const description = getTwitterDescription(metaTags) || "Page description will appear here...";
  const displayUrl = metaTags.ogUrl || url || "example.com";
  const cardType = metaTags.twitterCard;

  const domain = extractDomain(displayUrl);
  const truncatedTitle = truncateText(title, 70);
  const truncatedDescription = truncateText(description, 200);

  const titleLimit = checkCharacterLimit(title, "twitter", "title");
  const descLimit = checkCharacterLimit(description, "twitter", "description");

  const isLargeImage = cardType === "summary_large_image";

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border overflow-hidden max-w-[504px]">
      {isLargeImage ? (
        // Summary Large Image Card
        <>
          {/* Image */}
          <div className="aspect-[2/1] bg-gray-200 dark:bg-zinc-800 relative">
            {image ? (
              <img
                src={image}
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
          <div className="p-3">
            <h3
              className={cn(
                "font-normal text-[15px] leading-tight mb-1",
                "text-gray-900 dark:text-gray-100",
                titleLimit.isOver && "text-destructive"
              )}
            >
              {truncatedTitle}
            </h3>
            <p
              className={cn(
                "text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-1",
                descLimit.isOver && "text-destructive"
              )}
            >
              {truncatedDescription}
            </p>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-sm">{domain}</span>
            </div>
          </div>
        </>
      ) : (
        // Summary Card (small image)
        <div className="flex">
          {/* Image */}
          <div className="w-[125px] h-[125px] flex-shrink-0 bg-gray-200 dark:bg-zinc-800 relative">
            {image ? (
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600">
                <svg
                  className="w-10 h-10"
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
          <div className="p-3 flex flex-col justify-center min-w-0">
            <h3
              className={cn(
                "font-normal text-[15px] leading-tight mb-1 truncate",
                "text-gray-900 dark:text-gray-100",
                titleLimit.isOver && "text-destructive"
              )}
            >
              {truncatedTitle}
            </h3>
            <p
              className={cn(
                "text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-1",
                descLimit.isOver && "text-destructive"
              )}
            >
              {truncatedDescription}
            </p>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-sm truncate">{domain}</span>
            </div>
          </div>
        </div>
      )}

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
        <div className="flex justify-between">
          <span>Card Type:</span>
          <span className="text-muted-foreground">{cardType}</span>
        </div>
      </div>
    </div>
  );
}
