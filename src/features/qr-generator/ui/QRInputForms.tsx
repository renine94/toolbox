"use client";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { useQRStore } from "../model/useQRStore";
import {
  INPUT_TYPE_OPTIONS,
  WIFI_ENCRYPTION_OPTIONS,
  type QRInputType,
  type WiFiEncryption,
} from "../model/types";

export function QRInputForms() {
  const { config, setInputType, setValue, wifiConfig, setWifiConfig, vcardConfig, setVCardConfig } =
    useQRStore();

  return (
    <div className="space-y-4">
      {/* 입력 타입 선택 */}
      <div className="space-y-2">
        <Label>입력 타입</Label>
        <Select
          value={config.inputType}
          onValueChange={(value) => setInputType(value as QRInputType)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INPUT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 텍스트/URL 입력 */}
      {(config.inputType === "text" || config.inputType === "url") && (
        <div className="space-y-2">
          <Label>
            {config.inputType === "text" ? "텍스트" : "URL"}
          </Label>
          {config.inputType === "text" ? (
            <Textarea
              value={config.value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="QR 코드에 담을 텍스트를 입력하세요"
              rows={3}
            />
          ) : (
            <Input
              type="url"
              value={config.value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://example.com"
            />
          )}
        </div>
      )}

      {/* WiFi 입력 폼 */}
      {config.inputType === "wifi" && (
        <WiFiForm
          config={wifiConfig}
          onChange={setWifiConfig}
        />
      )}

      {/* vCard 입력 폼 */}
      {config.inputType === "vcard" && (
        <VCardForm
          config={vcardConfig}
          onChange={setVCardConfig}
        />
      )}
    </div>
  );
}

interface WiFiFormProps {
  config: typeof import("../model/types").DEFAULT_WIFI_CONFIG;
  onChange: (config: Partial<typeof import("../model/types").DEFAULT_WIFI_CONFIG>) => void;
}

function WiFiForm({ config, onChange }: WiFiFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>네트워크 이름 (SSID)</Label>
        <Input
          value={config.ssid}
          onChange={(e) => onChange({ ssid: e.target.value })}
          placeholder="WiFi 네트워크 이름"
        />
      </div>

      <div className="space-y-2">
        <Label>암호화 방식</Label>
        <Select
          value={config.encryption}
          onValueChange={(value) => onChange({ encryption: value as WiFiEncryption })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WIFI_ENCRYPTION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {config.encryption !== "nopass" && (
        <div className="space-y-2">
          <Label>비밀번호</Label>
          <Input
            type="password"
            value={config.password}
            onChange={(e) => onChange({ password: e.target.value })}
            placeholder="WiFi 비밀번호"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="wifi-hidden"
          checked={config.hidden}
          onCheckedChange={(checked) => onChange({ hidden: checked })}
        />
        <Label htmlFor="wifi-hidden">숨겨진 네트워크</Label>
      </div>
    </div>
  );
}

interface VCardFormProps {
  config: typeof import("../model/types").DEFAULT_VCARD_CONFIG;
  onChange: (config: Partial<typeof import("../model/types").DEFAULT_VCARD_CONFIG>) => void;
}

function VCardForm({ config, onChange }: VCardFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>이름</Label>
          <Input
            value={config.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            placeholder="이름"
          />
        </div>
        <div className="space-y-2">
          <Label>성</Label>
          <Input
            value={config.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            placeholder="성"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>전화번호</Label>
        <Input
          type="tel"
          value={config.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="010-1234-5678"
        />
      </div>

      <div className="space-y-2">
        <Label>이메일</Label>
        <Input
          type="email"
          value={config.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="email@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label>회사/조직</Label>
        <Input
          value={config.organization}
          onChange={(e) => onChange({ organization: e.target.value })}
          placeholder="회사명"
        />
      </div>

      <div className="space-y-2">
        <Label>직책</Label>
        <Input
          value={config.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="직책"
        />
      </div>

      <div className="space-y-2">
        <Label>웹사이트</Label>
        <Input
          type="url"
          value={config.url}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder="https://example.com"
        />
      </div>
    </div>
  );
}
