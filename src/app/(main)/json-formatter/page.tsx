import { Metadata } from 'next';
import { JsonFormatter } from '@/features/tools/json-formatter';

export const metadata: Metadata = {
    title: 'JSON Formatter - Developer Tools',
    description: 'Format, validate, and minify JSON data with this free online tool.',
};

export default function JsonFormatterPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">JSON Formatter</h1>
                    <p className="text-muted-foreground">
                        Beautify your JSON data with our free formatter. Validate, minify, and copy with ease.
                    </p>
                </div>
                <JsonFormatter />
            </main>
        </div>
    );
}
