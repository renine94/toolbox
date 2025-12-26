'use client';

import { ColorCanvas } from './ColorCanvas';
import { ColorInputs } from './ColorInputs';
import { ColorPalette } from './ColorPalette';

export function ColorPicker() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full max-w-4xl mx-auto">
            <div className="flex-1 w-full bg-card rounded-xl border p-6 shadow-sm">
                <ColorCanvas />
                <div className="mt-8">
                    <ColorPalette />
                </div>
            </div>

            <div className="w-full lg:w-80 bg-card rounded-xl border p-6 shadow-sm h-fit">
                <ColorInputs />
            </div>
        </div>
    );
}
