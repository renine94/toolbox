'use client';

import { useTranslations } from "next-intl";
import { useColorStore } from '../model/useColorStore';
import { toHex, toRgb, toHsl, isValidColor } from '../lib/color-utils';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export function ColorInputs() {
    const { color, setColor } = useColorStore();
    const t = useTranslations("tools.colorPicker.ui");
    const tCommon = useTranslations("common.toast");

    // Local state to allow typing without immediate validation/jumping
    const [hexInput, setHexInput] = useState(color);

    useEffect(() => {
        setHexInput(color);
    }, [color]);

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setHexInput(val);
        if (isValidColor(val)) {
            setColor(toHex(val));
        }
    };

    const copyToClipboard = (text: string) => {
        if (navigator?.clipboard) {
            navigator.clipboard.writeText(text);
            toast.success(tCommon('copied'));
        } else {
            toast.error(t('clipboardDenied'));
        }
    };

    // Convert current color to display strings
    const rgb = toRgb(color);
    const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    const hsl = toHsl(color);
    const hslString = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;

    return (
        <div className="space-y-4 w-full">
            <div className="space-y-2">
                <Label>HEX</Label>
                <div className="flex gap-2">
                    <Input value={hexInput} onChange={handleHexChange} className="font-mono uppercase transition-all focus:ring-2 focus:ring-primary/50" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(hexInput)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label>RGB</Label>
                <div className="flex gap-2">
                    <Input value={rgbString} readOnly className="font-mono bg-muted text-muted-foreground" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(rgbString)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label>HSL</Label>
                <div className="flex gap-2">
                    <Input value={hslString} readOnly className="font-mono bg-muted text-muted-foreground" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(hslString)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
