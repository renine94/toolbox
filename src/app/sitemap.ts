import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolbox-six-sigma.vercel.app'

  const tools = [
    'json-formatter',
    'base64-encoder',
    'code-runner',
    'color-picker',
    'color-palette',
    'gradient-generator',
    'image-editor',
    'markdown-editor',
    'password-generator',
    'qr-generator',
    'regex-tester',
    'word-counter',
  ]

  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...toolPages,
  ]
}
