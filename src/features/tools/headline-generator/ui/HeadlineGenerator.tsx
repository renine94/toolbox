"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Sparkles, Heart } from "lucide-react";
import { HeadlineInput } from "./HeadlineInput";
import { VariationList } from "./VariationList";
import { FavoritesList } from "./FavoritesList";
import { useHeadlineStore } from "../model/useHeadlineStore";

export function HeadlineGenerator() {
  const t = useTranslations("tools.headlineGenerator.ui");
  const favorites = useHeadlineStore((state) => state.favorites);

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("inputTitle")}</CardTitle>
          <CardDescription>{t("inputDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <HeadlineInput />
        </CardContent>
      </Card>

      {/* Tabs for Variations and Favorites */}
      <Tabs defaultValue="variations" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="variations" className="gap-2">
            <Sparkles className="h-4 w-4" />
            {t("variationsTab")}
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Heart className="h-4 w-4" />
            {t("favoritesTab")}
            {favorites.length > 0 && (
              <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                {favorites.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="variations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("generatedHeadlines")}</CardTitle>
              <CardDescription>{t("generatedDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <VariationList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("savedFavorites")}</CardTitle>
              <CardDescription>{t("savedDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <FavoritesList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
