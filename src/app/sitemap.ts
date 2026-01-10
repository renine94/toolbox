import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

function getToolSlugs(): string[] {
  const mainDir = path.join(process.cwd(), 'src/app/(main)')
  const entries = fs.readdirSync(mainDir, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => entry.name)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolbox-six-sigma.vercel.app'
  const tools = getToolSlugs()

  console.log(tools);

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
