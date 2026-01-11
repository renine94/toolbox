"use client";

import { useTranslations } from "next-intl";
import { Button } from '@/shared/ui/button';
import { useJsonStore } from '../model/useJsonStore';
import { toast } from 'sonner';

export function ControlPanel() {
    const { format, minify, clear, output } = useJsonStore();
    const t = useTranslations("tools.jsonFormatter.ui");
    const tCommon = useTranslations("common.toast");

    const handleCopy = () => {
        if (!output) {
            toast.error(t('nothingToCopy'));
            return;
        }
        navigator.clipboard.writeText(output);
        toast.success(tCommon('copied'));
    };

    return (
        <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-muted/50 rounded-lg border">
            <div className="flex gap-2">
                <Button onClick={format} variant="default">⚡ {t('format')}</Button>
                <Button onClick={minify} variant="secondary">📦 {t('minify')}</Button>
            </div>
            <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline" disabled={!output}>📋 {t('copy')}</Button>
                <Button onClick={clear} variant="ghost" className="text-destructive hover:bg-destructive/10">🗑️ {t('clear')}</Button>
            </div>
        </div>
    );
}
