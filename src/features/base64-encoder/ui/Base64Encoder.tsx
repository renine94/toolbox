"use client";

import { useBase64 } from "../model/useBase64";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { ArrowPathIcon, ClipboardDocumentIcon, TrashIcon } from "@heroicons/react/24/outline";

export function Base64Encoder() {
    const {
        input,
        setInput,
        output,
        mode,
        handleModeChange,
        handleTransform,
        copyToClipboard,
        setOutput // To allow clearing output manually if needed, though mostly automatic
    } = useBase64();

    return (
        <div className="grid gap-6">
            <div className="flex justify-center gap-4">
                <Button
                    variant={mode === 'encode' ? 'default' : 'outline'}
                    onClick={() => handleModeChange('encode')}
                    className="w-32"
                >
                    Encoder
                </Button>
                <Button
                    variant={mode === 'decode' ? 'default' : 'outline'}
                    onClick={() => handleModeChange('decode')}
                    className="w-32"
                >
                    Decoder
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Input</CardTitle>
                        <CardDescription>
                            {mode === 'encode' ? 'Enter text to encode' : 'Enter Base64 string to decode'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder={mode === 'encode' ? "Type something..." : "Paste Base64 string..."}
                            className="min-h-[300px] resize-none font-mono"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setInput('')}
                                className="text-muted-foreground"
                            >
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(input)}
                            >
                                <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                                Copy
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Output</CardTitle>
                        <CardDescription>
                            Result
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            readOnly
                            placeholder="Result will appear here..."
                            className="min-h-[300px] resize-none font-mono bg-muted/50"
                            value={output}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(output)}
                                disabled={!output}
                            >
                                <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                                Copy Result
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center">
                <Button size="lg" onClick={handleTransform} className="w-full md:w-auto md:min-w-[200px]">
                    <ArrowPathIcon className="w-5 h-5 mr-2" />
                    {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
                </Button>
            </div>
        </div>
    );
}
