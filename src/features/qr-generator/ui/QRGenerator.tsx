"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { QrCode, Settings, Edit, Bookmark } from "lucide-react";
import { QRPreview } from "./QRPreview";
import { QRInputForms } from "./QRInputForms";
import { QRControls } from "./QRControls";
import { SavedQRCodes } from "./SavedQRCodes";

export function QRGenerator() {
  return (
    <div className="space-y-6">
      {/* Main Section */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left Panel - Preview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              미리보기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QRPreview />
          </CardContent>
        </Card>

        {/* Right Panel - Input & Controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Edit className="h-5 w-5" />
                입력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QRInputForms />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QRControls />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Saved QR Codes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            저장된 QR 코드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SavedQRCodes />
        </CardContent>
      </Card>
    </div>
  );
}
