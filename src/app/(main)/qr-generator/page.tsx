import { Metadata } from "next";
import { QRGenerator } from "@/features/tools/qr-generator";

export const metadata: Metadata = {
  title: "QR Code Generator | DevTools",
  description: "URL, 텍스트, WiFi, 연락처 정보 등으로 QR 코드를 생성합니다.",
};

export default function QRGeneratorPage() {
  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">QR Code Generator</h1>
        <p className="text-muted-foreground">
          URL, 텍스트, WiFi, 연락처 정보 등으로 QR 코드를 생성하고 다운로드하세요.
        </p>
      </div>
      <QRGenerator />
    </div>
  );
}
