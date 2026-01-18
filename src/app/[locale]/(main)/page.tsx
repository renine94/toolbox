import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { HomeContent } from '@/features/home';
import { generateHomeMetadata } from '@/shared/lib/seo';
import { Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

const HOME_KEYWORDS = [
  'toolbox',
  '도구',
  '개발자',
  '디자이너',
  'JSON',
  'Color Picker',
  '온라인 도구',
  'base64',
  'qr code',
  'code runner',
  'regex tester',
  'color palette',
  'image editor',
  'gradient generator',
  'link shortener',
  'markdown editor',
  'word counter',
  'lorem ipsum generator',
  'unit converter',
  'timezone converter',
  'password generator',
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });

  return generateHomeMetadata({
    locale: locale as Locale,
    title: t('title'),
    description: t('description'),
    keywords: HOME_KEYWORDS,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}
