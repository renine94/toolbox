import { getTranslations, setRequestLocale } from 'next-intl/server';
import { WordCounter } from '@/features/tools/word-counter';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.tools.wordCounter' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function WordCounterPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'metadata.tools.wordCounter' });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t('heading')}</h1>
            <p className="text-muted-foreground mb-8">
                {t('subheading')}
            </p>
            <WordCounter />
        </div>
    );
}
