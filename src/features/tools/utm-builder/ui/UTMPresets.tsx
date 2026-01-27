"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Star, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/shared/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useUTMStore } from "../model/useUTMStore";
import { DEFAULT_PRESETS, type UTMParams } from "../model/types";

export function UTMPresets() {
  const t = useTranslations("tools.utmBuilder.ui");
  const tCommon = useTranslations("common");
  const { params, customPresets, applyPreset, savePreset, deletePreset } =
    useUTMStore();
  const [newPresetName, setNewPresetName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const handleApplyPreset = (presetParams: UTMParams) => {
    applyPreset(presetParams);
    toast.success(t("presetApplied"));
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) {
      toast.error(t("presetNameRequired"));
      return;
    }

    if (!params.utm_source || !params.utm_medium || !params.utm_campaign) {
      toast.error(t("fillRequiredFirst"));
      return;
    }

    savePreset(newPresetName.trim());
    setNewPresetName("");
    setSaveDialogOpen(false);
    toast.success(tCommon("toast.saved"));
  };

  const handleDeletePreset = (id: string) => {
    deletePreset(id);
    toast.success(tCommon("toast.deleted"));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              {t("presets")}
            </CardTitle>
            <CardDescription>{t("presetsDescription")}</CardDescription>
          </div>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                {t("savePreset")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("saveCurrentAsPreset")}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder={t("presetNamePlaceholder")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSavePreset();
                    }
                  }}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{tCommon("buttons.close")}</Button>
                </DialogClose>
                <Button onClick={handleSavePreset}>
                  {tCommon("buttons.save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 커스텀 프리셋 */}
        {customPresets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              {t("customPresets")}
            </h4>
            <ScrollArea className="h-auto max-h-[200px]">
              <div className="grid gap-2">
                {customPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Button
                      variant="ghost"
                      className="flex-1 justify-start h-auto py-1 px-2"
                      onClick={() => handleApplyPreset(preset.params)}
                    >
                      <div className="text-left">
                        <p className="font-medium">{preset.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {preset.params.utm_source} / {preset.params.utm_medium}
                        </p>
                      </div>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("deletePresetConfirm")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deletePresetDescription")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {tCommon("buttons.close")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePreset(preset.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {tCommon("buttons.delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* 기본 프리셋 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{t("defaultPresets")}</h4>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_PRESETS.map((preset, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-accent transition-colors py-1.5 px-3"
                onClick={() => handleApplyPreset(preset.params)}
              >
                {preset.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
