"use client";

import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { useMetaStore } from "../model/useMetaStore";
import { GooglePreview } from "./GooglePreview";
import { FacebookPreview } from "./FacebookPreview";
import { TwitterPreview } from "./TwitterPreview";
import { LinkedInPreview } from "./LinkedInPreview";
import { SlackPreview } from "./SlackPreview";
import type { PreviewTab } from "../model/types";

export function PreviewTabs() {
  const t = useTranslations("tools.metaTagPreviewer.ui");
  const { activeTab, setActiveTab } = useMetaStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          {t("preview")}
        </CardTitle>
        <CardDescription>{t("previewDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as PreviewTab)}
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="slack">Slack</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="google" className="mt-0">
              <GooglePreview />
            </TabsContent>

            <TabsContent value="facebook" className="mt-0">
              <FacebookPreview />
            </TabsContent>

            <TabsContent value="twitter" className="mt-0">
              <TwitterPreview />
            </TabsContent>

            <TabsContent value="linkedin" className="mt-0">
              <LinkedInPreview />
            </TabsContent>

            <TabsContent value="slack" className="mt-0">
              <SlackPreview />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
