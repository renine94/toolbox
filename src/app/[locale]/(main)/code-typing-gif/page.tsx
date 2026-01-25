import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CodeTypingGif } from '@/features/tools/code-typing-gif';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.tools.codeTypingGif' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function CodeTypingGifPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'metadata.tools.codeTypingGif' });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t('heading')}</h1>
        <p className="text-muted-foreground">{t('subheading')}</p>
      </div>
      <CodeTypingGif />
    </div>
  );
}
