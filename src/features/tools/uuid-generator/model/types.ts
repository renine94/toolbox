export type UuidVersion = "v1" | "v4" | "v7";

export interface UuidConfig {
  version: UuidVersion;
  uppercase: boolean;
  hyphens: boolean;
  braces: boolean;
  quantity: number;
}

export interface GeneratedUuid {
  id: string;
  uuid: string;
  version: UuidVersion;
  createdAt: Date;
}

export const DEFAULT_CONFIG: UuidConfig = {
  version: "v4",
  uppercase: false,
  hyphens: true,
  braces: false,
  quantity: 1,
};

export const UUID_VERSION_INFO: Record<
  UuidVersion,
  { name: string; description: string }
> = {
  v1: {
    name: "UUID v1",
    description: "타임스탬프 + MAC 주소 기반 (시간 순서 보장)",
  },
  v4: {
    name: "UUID v4",
    description: "완전 랜덤 생성 (가장 일반적)",
  },
  v7: {
    name: "UUID v7",
    description: "Unix 타임스탬프 + 랜덤 (정렬 가능, 최신 표준)",
  },
};
