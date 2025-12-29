export const formatJson = (json: string, indent: number = 2): string => {
    if (!json.trim()) return '';
    try {
        const parsed = JSON.parse(json);
        return JSON.stringify(parsed, null, indent);
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
};

export const minifyJson = (json: string): string => {
    if (!json.trim()) return '';
    try {
        const parsed = JSON.parse(json);
        return JSON.stringify(parsed);
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
};
