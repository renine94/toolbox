import { z } from "zod";

// 이미지 크기
export const imageSizeSchema = z.object({
  width: z.number().min(1).max(20000),
  height: z.number().min(1).max(20000),
});
export type ImageSize = z.infer<typeof imageSizeSchema>;

// SNS 플랫폼
export const platforms = [
  "instagram",
  "facebook",
  "twitter",
  "linkedin",
  "youtube",
  "tiktok",
  "pinterest",
  "snapchat",
] as const;
export type Platform = (typeof platforms)[number];

// 프리셋 ID
export type PresetId = string;

// 플랫폼 프리셋
export interface PlatformPreset {
  id: PresetId;
  platform: Platform;
  name: string;
  nameKey: string;
  width: number;
  height: number;
  aspectRatio: string;
}

// 플랫폼별 프리셋 목록
export const PLATFORM_PRESETS: PlatformPreset[] = [
  // Instagram
  {
    id: "instagram-post",
    platform: "instagram",
    name: "Post",
    nameKey: "instagramPost",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  {
    id: "instagram-story",
    platform: "instagram",
    name: "Story",
    nameKey: "instagramStory",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
  },
  {
    id: "instagram-reels",
    platform: "instagram",
    name: "Reels",
    nameKey: "instagramReels",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
  },
  {
    id: "instagram-landscape",
    platform: "instagram",
    name: "Landscape",
    nameKey: "instagramLandscape",
    width: 1080,
    height: 566,
    aspectRatio: "1.91:1",
  },
  {
    id: "instagram-portrait",
    platform: "instagram",
    name: "Portrait",
    nameKey: "instagramPortrait",
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
  },

  // Facebook
  {
    id: "facebook-post",
    platform: "facebook",
    name: "Post",
    nameKey: "facebookPost",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
  },
  {
    id: "facebook-cover",
    platform: "facebook",
    name: "Cover",
    nameKey: "facebookCover",
    width: 820,
    height: 312,
    aspectRatio: "2.63:1",
  },
  {
    id: "facebook-story",
    platform: "facebook",
    name: "Story",
    nameKey: "facebookStory",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
  },
  {
    id: "facebook-profile",
    platform: "facebook",
    name: "Profile",
    nameKey: "facebookProfile",
    width: 180,
    height: 180,
    aspectRatio: "1:1",
  },
  {
    id: "facebook-event",
    platform: "facebook",
    name: "Event",
    nameKey: "facebookEvent",
    width: 1920,
    height: 1005,
    aspectRatio: "1.91:1",
  },

  // Twitter (X)
  {
    id: "twitter-post",
    platform: "twitter",
    name: "Post",
    nameKey: "twitterPost",
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
  },
  {
    id: "twitter-header",
    platform: "twitter",
    name: "Header",
    nameKey: "twitterHeader",
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
  },
  {
    id: "twitter-profile",
    platform: "twitter",
    name: "Profile",
    nameKey: "twitterProfile",
    width: 400,
    height: 400,
    aspectRatio: "1:1",
  },

  // LinkedIn
  {
    id: "linkedin-post",
    platform: "linkedin",
    name: "Post",
    nameKey: "linkedinPost",
    width: 1200,
    height: 627,
    aspectRatio: "1.91:1",
  },
  {
    id: "linkedin-cover",
    platform: "linkedin",
    name: "Cover",
    nameKey: "linkedinCover",
    width: 1584,
    height: 396,
    aspectRatio: "4:1",
  },
  {
    id: "linkedin-profile",
    platform: "linkedin",
    name: "Profile",
    nameKey: "linkedinProfile",
    width: 400,
    height: 400,
    aspectRatio: "1:1",
  },
  {
    id: "linkedin-company-cover",
    platform: "linkedin",
    name: "Company Cover",
    nameKey: "linkedinCompanyCover",
    width: 1128,
    height: 191,
    aspectRatio: "5.9:1",
  },

  // YouTube
  {
    id: "youtube-thumbnail",
    platform: "youtube",
    name: "Thumbnail",
    nameKey: "youtubeThumbnail",
    width: 1280,
    height: 720,
    aspectRatio: "16:9",
  },
  {
    id: "youtube-banner",
    platform: "youtube",
    name: "Banner",
    nameKey: "youtubeBanner",
    width: 2560,
    height: 1440,
    aspectRatio: "16:9",
  },
  {
    id: "youtube-profile",
    platform: "youtube",
    name: "Profile",
    nameKey: "youtubeProfile",
    width: 800,
    height: 800,
    aspectRatio: "1:1",
  },

  // TikTok
  {
    id: "tiktok-video",
    platform: "tiktok",
    name: "Video",
    nameKey: "tiktokVideo",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
  },
  {
    id: "tiktok-profile",
    platform: "tiktok",
    name: "Profile",
    nameKey: "tiktokProfile",
    width: 200,
    height: 200,
    aspectRatio: "1:1",
  },

  // Pinterest
  {
    id: "pinterest-pin",
    platform: "pinterest",
    name: "Pin",
    nameKey: "pinterestPin",
    width: 1000,
    height: 1500,
    aspectRatio: "2:3",
  },
  {
    id: "pinterest-profile",
    platform: "pinterest",
    name: "Profile",
    nameKey: "pinterestProfile",
    width: 165,
    height: 165,
    aspectRatio: "1:1",
  },

  // Snapchat
  {
    id: "snapchat-story",
    platform: "snapchat",
    name: "Story",
    nameKey: "snapchatStory",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
  },
];

// 플랫폼 정보
export const PLATFORM_INFO: Record<
  Platform,
  { name: string; nameKey: string; color: string; icon: string }
> = {
  instagram: {
    name: "Instagram",
    nameKey: "instagram",
    color: "#E4405F",
    icon: "instagram",
  },
  facebook: {
    name: "Facebook",
    nameKey: "facebook",
    color: "#1877F2",
    icon: "facebook",
  },
  twitter: {
    name: "Twitter / X",
    nameKey: "twitter",
    color: "#000000",
    icon: "twitter",
  },
  linkedin: {
    name: "LinkedIn",
    nameKey: "linkedin",
    color: "#0A66C2",
    icon: "linkedin",
  },
  youtube: {
    name: "YouTube",
    nameKey: "youtube",
    color: "#FF0000",
    icon: "youtube",
  },
  tiktok: {
    name: "TikTok",
    nameKey: "tiktok",
    color: "#000000",
    icon: "music",
  },
  pinterest: {
    name: "Pinterest",
    nameKey: "pinterest",
    color: "#E60023",
    icon: "pin",
  },
  snapchat: {
    name: "Snapchat",
    nameKey: "snapchat",
    color: "#FFFC00",
    icon: "ghost",
  },
};

// 이미지 상태
export const imageStatuses = [
  "pending",
  "resizing",
  "completed",
  "error",
] as const;
export type ImageStatus = (typeof imageStatuses)[number];

// 리사이즈된 이미지
export interface ResizedImage {
  presetId: PresetId;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
  status: ImageStatus;
  error?: string;
}

// 업로드된 원본 이미지
export interface UploadedImage {
  id: string;
  file: File;
  name: string;
  size: number;
  dimensions: ImageSize;
  dataUrl: string;
}

// 선택된 프리셋
export type SelectedPresets = Set<PresetId>;

// 이미지 추가 에러 타입
export type ImageAddErrorType =
  | "fileTooLarge"
  | "unsupportedFormat"
  | "dimensionTooLarge"
  | "loadError";

// 이미지 추가 실패 정보
export interface ImageAddFailure {
  fileName: string;
  error: ImageAddErrorType;
}

// 이미지 추가 결과
export interface AddImageResult {
  success: boolean;
  failure?: ImageAddFailure;
}

// 리사이즈 결과
export interface ResizeResult {
  presetId: PresetId;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
}

// 스토어 상태 인터페이스
export interface ResizerState {
  // 원본 이미지
  originalImage: UploadedImage | null;

  // 선택된 프리셋
  selectedPresets: SelectedPresets;

  // 리사이즈된 이미지들
  resizedImages: Map<PresetId, ResizedImage>;

  // 처리 상태
  isResizing: boolean;
  currentPresetIndex: number;
  totalPresets: number;

  // 액션
  setImage: (file: File) => Promise<AddImageResult>;
  clearImage: () => void;
  togglePreset: (presetId: PresetId) => void;
  selectAllPresets: () => void;
  deselectAllPresets: () => void;
  selectPlatformPresets: (platform: Platform) => void;
  resizeAll: () => Promise<void>;
  cancelResize: () => void;
  downloadSingle: (presetId: PresetId) => void;
  downloadAll: () => Promise<void>;
  reset: () => void;
}

// 파일 제한
export const FILE_LIMITS = {
  maxSizeMB: 20,
  maxSizeBytes: 20 * 1024 * 1024,
  maxDimension: 8192,
  supportedTypes: [
    "image/webp",
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/bmp",
  ] as const,
};
