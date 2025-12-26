export interface RgbColor {
    r: number;
    g: number;
    b: number;
}

export interface HslColor {
    h: number;
    s: number;
    l: number;
}

export type ColorFormat = 'hex' | 'rgb' | 'hsl';
