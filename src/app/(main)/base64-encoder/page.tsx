import { Metadata } from 'next';
import { Base64Encoder } from '@/features/tools/base64-encoder';

export const metadata: Metadata = {
    title: 'Base64 Encoder/Decoder - Developer Tools',
    description: 'Encode and decode Base64 strings easily. Supports UTF-8 characters.',
};

export default function Base64EncoderPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8 text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Base64 Encoder/Decoder</h1>
                    <p className="text-muted-foreground">
                        Simple and fast Base64 encoder and decoder. Paste your text or Base64 string below to convert.
                    </p>
                </div>
                <Base64Encoder />
            </main>
        </div>
    );
}
