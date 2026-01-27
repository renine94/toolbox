"use client";

import { useTranslations } from "next-intl";
import { FileEdit } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Separator } from "@/shared/ui/separator";
import { useMetaStore } from "../model/useMetaStore";
import { checkCharacterLimit } from "../lib/meta-utils";
import { cn } from "@/shared/lib/utils";
import type { MetaTags } from "../model/types";

interface CharCountProps {
  text: string;
  platform: "google" | "facebook" | "twitter" | "linkedin" | "slack";
  field: "title" | "description";
}

function CharCount({ text, platform, field }: CharCountProps) {
  const { count, limit, isOver } = checkCharacterLimit(text, platform, field);

  return (
    <span
      className={cn(
        "text-xs",
        isOver ? "text-destructive" : "text-muted-foreground"
      )}
    >
      {count}/{limit}
    </span>
  );
}

export function MetaTagEditor() {
  const t = useTranslations("tools.metaTagPreviewer.ui");
  const { metaTags, setMetaTags } = useMetaStore();

  const handleChange = (field: keyof MetaTags, value: string) => {
    setMetaTags({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileEdit className="h-5 w-5" />
          {t("editor")}
        </CardTitle>
        <CardDescription>{t("editorDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 기본 메타 태그 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">{t("basicMeta")}</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">{t("title")}</Label>
              <CharCount text={metaTags.title} platform="google" field="title" />
            </div>
            <Input
              id="title"
              value={metaTags.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder={t("titlePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">{t("description")}</Label>
              <CharCount
                text={metaTags.description}
                platform="google"
                field="description"
              />
            </div>
            <Textarea
              id="description"
              value={metaTags.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              rows={3}
            />
          </div>
        </div>

        <Separator />

        {/* Open Graph 태그 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">{t("openGraphMeta")}</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ogTitle">og:title</Label>
              <CharCount
                text={metaTags.ogTitle}
                platform="facebook"
                field="title"
              />
            </div>
            <Input
              id="ogTitle"
              value={metaTags.ogTitle}
              onChange={(e) => handleChange("ogTitle", e.target.value)}
              placeholder={t("ogTitlePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ogDescription">og:description</Label>
              <CharCount
                text={metaTags.ogDescription}
                platform="facebook"
                field="description"
              />
            </div>
            <Textarea
              id="ogDescription"
              value={metaTags.ogDescription}
              onChange={(e) => handleChange("ogDescription", e.target.value)}
              placeholder={t("ogDescriptionPlaceholder")}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogImage">og:image</Label>
            <Input
              id="ogImage"
              value={metaTags.ogImage}
              onChange={(e) => handleChange("ogImage", e.target.value)}
              placeholder={t("ogImagePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogUrl">og:url</Label>
            <Input
              id="ogUrl"
              value={metaTags.ogUrl}
              onChange={(e) => handleChange("ogUrl", e.target.value)}
              placeholder={t("ogUrlPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteName">og:site_name</Label>
            <Input
              id="siteName"
              value={metaTags.siteName}
              onChange={(e) => handleChange("siteName", e.target.value)}
              placeholder={t("siteNamePlaceholder")}
            />
          </div>
        </div>

        <Separator />

        {/* Twitter 태그 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">{t("twitterMeta")}</h3>

          <div className="space-y-2">
            <Label htmlFor="twitterCard">twitter:card</Label>
            <Select
              value={metaTags.twitterCard}
              onValueChange={(value) =>
                handleChange("twitterCard", value as MetaTags["twitterCard"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">summary</SelectItem>
                <SelectItem value="summary_large_image">
                  summary_large_image
                </SelectItem>
                <SelectItem value="app">app</SelectItem>
                <SelectItem value="player">player</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="twitterTitle">twitter:title</Label>
              <CharCount
                text={metaTags.twitterTitle}
                platform="twitter"
                field="title"
              />
            </div>
            <Input
              id="twitterTitle"
              value={metaTags.twitterTitle}
              onChange={(e) => handleChange("twitterTitle", e.target.value)}
              placeholder={t("twitterTitlePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="twitterDescription">twitter:description</Label>
              <CharCount
                text={metaTags.twitterDescription}
                platform="twitter"
                field="description"
              />
            </div>
            <Textarea
              id="twitterDescription"
              value={metaTags.twitterDescription}
              onChange={(e) =>
                handleChange("twitterDescription", e.target.value)
              }
              placeholder={t("twitterDescriptionPlaceholder")}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitterImage">twitter:image</Label>
            <Input
              id="twitterImage"
              value={metaTags.twitterImage}
              onChange={(e) => handleChange("twitterImage", e.target.value)}
              placeholder={t("twitterImagePlaceholder")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
