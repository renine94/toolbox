"use client";

import { useTranslations } from "next-intl";
import { useUrlEncoder } from "../model/useUrlEncoder";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { ClipboardDocumentIcon, TrashIcon } from "@heroicons/react/24/outline";

export function UrlEncoder() {
    const {
        input,
        setInput,
        output,
        error,
        mode,
        encodingType,
        handleModeChange,
        handleEncodingTypeChange,
        copyToClipboard,
    } = useUrlEncoder();
    const t = useTranslations("tools.urlEncoder.ui");

    return (
        <div className="grid gap-6">
            {/* Mode Selection */}
            <div className="flex justify-center gap-4">
                <Button
                    variant={mode === 'encode' ? 'default' : 'outline'}
                    onClick={() => handleModeChange('encode')}
                    className="w-32"
                >
                    {t("encoder")}
                </Button>
                <Button
                    variant={mode === 'decode' ? 'default' : 'outline'}
                    onClick={() => handleModeChange('decode')}
                    className="w-32"
                >
                    {t("decoder")}
                </Button>
            </div>

            {/* Encoding Type Selection */}
            <Card className="max-w-md mx-auto">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">{t("encodingType")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={encodingType}
                        onValueChange={(value) => handleEncodingTypeChange(value as 'component' | 'fullUri')}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        <div className="flex items-start space-x-3">
                            <RadioGroupItem value="component" id="component" className="mt-1" />
                            <div className="grid gap-1">
                                <Label htmlFor="component" className="font-medium cursor-pointer">
                                    {t("component")}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    {t("componentDesc")}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <RadioGroupItem value="fullUri" id="fullUri" className="mt-1" />
                            <div className="grid gap-1">
                                <Label htmlFor="fullUri" className="font-medium cursor-pointer">
                                    {t("fullUri")}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    {t("fullUriDesc")}
                                </p>
                            </div>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Input/Output Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>{t("input")}</CardTitle>
                        <CardDescription>
                            {mode === 'encode' ? t("inputDescription.encode") : t("inputDescription.decode")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder={mode === 'encode' ? t("inputPlaceholder.encode") : t("inputPlaceholder.decode")}
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
                                {t("clear")}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(input)}
                            >
                                <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                                {t("copy")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>{t("output")}</CardTitle>
                        <CardDescription>
                            {t("resultRealtime")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error ? (
                            <div className="min-h-[300px] flex items-center justify-center border rounded-md bg-destructive/10 border-destructive/20">
                                <p className="text-destructive text-sm">{error}</p>
                            </div>
                        ) : (
                            <Textarea
                                readOnly
                                placeholder={t("outputPlaceholder")}
                                className="min-h-[300px] resize-none font-mono bg-muted/50"
                                value={output}
                            />
                        )}
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(output)}
                                disabled={!output || !!error}
                            >
                                <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                                {t("copyResult")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
