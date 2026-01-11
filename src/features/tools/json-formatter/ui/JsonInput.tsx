"use client";

import { useTranslations } from "next-intl";
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { useJsonStore } from '../model/useJsonStore';

export function JsonInput() {
    const { input, setInput } = useJsonStore();
    const t = useTranslations("tools.jsonFormatter.ui");

    return (
        <div className="flex flex-col gap-2 h-full">
            <Label htmlFor="json-input" className="text-lg font-medium">{t('inputLabel')}</Label>
            <Textarea
                id="json-input"
                placeholder={t('inputPlaceholder')}
                className="flex-1 font-mono text-sm resize-none p-4"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
        </div>
    );
}
