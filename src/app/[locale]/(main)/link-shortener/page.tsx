import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LinkShortener } from "@/features/tools/link-shortener";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.tools.linkShortener' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function LinkShortenerPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'metadata.tools.linkShortener' });

    return (
        <div className="container py-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{t('heading')}</h1>
                <p className="text-muted-foreground mt-2">
                    {t('subheading')}
                </p>
            </div>
            <LinkShortener />
        </div>
    );
}
