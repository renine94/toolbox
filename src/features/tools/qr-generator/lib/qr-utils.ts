import type { WiFiConfig, VCardConfig } from "../model/types";

/**
 * WiFi 설정을 QR 코드용 문자열로 변환
 * 형식: WIFI:T:<encryption>;S:<ssid>;P:<password>;H:<hidden>;;
 */
export function generateWifiString(config: WiFiConfig): string {
  const { ssid, password, encryption, hidden } = config;

  // 특수 문자 이스케이프 (\ ; , : ")
  const escapeSpecial = (str: string) =>
    str.replace(/([\\;,:"'])/g, "\\$1");

  const parts = [
    `T:${encryption}`,
    `S:${escapeSpecial(ssid)}`,
  ];

  if (encryption !== "nopass" && password) {
    parts.push(`P:${escapeSpecial(password)}`);
  }

  if (hidden) {
    parts.push("H:true");
  }

  return `WIFI:${parts.join(";")};;`;
}

/**
 * vCard 설정을 QR 코드용 문자열로 변환
 * vCard 3.0 형식
 */
export function generateVCardString(config: VCardConfig): string {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
  ];

  // 이름
  const fullName = [config.firstName, config.lastName].filter(Boolean).join(" ");
  if (fullName) {
    lines.push(`FN:${fullName}`);
    lines.push(`N:${config.lastName};${config.firstName};;;`);
  }

  // 전화번호
  if (config.phone) {
    lines.push(`TEL:${config.phone}`);
  }

  // 이메일
  if (config.email) {
    lines.push(`EMAIL:${config.email}`);
  }

  // 조직
  if (config.organization) {
    lines.push(`ORG:${config.organization}`);
  }

  // 직책
  if (config.title) {
    lines.push(`TITLE:${config.title}`);
  }

  // URL
  if (config.url) {
    lines.push(`URL:${config.url}`);
  }

  lines.push("END:VCARD");

  return lines.join("\n");
}

/**
 * QR 코드 SVG를 PNG로 다운로드
 */
export async function downloadAsPng(
  elementId: string,
  filename: string = "qrcode.png"
): Promise<void> {
  const svgElement = document.getElementById(elementId);
  if (!svgElement) {
    throw new Error("QR 코드 요소를 찾을 수 없습니다.");
  }

  // SVG를 캔버스로 변환
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    // 고해상도를 위해 2배 크기로 렌더링
    const scale = 2;
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(svgUrl);
      throw new Error("Canvas context를 생성할 수 없습니다.");
    }

    // 배경 그리기 (투명 방지)
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 이미지 그리기
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);

    // PNG로 다운로드
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      URL.revokeObjectURL(svgUrl);
    }, "image/png");
  };

  img.onerror = () => {
    URL.revokeObjectURL(svgUrl);
    throw new Error("이미지 로드에 실패했습니다.");
  };

  img.src = svgUrl;
}

/**
 * QR 코드 SVG를 SVG 파일로 다운로드
 */
export function downloadAsSvg(
  elementId: string,
  filename: string = "qrcode.svg"
): void {
  const svgElement = document.getElementById(elementId);
  if (!svgElement) {
    throw new Error("QR 코드 요소를 찾을 수 없습니다.");
  }

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 클립보드에 텍스트 복사
 */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

/**
 * 고유 ID 생성
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
