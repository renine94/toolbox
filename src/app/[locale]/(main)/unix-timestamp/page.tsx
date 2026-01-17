import { getTranslations, setRequestLocale } from 'next-intl/server';
import { UnixTimestamp } from '@/features/tools/unix-timestamp';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.tools.unixTimestamp' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function UnixTimestampPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'metadata.tools.unixTimestamp' });

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">{t('heading')}</h1>
                    <p className="text-muted-foreground">
                        {t('subheading')}
                    </p>
                </div>
                <UnixTimestamp />
            </main>
        </div>
    );
}
