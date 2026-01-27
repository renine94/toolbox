"use client";

import { useTranslations } from "next-intl";
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { useJsonStore } from '../model/useJsonStore';
import { useDebounceCallback } from '@/shared/hooks/use-debounce';

// debounce 대기 시간 (ms) - 대용량 JSON 입력 시 성능 최적화
const DEBOUNCE_DELAY = 300;

export function JsonInput() {
    const { input, setInput, formatInput } = useJsonStore();
    const t = useTranslations("tools.jsonFormatter.ui");

    // debounced 포맷팅 함수
    const debouncedFormat = useDebounceCallback((value: string) => {
        formatInput(value);
    }, DEBOUNCE_DELAY);

    const handleChange = (value: string) => {
        setInput(value);           // 입력값 즉시 반영
        debouncedFormat(value);    // 포맷팅은 debounce 적용
    };

    return (
        <div className="flex flex-col gap-2 h-full">
            <Label htmlFor="json-input" className="text-lg font-medium">{t('inputLabel')}</Label>
            <Textarea
                id="json-input"
                placeholder={t('inputPlaceholder')}
                className="flex-1 font-mono text-sm resize-none p-4"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    );
}
