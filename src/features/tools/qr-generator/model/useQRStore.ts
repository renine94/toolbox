import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  QRConfig,
  QRInputType,
  QRErrorLevel,
  WiFiConfig,
  VCardConfig,
  SavedQRCode,
} from "./types";
import {
  DEFAULT_QR_CONFIG,
  DEFAULT_WIFI_CONFIG,
  DEFAULT_VCARD_CONFIG,
} from "./types";
import { generateId } from "../lib/qr-utils";

interface QRState {
  // 현재 설정
  config: QRConfig;
  wifiConfig: WiFiConfig;
  vcardConfig: VCardConfig;

  // 저장된 QR 코드
  savedQRCodes: SavedQRCode[];

  // Config Actions
  setValue: (value: string) => void;
  setInputType: (type: QRInputType) => void;
  setSize: (size: number) => void;
  setErrorLevel: (level: QRErrorLevel) => void;
  setFgColor: (color: string) => void;
  setBgColor: (color: string) => void;
  setIncludeMargin: (include: boolean) => void;
  resetConfig: () => void;

  // WiFi Config Actions
  setWifiConfig: (config: Partial<WiFiConfig>) => void;
  resetWifiConfig: () => void;

  // VCard Config Actions
  setVCardConfig: (config: Partial<VCardConfig>) => void;
  resetVCardConfig: () => void;

  // Saved QR Codes Actions
  saveQRCode: (name: string) => void;
  loadQRCode: (id: string) => void;
  deleteQRCode: (id: string) => void;
  clearSavedQRCodes: () => void;
}

export const useQRStore = create<QRState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      config: DEFAULT_QR_CONFIG,
      wifiConfig: DEFAULT_WIFI_CONFIG,
      vcardConfig: DEFAULT_VCARD_CONFIG,
      savedQRCodes: [],

      // Config Actions
      setValue: (value) =>
        set((state) => ({
          config: { ...state.config, value },
        })),

      setInputType: (type) =>
        set((state) => ({
          config: { ...state.config, inputType: type, value: "" },
        })),

      setSize: (size) =>
        set((state) => ({
          config: { ...state.config, size },
        })),

      setErrorLevel: (level) =>
        set((state) => ({
          config: { ...state.config, errorLevel: level },
        })),

      setFgColor: (color) =>
        set((state) => ({
          config: { ...state.config, fgColor: color },
        })),

      setBgColor: (color) =>
        set((state) => ({
          config: { ...state.config, bgColor: color },
        })),

      setIncludeMargin: (include) =>
        set((state) => ({
          config: { ...state.config, includeMargin: include },
        })),

      resetConfig: () =>
        set({
          config: DEFAULT_QR_CONFIG,
          wifiConfig: DEFAULT_WIFI_CONFIG,
          vcardConfig: DEFAULT_VCARD_CONFIG,
        }),

      // WiFi Config Actions
      setWifiConfig: (config) =>
        set((state) => ({
          wifiConfig: { ...state.wifiConfig, ...config },
        })),

      resetWifiConfig: () =>
        set({
          wifiConfig: DEFAULT_WIFI_CONFIG,
        }),

      // VCard Config Actions
      setVCardConfig: (config) =>
        set((state) => ({
          vcardConfig: { ...state.vcardConfig, ...config },
        })),

      resetVCardConfig: () =>
        set({
          vcardConfig: DEFAULT_VCARD_CONFIG,
        }),

      // Saved QR Codes Actions
      saveQRCode: (name) => {
        const state = get();
        const newSavedQRCode: SavedQRCode = {
          id: generateId(),
          name,
          config: { ...state.config },
          wifiConfig:
            state.config.inputType === "wifi"
              ? { ...state.wifiConfig }
              : undefined,
          vcardConfig:
            state.config.inputType === "vcard"
              ? { ...state.vcardConfig }
              : undefined,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          savedQRCodes: [newSavedQRCode, ...state.savedQRCodes],
        }));
      },

      loadQRCode: (id) => {
        const state = get();
        const saved = state.savedQRCodes.find((qr) => qr.id === id);
        if (saved) {
          set({
            config: { ...saved.config },
            wifiConfig: saved.wifiConfig ?? DEFAULT_WIFI_CONFIG,
            vcardConfig: saved.vcardConfig ?? DEFAULT_VCARD_CONFIG,
          });
        }
      },

      deleteQRCode: (id) =>
        set((state) => ({
          savedQRCodes: state.savedQRCodes.filter((qr) => qr.id !== id),
        })),

      clearSavedQRCodes: () =>
        set({
          savedQRCodes: [],
        }),
    }),
    {
      name: "qr-generator-storage",
      partialize: (state) => ({
        savedQRCodes: state.savedQRCodes,
      }),
    }
  )
);
