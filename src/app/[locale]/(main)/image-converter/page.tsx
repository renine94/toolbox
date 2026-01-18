import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { ImageConverter } from "@/features/tools/image-converter";
import { generateToolMetadata } from "@/shared/lib/seo";
import { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "metadata.tools.imageConverter",
  });

  return generateToolMetadata({
    locale: locale as Locale,
    pathname: "/image-converter",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ImageConverterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: "metadata.tools.imageConverter",
  });

  return (
    <div className="container min-h-screen py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t("heading")}
        </h1>
        <p className="text-muted-foreground">{t("subheading")}</p>
      </div>
      <ImageConverter />
    </div>
  );
}
