import { ColorPicker } from '@/features/tools/color-picker';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Color Picker | DevTools',
    description: 'A powerful color picking tool with HEX, RGB, and HSL support.',
};

export default function ColorPickerPage() {
    return (
        <div className="container py-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Color Picker</h1>
                <p className="text-muted-foreground">
                    Pick colors and convert between HEX, RGB, and HSL formats easily.
                </p>
            </div>
            <ColorPicker />
        </div>
    );
}
