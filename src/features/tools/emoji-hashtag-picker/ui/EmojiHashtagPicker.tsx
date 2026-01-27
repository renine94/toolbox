"use client";

import { useTranslations } from "next-intl";
import { Copy, Trash2, Smile, Hash } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { usePickerStore } from "../model/usePickerStore";
import { copyToClipboard } from "../lib/picker-utils";
import { EmojiPicker } from "./EmojiPicker";
import { HashtagPicker } from "./HashtagPicker";

export function EmojiHashtagPicker() {
  const t = useTranslations("tools.emojiHashtagPicker.ui");
  const tCommon = useTranslations("common.toast");

  const {
    activeTab,
    selectedEmojis,
    selectedHashtags,
    setActiveTab,
    removeEmoji,
    removeHashtag,
    clearSelectedEmojis,
    clearSelectedHashtags,
    getSelectedText,
    clearAll,
  } = usePickerStore();

  const handleCopy = async () => {
    const text = getSelectedText();
    if (!text) {
      toast.error(t("nothingToCopy"));
      return;
    }

    const success = await copyToClipboard(text);
    if (success) {
      toast.success(tCommon("copied"));
    } else {
      toast.error(tCommon("copyError"));
    }
  };

  const handleCopyEmojis = async () => {
    if (selectedEmojis.length === 0) {
      toast.error(t("nothingToCopy"));
      return;
    }

    const text = selectedEmojis.join("");
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(tCommon("copied"));
    } else {
      toast.error(tCommon("copyError"));
    }
  };

  const handleCopyHashtags = async () => {
    if (selectedHashtags.length === 0) {
      toast.error(t("nothingToCopy"));
      return;
    }

    const text = selectedHashtags.join(" ");
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(tCommon("copied"));
    } else {
      toast.error(tCommon("copyError"));
    }
  };

  const totalSelected = selectedEmojis.length + selectedHashtags.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Picker Area */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>{t("picker")}</CardTitle>
            <CardDescription>{t("pickerDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "emoji" | "hashtag")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="emoji" className="gap-2">
                  <Smile className="h-4 w-4" />
                  {t("tabs.emoji")}
                  {selectedEmojis.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedEmojis.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="hashtag" className="gap-2">
                  <Hash className="h-4 w-4" />
                  {t("tabs.hashtag")}
                  {selectedHashtags.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedHashtags.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="emoji" className="mt-0">
                <EmojiPicker />
              </TabsContent>

              <TabsContent value="hashtag" className="mt-0">
                <HashtagPicker />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Selection Area */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("selected")}</CardTitle>
                <CardDescription>
                  {t("selectedCount", { count: totalSelected })}
                </CardDescription>
              </div>
              {totalSelected > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-muted-foreground"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t("clearAll")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected Emojis */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t("tabs.emoji")}</span>
                {selectedEmojis.length > 0 && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyEmojis}
                      className="h-7 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSelectedEmojis}
                      className="h-7 px-2 text-muted-foreground"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="min-h-[60px] p-3 rounded-lg border bg-muted/50">
                {selectedEmojis.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedEmojis.map((emoji, index) => (
                      <button
                        key={`selected-emoji-${index}`}
                        type="button"
                        onClick={() => removeEmoji(emoji)}
                        className="text-2xl p-1 rounded hover:bg-destructive/20 transition-colors"
                        title={t("clickToRemove")}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {t("noEmojisSelected")}
                  </span>
                )}
              </div>
            </div>

            <Separator />

            {/* Selected Hashtags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t("tabs.hashtag")}</span>
                {selectedHashtags.length > 0 && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyHashtags}
                      className="h-7 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSelectedHashtags}
                      className="h-7 px-2 text-muted-foreground"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="min-h-[60px] p-3 rounded-lg border bg-muted/50">
                {selectedHashtags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedHashtags.map((tag, index) => (
                      <button
                        key={`selected-tag-${index}`}
                        type="button"
                        onClick={() => removeHashtag(tag)}
                        className="px-2 py-0.5 text-sm rounded-full bg-primary/10 text-primary hover:bg-destructive/20 hover:text-destructive transition-colors"
                        title={t("clickToRemove")}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {t("noHashtagsSelected")}
                  </span>
                )}
              </div>
            </div>

            <Separator />

            {/* Copy All Button */}
            <Button
              onClick={handleCopy}
              className="w-full"
              disabled={totalSelected === 0}
            >
              <Copy className="h-4 w-4 mr-2" />
              {t("copyAll")}
            </Button>

            {/* Preview */}
            {totalSelected > 0 && (
              <div className="p-3 rounded-lg border bg-background">
                <div className="text-xs text-muted-foreground mb-1">
                  {t("preview")}
                </div>
                <div className="text-sm break-all">{getSelectedText()}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
