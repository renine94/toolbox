import { Button } from '@/shared/ui/button';
import { useJsonStore } from '../model/useJsonStore';
import { toast } from 'sonner';

export function ControlPanel() {
    const { format, minify, clear, output } = useJsonStore();

    const handleCopy = () => {
        if (!output) {
            toast.error('Nothing to copy');
            return;
        }
        navigator.clipboard.writeText(output);
        toast.success('Copied to clipboard');
    };

    return (
        <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-muted/50 rounded-lg border">
            <div className="flex gap-2">
                <Button onClick={format} variant="default">⚡ Format</Button>
                <Button onClick={minify} variant="secondary">📦 Minify</Button>
            </div>
            <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline" disabled={!output}>📋 Copy</Button>
                <Button onClick={clear} variant="ghost" className="text-destructive hover:bg-destructive/10">🗑️ Clear</Button>
            </div>
        </div>
    );
}
