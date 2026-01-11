'use client';

import { useTranslations } from "next-intl";
import { useColorStore } from '../model/useColorStore';
import { cn } from '@/shared/lib/utils';

const PRESET_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
    '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e',
    '#09090b', '#71717a', '#a1a1aa', '#e4e4e7', '#ffffff'
];

export function ColorPalette() {
    const { setColor, color } = useColorStore();
    const t = useTranslations("tools.colorPicker.ui");

    return (
        <div className="w-full">
            <h3 className="text-sm font-medium mb-3">{t("presets")}</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {PRESET_COLORS.map((c) => (
                    <button
                        key={c}
                        className={cn(
                            "w-full aspect-square rounded-full border border-border shadow-sm hover:scale-110 active:scale-95 transition-transform",
                            color === c && "ring-2 ring-primary ring-offset-2"
                        )}
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                        title={c}
                    />
                ))}
            </div>
        </div>
    );
}
