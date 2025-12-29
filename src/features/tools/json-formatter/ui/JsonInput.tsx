import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { useJsonStore } from '../model/useJsonStore';

export function JsonInput() {
    const { input, setInput } = useJsonStore();

    return (
        <div className="flex flex-col gap-2 h-full">
            <Label htmlFor="json-input" className="text-lg font-medium">Input JSON</Label>
            <Textarea
                id="json-input"
                placeholder="Paste your JSON here..."
                className="flex-1 font-mono text-sm resize-none p-4"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
        </div>
    );
}
