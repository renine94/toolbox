"use client";

import { useTranslations } from "next-intl";
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { useJsonStore } from '../model/useJsonStore';

export function JsonOutput() {
    const { output, error } = useJsonStore();
    const t = useTranslations("tools.jsonFormatter.ui");

    return (
        <div className="flex flex-col gap-2 h-full">
            <Label htmlFor="json-output" className="text-lg font-medium">
                {t('outputLabel')}
                {error && <span className="text-destructive ml-2 text-sm">({error})</span>}
            </Label>
            <Textarea
                id="json-output"
                readOnly
                placeholder={t('outputPlaceholder')}
                className={`flex-1 font-mono text-sm resize-none p-4 ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                value={output}
            />
        </div>
    );
}
