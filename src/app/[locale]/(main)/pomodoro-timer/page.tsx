import { getTranslations, setRequestLocale } from "next-intl/server";
import { PomodoroTimer } from "@/features/tools/pomodoro-timer";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "metadata.tools.pomodoroTimer",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PomodoroTimerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "metadata.tools.pomodoroTimer",
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t("heading")}</h1>
        <p className="text-muted-foreground">{t("subheading")}</p>
      </div>
      <PomodoroTimer />
    </div>
  );
}
