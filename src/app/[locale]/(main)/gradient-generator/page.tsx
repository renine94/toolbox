import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GradientGenerator } from "@/features/tools/gradient-generator";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.tools.gradientGenerator' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function GradientGeneratorPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'metadata.tools.gradientGenerator' });

    return (
        <div className="container py-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">{t('heading')}</h1>
                <p className="text-muted-foreground">
                    {t('subheading')}
                </p>
            </div>
            <GradientGenerator />
        </div>
    );
}
