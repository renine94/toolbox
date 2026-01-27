import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { EmojiHashtagPicker } from "@/features/tools/emoji-hashtag-picker";
import { generateToolMetadata } from "@/shared/lib/seo";
import { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "metadata.tools.emojiHashtagPicker",
  });

  return generateToolMetadata({
    locale: locale as Locale,
    pathname: "/emoji-hashtag-picker",
    title: t("title"),
    description: t("description"),
  });
}

export default async function EmojiHashtagPickerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: "metadata.tools.emojiHashtagPicker",
  });

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("heading")}</h1>
        <p className="text-muted-foreground">{t("subheading")}</p>
      </div>
      <EmojiHashtagPicker />
    </div>
  );
}
