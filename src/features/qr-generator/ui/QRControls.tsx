"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Download, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useQRStore } from "../model/useQRStore";
import { ERROR_LEVEL_OPTIONS, type QRErrorLevel } from "../model/types";
import { downloadAsPng, downloadAsSvg } from "../lib/qr-utils";
import { QR_PREVIEW_ID } from "./QRPreview";

export function QRControls() {
  const {
    config,
    setSize,
    setErrorLevel,
    setFgColor,
    setBgColor,
    setIncludeMargin,
    resetConfig,
    saveQRCode,
  } = useQRStore();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  const handleDownloadPng = async () => {
    try {
      await downloadAsPng(QR_PREVIEW_ID, "qrcode.png");
      toast.success("PNG 파일이 다운로드되었습니다.");
    } catch {
      toast.error("다운로드에 실패했습니다.");
    }
  };

  const handleDownloadSvg = () => {
    try {
      downloadAsSvg(QR_PREVIEW_ID, "qrcode.svg");
      toast.success("SVG 파일이 다운로드되었습니다.");
    } catch {
      toast.error("다운로드에 실패했습니다.");
    }
  };

  const handleSave = () => {
    if (!saveName.trim()) {
      toast.error("이름을 입력하세요.");
      return;
    }
    saveQRCode(saveName.trim());
    toast.success("QR 코드가 저장되었습니다.");
    setSaveName("");
    setSaveDialogOpen(false);
  };

  const handleReset = () => {
    resetConfig();
    toast.success("설정이 초기화되었습니다.");
  };

  return (
    <div className="space-y-6">
      {/* 크기 조절 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>크기</Label>
          <span className="text-sm text-muted-foreground">{config.size}px</span>
        </div>
        <Slider
          value={[config.size]}
          onValueChange={([value]) => setSize(value)}
          min={128}
          max={512}
          step={8}
        />
      </div>

      {/* 에러 교정 레벨 */}
      <div className="space-y-2">
        <Label>에러 교정 레벨</Label>
        <Select
          value={config.errorLevel}
          onValueChange={(value) => setErrorLevel(value as QRErrorLevel)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ERROR_LEVEL_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 색상 설정 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>전경색</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={config.fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={config.fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="flex-1 font-mono text-sm"
              maxLength={7}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>배경색</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={config.bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={config.bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="flex-1 font-mono text-sm"
              maxLength={7}
            />
          </div>
        </div>
      </div>

      {/* 여백 포함 */}
      <div className="flex items-center justify-between">
        <Label htmlFor="include-margin">여백 포함</Label>
        <Switch
          id="include-margin"
          checked={config.includeMargin}
          onCheckedChange={setIncludeMargin}
        />
      </div>

      {/* 액션 버튼 */}
      <div className="space-y-2 pt-4 border-t">
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleDownloadPng} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            PNG
          </Button>
          <Button onClick={handleDownloadSvg} variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            SVG
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                저장
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>QR 코드 저장</DialogTitle>
                <DialogDescription>
                  현재 QR 코드를 저장할 이름을 입력하세요.
                </DialogDescription>
              </DialogHeader>
              <Input
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="QR 코드 이름"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleSave}>저장</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" onClick={handleReset} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            초기화
          </Button>
        </div>
      </div>
    </div>
  );
}
