import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { UuidGenerator } from "@/features/tools/uuid-generator";
import { generateToolMetadata } from '@/shared/lib/seo';
import { Locale } from '@/i18n/routing';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.tools.uuidGenerator' });

    return generateToolMetadata({
        locale: locale as Locale,
        pathname: '/uuid-generator',
        title: t('title'),
        description: t('description'),
    });
}

export default async function UuidGeneratorPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'metadata.tools.uuidGenerator' });

    return (
        <div className="container py-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{t('heading')}</h1>
                <p className="text-muted-foreground mt-2">
                    {t('subheading')}
                </p>
            </div>
            <UuidGenerator />
        </div>
    );
}
