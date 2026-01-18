import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { UnitConverter } from '@/features/tools/unit-converter';
import { generateToolMetadata } from '@/shared/lib/seo';
import { Locale } from '@/i18n/routing';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.tools.unitConverter' });

    return generateToolMetadata({
        locale: locale as Locale,
        pathname: '/unit-converter',
        title: t('title'),
        description: t('description'),
    });
}

export default async function UnitConverterPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'metadata.tools.unitConverter' });

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8 text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">📐 {t('heading')}</h1>
                    <p className="text-muted-foreground">
                        {t('subheading')}
                    </p>
                </div>
                <div className="max-w-3xl mx-auto">
                    <UnitConverter />
                </div>
            </main>
        </div>
    );
}
