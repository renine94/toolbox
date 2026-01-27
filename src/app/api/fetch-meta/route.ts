import { NextRequest, NextResponse } from "next/server";
import type { MetaTags, FetchMetaResponse } from "@/features/tools/meta-tag-previewer/model/types";
import { DEFAULT_META_TAGS } from "@/features/tools/meta-tag-previewer/model/types";

// 타임아웃 설정 (5초)
const FETCH_TIMEOUT = 5000;

/**
 * HTML에서 메타 태그 추출
 */
function extractMetaTags(html: string, url: string): MetaTags {
  const metaTags: MetaTags = { ...DEFAULT_META_TAGS };

  // title 태그 추출
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) {
    metaTags.title = decodeHtmlEntities(titleMatch[1].trim());
  }

  // meta 태그 추출 함수
  const getMetaContent = (nameOrProperty: string): string | null => {
    // name 속성
    const namePattern = new RegExp(
      `<meta[^>]*name=["']${nameOrProperty}["'][^>]*content=["']([^"']*)["'][^>]*>|` +
        `<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${nameOrProperty}["'][^>]*>`,
      "i"
    );
    const nameMatch = html.match(namePattern);
    if (nameMatch) {
      return decodeHtmlEntities((nameMatch[1] || nameMatch[2] || "").trim());
    }

    // property 속성 (Open Graph)
    const propPattern = new RegExp(
      `<meta[^>]*property=["']${nameOrProperty}["'][^>]*content=["']([^"']*)["'][^>]*>|` +
        `<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${nameOrProperty}["'][^>]*>`,
      "i"
    );
    const propMatch = html.match(propPattern);
    if (propMatch) {
      return decodeHtmlEntities((propMatch[1] || propMatch[2] || "").trim());
    }

    return null;
  };

  // 기본 메타 태그
  metaTags.description = getMetaContent("description") || "";

  // Open Graph 태그
  metaTags.ogTitle = getMetaContent("og:title") || "";
  metaTags.ogDescription = getMetaContent("og:description") || "";
  metaTags.ogImage = resolveUrl(getMetaContent("og:image") || "", url);
  metaTags.ogUrl = getMetaContent("og:url") || url;
  metaTags.ogType = getMetaContent("og:type") || "website";
  metaTags.siteName = getMetaContent("og:site_name") || "";

  // Twitter 태그
  const twitterCard = getMetaContent("twitter:card");
  if (
    twitterCard &&
    ["summary", "summary_large_image", "app", "player"].includes(twitterCard)
  ) {
    metaTags.twitterCard = twitterCard as MetaTags["twitterCard"];
  }
  metaTags.twitterTitle = getMetaContent("twitter:title") || "";
  metaTags.twitterDescription = getMetaContent("twitter:description") || "";
  metaTags.twitterImage = resolveUrl(getMetaContent("twitter:image") || "", url);

  // Favicon 추출
  const faviconPattern =
    /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["'][^>]*>|<link[^>]*href=["']([^"']*)["'][^>]*rel=["'](?:shortcut )?icon["'][^>]*>/i;
  const faviconMatch = html.match(faviconPattern);
  if (faviconMatch) {
    metaTags.favicon = resolveUrl(
      (faviconMatch[1] || faviconMatch[2] || "").trim(),
      url
    );
  } else {
    // 기본 favicon 경로 시도
    try {
      const urlObj = new URL(url);
      metaTags.favicon = `${urlObj.origin}/favicon.ico`;
    } catch {
      metaTags.favicon = "";
    }
  }

  return metaTags;
}

/**
 * HTML 엔티티 디코딩
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&#x27;": "'",
    "&#x2F;": "/",
    "&#47;": "/",
    "&nbsp;": " ",
  };

  return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
}

/**
 * 상대 URL을 절대 URL로 변환
 */
function resolveUrl(relativeUrl: string, baseUrl: string): string {
  if (!relativeUrl) return "";

  try {
    // 이미 절대 URL인 경우
    if (relativeUrl.startsWith("http://") || relativeUrl.startsWith("https://")) {
      return relativeUrl;
    }

    // 프로토콜 상대 URL인 경우
    if (relativeUrl.startsWith("//")) {
      return `https:${relativeUrl}`;
    }

    // 상대 URL인 경우
    const base = new URL(baseUrl);
    return new URL(relativeUrl, base).toString();
  } catch {
    return relativeUrl;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json<FetchMetaResponse>(
        { success: false, error: "URL is required" },
        { status: 400 }
      );
    }

    // URL 유효성 검사
    let validUrl: URL;
    try {
      validUrl = new URL(url);
      if (!["http:", "https:"].includes(validUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json<FetchMetaResponse>(
        { success: false, error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // 타임아웃과 함께 페이지 fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    try {
      const response = await fetch(validUrl.toString(), {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; MetaTagPreviewer/1.0; +https://toolbox.vercel.app)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
        },
        redirect: "follow",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json<FetchMetaResponse>(
          { success: false, error: `Failed to fetch URL: ${response.status}` },
          { status: 400 }
        );
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
        return NextResponse.json<FetchMetaResponse>(
          { success: false, error: "URL does not return HTML content" },
          { status: 400 }
        );
      }

      const html = await response.text();
      const metaTags = extractMetaTags(html, validUrl.toString());

      return NextResponse.json<FetchMetaResponse>({
        success: true,
        data: metaTags,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          return NextResponse.json<FetchMetaResponse>(
            { success: false, error: "Request timed out" },
            { status: 408 }
          );
        }
      }

      return NextResponse.json<FetchMetaResponse>(
        { success: false, error: "Failed to fetch URL" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Meta fetch error:", error);
    return NextResponse.json<FetchMetaResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
