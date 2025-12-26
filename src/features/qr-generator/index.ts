// UI
export { QRGenerator } from "./ui/QRGenerator";
export { QRPreview, QR_PREVIEW_ID } from "./ui/QRPreview";
export { QRInputForms } from "./ui/QRInputForms";
export { QRControls } from "./ui/QRControls";
export { SavedQRCodes } from "./ui/SavedQRCodes";

// Store
export { useQRStore } from "./model/useQRStore";

// Types
export type {
  QRConfig,
  QRInputType,
  QRErrorLevel,
  WiFiConfig,
  WiFiEncryption,
  VCardConfig,
  SavedQRCode,
} from "./model/types";
export {
  DEFAULT_QR_CONFIG,
  DEFAULT_WIFI_CONFIG,
  DEFAULT_VCARD_CONFIG,
  INPUT_TYPE_OPTIONS,
  ERROR_LEVEL_OPTIONS,
  WIFI_ENCRYPTION_OPTIONS,
} from "./model/types";

// Utils
export {
  generateWifiString,
  generateVCardString,
  downloadAsPng,
  downloadAsSvg,
  copyToClipboard,
  generateId,
} from "./lib/qr-utils";
