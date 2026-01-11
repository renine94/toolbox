import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ColorPicker } from '@/features/tools/color-picker';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.tools.colorPicker' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function ColorPickerPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'metadata.tools.colorPicker' });

    return (
        <div className="container py-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">{t('heading')}</h1>
                <p className="text-muted-foreground">
                    {t('subheading')}
                </p>
            </div>
            <ColorPicker />
        </div>
    );
}
