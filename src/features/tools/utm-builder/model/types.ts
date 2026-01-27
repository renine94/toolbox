import { z } from "zod";

// UTM 파라미터 스키마
export const utmParamsSchema = z.object({
  utm_source: z.string().min(1, "Source is required"),
  utm_medium: z.string().min(1, "Medium is required"),
  utm_campaign: z.string().min(1, "Campaign is required"),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
});

export type UTMParams = z.infer<typeof utmParamsSchema>;

// 기본 URL 스키마
export const baseUrlSchema = z.string().url("Please enter a valid URL");

// UTM 프리셋 타입
export interface UTMPreset {
  id: string;
  name: string;
  params: UTMParams;
  createdAt: string;
}

// 히스토리 아이템 타입
export interface UTMHistoryItem {
  id: string;
  baseUrl: string;
  params: UTMParams;
  generatedUrl: string;
  createdAt: string;
}

// 기본 프리셋들
export const DEFAULT_PRESETS: Omit<UTMPreset, "id" | "createdAt">[] = [
  {
    name: "Google Ads",
    params: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
    },
  },
  {
    name: "Facebook Ads",
    params: {
      utm_source: "facebook",
      utm_medium: "paid_social",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
    },
  },
  {
    name: "Instagram",
    params: {
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
    },
  },
  {
    name: "Twitter/X",
    params: {
      utm_source: "twitter",
      utm_medium: "social",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
    },
  },
  {
    name: "Email Newsletter",
    params: {
      utm_source: "newsletter",
      utm_medium: "email",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
    },
  },
  {
    name: "LinkedIn",
    params: {
      utm_source: "linkedin",
      utm_medium: "social",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
    },
  },
  {
    name: "YouTube",
    params: {
      utm_source: "youtube",
      utm_medium: "video",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
    },
  },
  {
    name: "Naver Blog",
    params: {
      utm_source: "naver",
      utm_medium: "blog",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
    },
  },
];

// UTM 파라미터 필드 정보
export const UTM_FIELD_INFO = {
  utm_source: {
    label: "Source",
    description: "Where the traffic is coming from",
    placeholder: "google, facebook, newsletter",
    required: true,
    examples: ["google", "facebook", "instagram", "naver", "newsletter"],
  },
  utm_medium: {
    label: "Medium",
    description: "The marketing medium",
    placeholder: "cpc, social, email, banner",
    required: true,
    examples: ["cpc", "social", "email", "banner", "organic"],
  },
  utm_campaign: {
    label: "Campaign",
    description: "The campaign name",
    placeholder: "spring_sale, product_launch",
    required: true,
    examples: ["spring_sale", "black_friday", "product_launch"],
  },
  utm_term: {
    label: "Term",
    description: "Paid search keywords",
    placeholder: "running+shoes, best+deals",
    required: false,
    examples: ["running+shoes", "marketing+tools", "seo+software"],
  },
  utm_content: {
    label: "Content",
    description: "Distinguish similar content or links",
    placeholder: "logolink, textlink, banner_v1",
    required: false,
    examples: ["logolink", "textlink", "banner_v1", "cta_button"],
  },
} as const;
