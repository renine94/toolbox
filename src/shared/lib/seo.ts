import { Metadata } from 'next';
import { routing, Locale } from '@/i18n/routing';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolbox-six-sigma.vercel.app';

/**
 * locale 코드를 OpenGraph locale 형식으로 변환
 * @example 'ko' -> 'ko_KR', 'en' -> 'en_US'
 */
const localeToOGLocale: Record<Locale, string> = {
  ko: 'ko_KR',
  en: 'en_US',
  zh: 'zh_CN',
  ja: 'ja_JP',
};

/**
 * pathname과 locale을 결합하여 전체 URL 생성
 */
export function generateFullUrl(locale: Locale, pathname: string = ''): string {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${BASE_URL}/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * 현재 페이지의 canonical URL 생성
 */
export function generateCanonicalUrl(locale: Locale, pathname: string = ''): string {
  return generateFullUrl(locale, pathname);
}

/**
 * 모든 지원 언어에 대한 hreflang alternate 링크 생성
 * @returns languages 객체와 x-default 포함
 */
export function generateAlternateLanguages(pathname: string = ''): {
  canonical: string;
  languages: Record<string, string>;
} {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[locale] = generateFullUrl(locale as Locale, pathname);
  }

  // x-default는 기본 locale을 가리킴
  languages['x-default'] = generateFullUrl(routing.defaultLocale as Locale, pathname);

  // canonical은 기본 locale URL
  const canonical = generateFullUrl(routing.defaultLocale as Locale, pathname);

  return { canonical, languages };
}

interface ToolMetadataOptions {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  keywords?: string[];
}

/**
 * 도구 페이지용 완전한 Metadata 생성
 * canonical, alternates, openGraph 모두 포함
 */
export function generateToolMetadata({
  locale,
  pathname,
  title,
  description,
  keywords,
}: ToolMetadataOptions): Metadata {
  const canonicalUrl = generateCanonicalUrl(locale, pathname);
  const { languages } = generateAlternateLanguages(pathname);

  // 현재 locale 외의 다른 locale들을 alternate로 설정
  const alternateLocales = routing.locales
    .filter((l) => l !== locale)
    .map((l) => localeToOGLocale[l as Locale]);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ToolBox',
      locale: localeToOGLocale[locale],
      alternateLocale: alternateLocales,
      type: 'website',
      images: [
        {
          url: '/og.webp',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.webp'],
    },
  };
}

interface HomeMetadataOptions {
  locale: Locale;
  title: string;
  description: string;
  keywords?: string[];
}

/**
 * 홈 페이지용 완전한 Metadata 생성
 */
export function generateHomeMetadata({
  locale,
  title,
  description,
  keywords,
}: HomeMetadataOptions): Metadata {
  const canonicalUrl = generateCanonicalUrl(locale, '');
  const { languages } = generateAlternateLanguages('');

  const alternateLocales = routing.locales
    .filter((l) => l !== locale)
    .map((l) => localeToOGLocale[l as Locale]);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ToolBox',
      locale: localeToOGLocale[locale],
      alternateLocale: alternateLocales,
      type: 'website',
      images: [
        {
          url: '/og.webp',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.webp'],
    },
  };
}
