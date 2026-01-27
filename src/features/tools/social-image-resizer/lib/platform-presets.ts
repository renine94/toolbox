import type { Platform, PlatformPreset } from "../model/types";
import { PLATFORM_PRESETS, PLATFORM_INFO } from "../model/types";

/**
 * 플랫폼별 프리셋 그룹화
 */
export function getPresetsByPlatform(): Map<Platform, PlatformPreset[]> {
  const grouped = new Map<Platform, PlatformPreset[]>();

  for (const preset of PLATFORM_PRESETS) {
    const existing = grouped.get(preset.platform) || [];
    existing.push(preset);
    grouped.set(preset.platform, existing);
  }

  return grouped;
}

/**
 * 특정 플랫폼의 프리셋 가져오기
 */
export function getPresetsForPlatform(platform: Platform): PlatformPreset[] {
  return PLATFORM_PRESETS.filter((preset) => preset.platform === platform);
}

/**
 * 프리셋 ID로 프리셋 찾기
 */
export function getPresetById(presetId: string): PlatformPreset | undefined {
  return PLATFORM_PRESETS.find((preset) => preset.id === presetId);
}

/**
 * 플랫폼 정보 가져오기
 */
export function getPlatformInfo(platform: Platform) {
  return PLATFORM_INFO[platform];
}

/**
 * 모든 플랫폼 목록 가져오기
 */
export function getAllPlatforms(): Platform[] {
  return Object.keys(PLATFORM_INFO) as Platform[];
}

/**
 * 모든 프리셋 ID 가져오기
 */
export function getAllPresetIds(): string[] {
  return PLATFORM_PRESETS.map((preset) => preset.id);
}

/**
 * 특정 플랫폼의 모든 프리셋 ID 가져오기
 */
export function getPlatformPresetIds(platform: Platform): string[] {
  return PLATFORM_PRESETS.filter((preset) => preset.platform === platform).map(
    (preset) => preset.id
  );
}

/**
 * 프리셋 이름 포맷 (플랫폼명 + 타입)
 */
export function formatPresetName(preset: PlatformPreset): string {
  const platformInfo = PLATFORM_INFO[preset.platform];
  return `${platformInfo.name} ${preset.name}`;
}

/**
 * 프리셋 크기 포맷
 */
export function formatPresetSize(preset: PlatformPreset): string {
  return `${preset.width} x ${preset.height}`;
}
