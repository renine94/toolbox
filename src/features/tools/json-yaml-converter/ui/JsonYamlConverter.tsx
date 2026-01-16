"use client";

import { useTranslations } from "next-intl";
import { useJsonYamlConverter, ConvertMode, IndentSize } from "../model/useJsonYamlConverter";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { ClipboardDocumentIcon, TrashIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

export function JsonYamlConverter() {
  const {
    input,
    setInput,
    output,
    error,
    mode,
    indent,
    handleModeChange,
    handleIndentChange,
    handleSwap,
    handleClear,
    copyToClipboard,
  } = useJsonYamlConverter();
  const t = useTranslations("tools.jsonYamlConverter.ui");

  return (
    <div className="grid gap-6">
      {/* Mode Selection */}
      <div className="flex justify-center gap-4">
        <Button
          variant={mode === "json-to-yaml" ? "default" : "outline"}
          onClick={() => handleModeChange("json-to-yaml")}
          className="w-36"
        >
          JSON → YAML
        </Button>
        <Button
          variant={mode === "yaml-to-json" ? "default" : "outline"}
          onClick={() => handleModeChange("yaml-to-json")}
          className="w-36"
        >
          YAML → JSON
        </Button>
      </div>

      {/* Indent Size Selection */}
      <Card className="max-w-md mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("indentSize")}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={String(indent)}
            onValueChange={(value) => handleIndentChange(Number(value) as IndentSize)}
            className="flex gap-6 justify-center"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="indent-2" />
              <Label htmlFor="indent-2" className="cursor-pointer">
                {t("indent2")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="indent-4" />
              <Label htmlFor="indent-4" className="cursor-pointer">
                {t("indent4")}
              </Label>
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
              {mode === "json-to-yaml" ? t("inputDescription.jsonToYaml") : t("inputDescription.yamlToJson")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={mode === "json-to-yaml" ? t("inputPlaceholder.json") : t("inputPlaceholder.yaml")}
              className="min-h-[300px] max-h-[500px] resize-none font-mono text-sm overflow-auto"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="text-muted-foreground"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                {t("clear")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(input)}
                disabled={!input}
              >
                <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                {t("copy")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{t("output")}</CardTitle>
                <CardDescription>{t("resultRealtime")}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwap}
                disabled={!output || !!error}
                title={t("swap")}
              >
                <ArrowsRightLeftIcon className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? (
              <div className="min-h-[300px] max-h-[500px] flex items-center justify-center border rounded-md bg-destructive/10 border-destructive/20 p-4 overflow-auto">
                <p className="text-destructive text-sm font-mono break-all">{error}</p>
              </div>
            ) : (
              <Textarea
                readOnly
                placeholder={t("outputPlaceholder")}
                className="min-h-[300px] max-h-[500px] resize-none font-mono text-sm bg-muted/50 overflow-auto"
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
