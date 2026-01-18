import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { QRGenerator } from "@/features/tools/qr-generator";
import { generateToolMetadata } from '@/shared/lib/seo';
import { Locale } from '@/i18n/routing';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.tools.qrGenerator' });

    return generateToolMetadata({
        locale: locale as Locale,
        pathname: '/qr-generator',
        title: t('title'),
        description: t('description'),
    });
}

export default async function QRGeneratorPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'metadata.tools.qrGenerator' });

    return (
        <div className="container py-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{t('heading')}</h1>
                <p className="text-muted-foreground">
                    {t('subheading')}
                </p>
            </div>
            <QRGenerator />
        </div>
    );
}
