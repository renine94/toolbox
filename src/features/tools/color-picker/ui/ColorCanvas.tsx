'use client';

import { HexColorPicker } from 'react-colorful';
import { useColorStore } from '../model/useColorStore';

export function ColorCanvas() {
    const { color, setColor } = useColorStore();

    return (
        <div className="flex flex-col items-center w-full">
            <div className="relative w-full aspect-square max-w-sm">
                <HexColorPicker
                    color={color}
                    onChange={setColor}
                    style={{ width: '100%', height: '100%', borderRadius: 'var(--radius)' }}
                />
            </div>
        </div>
    );
}
