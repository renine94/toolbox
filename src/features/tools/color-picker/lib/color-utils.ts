import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';

extend([namesPlugin]);

export const toHex = (color: any) => colord(color).toHex();
export const toRgb = (color: any) => colord(color).toRgb(); // returns {r, g, b, a}
export const toHsl = (color: any) => colord(color).toHsl(); // returns {h, s, l, a}
export const isValidColor = (color: any) => colord(color).isValid();

export type { Colord } from 'colord';
export { colord };
