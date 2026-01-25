"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { useFakeDataStore } from "../model/useFakeDataStore";
import type { FieldType } from "../model/types";

export function FieldSelector() {
  const t = useTranslations("tools.fakeDataGenerator.ui");

  const config = useFakeDataStore((state) => state.config);
  const toggleField = useFakeDataStore((state) => state.toggleField);
  const updateFieldLabel = useFakeDataStore((state) => state.updateFieldLabel);
  const selectAllFields = useFakeDataStore((state) => state.selectAllFields);
  const deselectAllFields = useFakeDataStore((state) => state.deselectAllFields);

  return (
    <div className="space-y-4">
      {/* 전체 선택/해제 버튼 */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={selectAllFields}>
          {t("selectAll")}
        </Button>
        <Button variant="outline" size="sm" onClick={deselectAllFields}>
          {t("deselectAll")}
        </Button>
      </div>

      {/* 필드 목록 */}
      <div className="space-y-3">
        {config.fields.map((field) => (
          <div
            key={field.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Switch
              checked={field.enabled}
              onCheckedChange={() => toggleField(field.id)}
              id={`field-${field.id}`}
            />
            <Label
              htmlFor={`field-${field.id}`}
              className="w-20 cursor-pointer text-sm"
            >
              {t(`fieldTypes.${field.type as FieldType}`)}
            </Label>
            <Input
              value={field.label}
              onChange={(e) => updateFieldLabel(field.id, e.target.value)}
              placeholder={field.type}
              className="h-8 text-sm flex-1"
              disabled={!field.enabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
