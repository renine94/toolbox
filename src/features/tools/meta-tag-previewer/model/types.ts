import { z } from "zod";

// Meta Tags 스키마
export const metaTagsSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
  ogTitle: z.string().default(""),
  ogDescription: z.string().default(""),
  ogImage: z.string().default(""),
  ogUrl: z.string().default(""),
  ogType: z.string().default("website"),
  twitterCard: z.enum(["summary", "summary_large_image", "app", "player"]).default("summary_large_image"),
  twitterTitle: z.string().default(""),
  twitterDescription: z.string().default(""),
  twitterImage: z.string().default(""),
  siteName: z.string().default(""),
  favicon: z.string().default(""),
});

export type MetaTags = z.infer<typeof metaTagsSchema>;

// 플랫폼별 글자 수 제한
export const CHARACTER_LIMITS = {
  google: {
    title: 60,
    description: 160,
  },
  facebook: {
    title: 60,
    description: 65,
  },
  twitter: {
    title: 70,
    description: 200,
  },
  linkedin: {
    title: 70,
    description: 150,
  },
  slack: {
    title: 60,
    description: 150,
  },
} as const;

export type Platform = keyof typeof CHARACTER_LIMITS;

// 기본 Meta Tags
export const DEFAULT_META_TAGS: MetaTags = {
  title: "",
  description: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogUrl: "",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  siteName: "",
  favicon: "",
};

// API 응답 타입
export interface FetchMetaResponse {
  success: boolean;
  data?: MetaTags;
  error?: string;
}

// 미리보기 탭 타입
export type PreviewTab = "google" | "facebook" | "twitter" | "linkedin" | "slack";

export const PREVIEW_TABS: { value: PreviewTab; label: string }[] = [
  { value: "google", label: "Google" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "slack", label: "Slack" },
];
