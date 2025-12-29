import { z } from "zod";

// QR 입력 타입
export type QRInputType = "text" | "url" | "wifi" | "vcard";

// QR 에러 교정 레벨
export type QRErrorLevel = "L" | "M" | "Q" | "H";

// WiFi 암호화 방식
export type WiFiEncryption = "WPA" | "WEP" | "nopass";

// WiFi 설정 스키마
export const wifiConfigSchema = z.object({
  ssid: z.string().min(1, "SSID를 입력하세요"),
  password: z.string(),
  encryption: z.enum(["WPA", "WEP", "nopass"]),
  hidden: z.boolean(),
});

export type WiFiConfig = z.infer<typeof wifiConfigSchema>;

// vCard 설정 스키마
export const vcardConfigSchema = z.object({
  firstName: z.string().min(1, "이름을 입력하세요"),
  lastName: z.string(),
  phone: z.string(),
  email: z.string().email("유효한 이메일을 입력하세요").or(z.literal("")),
  organization: z.string(),
  title: z.string(),
  url: z.string().url("유효한 URL을 입력하세요").or(z.literal("")),
});

export type VCardConfig = z.infer<typeof vcardConfigSchema>;

// QR 코드 설정
export interface QRConfig {
  value: string;
  inputType: QRInputType;
  size: number;
  errorLevel: QRErrorLevel;
  fgColor: string;
  bgColor: string;
  includeMargin: boolean;
}

// 저장된 QR 코드
export interface SavedQRCode {
  id: string;
  name: string;
  config: QRConfig;
  wifiConfig?: WiFiConfig;
  vcardConfig?: VCardConfig;
  createdAt: string;
}

// 기본 설정값
export const DEFAULT_QR_CONFIG: QRConfig = {
  value: "",
  inputType: "text",
  size: 256,
  errorLevel: "M",
  fgColor: "#000000",
  bgColor: "#FFFFFF",
  includeMargin: true,
};

export const DEFAULT_WIFI_CONFIG: WiFiConfig = {
  ssid: "",
  password: "",
  encryption: "WPA",
  hidden: false,
};

export const DEFAULT_VCARD_CONFIG: VCardConfig = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  organization: "",
  title: "",
  url: "",
};

// 입력 타입 옵션
export const INPUT_TYPE_OPTIONS: { value: QRInputType; label: string }[] = [
  { value: "text", label: "텍스트" },
  { value: "url", label: "URL" },
  { value: "wifi", label: "WiFi" },
  { value: "vcard", label: "연락처 (vCard)" },
];

// 에러 교정 레벨 옵션
export const ERROR_LEVEL_OPTIONS: {
  value: QRErrorLevel;
  label: string;
  description: string;
}[] = [
  { value: "L", label: "Low (7%)", description: "작은 크기, 낮은 복원력" },
  { value: "M", label: "Medium (15%)", description: "권장, 균형잡힌 설정" },
  { value: "Q", label: "Quartile (25%)", description: "높은 복원력" },
  { value: "H", label: "High (30%)", description: "최대 복원력, 큰 크기" },
];

// WiFi 암호화 옵션
export const WIFI_ENCRYPTION_OPTIONS: {
  value: WiFiEncryption;
  label: string;
}[] = [
  { value: "WPA", label: "WPA/WPA2/WPA3" },
  { value: "WEP", label: "WEP" },
  { value: "nopass", label: "암호 없음" },
];
