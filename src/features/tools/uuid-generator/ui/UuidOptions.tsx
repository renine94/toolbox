"use client";

import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useUuidStore } from "../model/useUuidStore";
import { UUID_VERSION_INFO, type UuidVersion } from "../model/types";

export function UuidOptions() {
  const config = useUuidStore((state) => state.config);
  const setVersion = useUuidStore((state) => state.setVersion);
  const setUppercase = useUuidStore((state) => state.setUppercase);
  const setHyphens = useUuidStore((state) => state.setHyphens);
  const setBraces = useUuidStore((state) => state.setBraces);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>UUID 버전</Label>
        <Select
          value={config.version}
          onValueChange={(value) => setVersion(value as UuidVersion)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(UUID_VERSION_INFO).map(([version, info]) => (
              <SelectItem key={version} value={version}>
                <div className="flex flex-col">
                  <span className="font-medium">{info.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {info.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="uppercase">대문자</Label>
            <p className="text-xs text-muted-foreground">
              UUID를 대문자로 표시합니다
            </p>
          </div>
          <Switch
            id="uppercase"
            checked={config.uppercase}
            onCheckedChange={setUppercase}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="hyphens">하이픈 포함</Label>
            <p className="text-xs text-muted-foreground">
              UUID에 하이픈(-)을 포함합니다
            </p>
          </div>
          <Switch
            id="hyphens"
            checked={config.hyphens}
            onCheckedChange={setHyphens}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="braces">중괄호 감싸기</Label>
            <p className="text-xs text-muted-foreground">
              UUID를 중괄호로 감쌉니다
            </p>
          </div>
          <Switch
            id="braces"
            checked={config.braces}
            onCheckedChange={setBraces}
          />
        </div>
      </div>
    </div>
  );
}
