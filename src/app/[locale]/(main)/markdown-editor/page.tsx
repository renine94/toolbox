import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MarkdownEditor } from "@/features/tools/markdown-editor";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.tools.markdownEditor' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function MarkdownEditorPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'metadata.tools.markdownEditor' });

    return (
        <div className="container py-8 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2">{t('heading')}</h1>
                <p className="text-muted-foreground">
                    {t('subheading')}
                </p>
            </div>
            <MarkdownEditor />
        </div>
    );
}
