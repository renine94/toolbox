import { v1 as uuidv1, v4 as uuidv4, v7 as uuidv7 } from "uuid";
import type { UuidConfig, UuidVersion, GeneratedUuid } from "../model/types";

export function generateUuid(version: UuidVersion): string {
  switch (version) {
    case "v1":
      return uuidv1();
    case "v4":
      return uuidv4();
    case "v7":
      return uuidv7();
    default:
      return uuidv4();
  }
}

export function formatUuid(uuid: string, config: UuidConfig): string {
  let result = uuid;

  if (!config.hyphens) {
    result = result.replace(/-/g, "");
  }

  if (config.uppercase) {
    result = result.toUpperCase();
  }

  if (config.braces) {
    result = `{${result}}`;
  }

  return result;
}

export function generateFormattedUuid(config: UuidConfig): string {
  const uuid = generateUuid(config.version);
  return formatUuid(uuid, config);
}

export function generateBulkUuids(
  config: UuidConfig,
  quantity: number
): GeneratedUuid[] {
  return Array.from({ length: quantity }, () => ({
    id: crypto.randomUUID(),
    uuid: generateFormattedUuid(config),
    version: config.version,
    createdAt: new Date(),
  }));
}

export function isValidUuid(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const uuidWithoutHyphensRegex =
    /^[0-9a-f]{8}[0-9a-f]{4}[1-7][0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12}$/i;
  const uuidWithBracesRegex =
    /^\{[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\}$/i;

  return (
    uuidRegex.test(uuid) ||
    uuidWithoutHyphensRegex.test(uuid) ||
    uuidWithBracesRegex.test(uuid)
  );
}

export function parseUuidVersion(uuid: string): UuidVersion | null {
  const cleanUuid = uuid.replace(/[{}-]/g, "");
  if (cleanUuid.length !== 32) return null;

  const versionChar = cleanUuid[12];
  switch (versionChar) {
    case "1":
      return "v1";
    case "4":
      return "v4";
    case "7":
      return "v7";
    default:
      return null;
  }
}

// Re-export from shared utilities
export { copyToClipboard } from "@/shared/lib/clipboard-utils";
