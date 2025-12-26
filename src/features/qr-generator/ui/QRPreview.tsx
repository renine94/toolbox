"use client";

import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useQRStore } from "../model/useQRStore";
import { generateWifiString, generateVCardString } from "../lib/qr-utils";

export const QR_PREVIEW_ID = "qr-code-preview";

export function QRPreview() {
  const { config, wifiConfig, vcardConfig } = useQRStore();

  // QR 코드에 인코딩될 최종 값 계산
  const qrValue = useMemo(() => {
    switch (config.inputType) {
      case "wifi":
        if (!wifiConfig.ssid) return "";
        return generateWifiString(wifiConfig);
      case "vcard":
        if (!vcardConfig.firstName && !vcardConfig.lastName) return "";
        return generateVCardString(vcardConfig);
      case "url":
      case "text":
      default:
        return config.value;
    }
  }, [config.inputType, config.value, wifiConfig, vcardConfig]);

  const hasValue = qrValue.length > 0;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative rounded-lg border bg-white p-4"
        style={{
          width: config.size + 32,
          height: config.size + 32,
        }}
      >
        {hasValue ? (
          <QRCodeSVG
            id={QR_PREVIEW_ID}
            value={qrValue}
            size={config.size}
            level={config.errorLevel}
            fgColor={config.fgColor}
            bgColor={config.bgColor}
            includeMargin={config.includeMargin}
          />
        ) : (
          <div
            className="flex items-center justify-center text-muted-foreground text-sm"
            style={{
              width: config.size,
              height: config.size,
            }}
          >
            {config.inputType === "wifi" && "SSID를 입력하세요"}
            {config.inputType === "vcard" && "이름을 입력하세요"}
            {(config.inputType === "text" || config.inputType === "url") &&
              "텍스트를 입력하세요"}
          </div>
        )}
      </div>

      {/* QR 코드 정보 */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>
          크기: {config.size}×{config.size}px
        </p>
        <p>에러 교정: {config.errorLevel}</p>
        {hasValue && (
          <p className="mt-1 max-w-xs truncate">
            데이터: {qrValue.substring(0, 50)}
            {qrValue.length > 50 && "..."}
          </p>
        )}
      </div>
    </div>
  );
}
