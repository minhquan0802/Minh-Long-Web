import type { MetadataRoute } from 'next'

import { NEWS_HUB, POST_SECTIONS } from '@/components/PostList'
import { getCategoryTree, getPayloadClient, PUBLISHED } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const payload = await getPayloadClient()
  const opts = {
    where: PUBLISHED,
    limit: 5000,
    depth: 0,
    select: { slug: true, updatedAt: true },
  } as const

  const [products, services, posts, pages, tree] = await Promise.all([
    payload.find({ collection: 'products', ...opts }),
    payload.find({ collection: 'services', ...opts }),
    payload.find({ collection: 'posts', ...opts }),
    payload.find({ collection: 'pages', ...opts }),
    getCategoryTree(),
  ])

  const fixed = [
    '',
    '/san-pham',
    '/dich-vu',
    '/lien-he',
    NEWS_HUB.path,
    ...Object.values(POST_SECTIONS).map((s) => s.path),
  ]
  const entry = (path: string, lastModified?: string) => ({ url: `${base}${path}`, lastModified })

  return [
    ...fixed.map((p) => entry(p)),
    ...tree.flatMap((c) => [
      entry(`/danh-muc/${c.slug}`),
      ...c.children.map((ch) => entry(`/danh-muc/${c.slug}/${ch.slug}`)),
    ]),
    ...products.docs.map((d) => entry(`/san-pham/${d.slug}`, d.updatedAt)),
    ...services.docs.map((d) => entry(`/dich-vu/${d.slug}`, d.updatedAt)),
    ...posts.docs.map((d) => entry(`/bai-viet/${d.slug}`, d.updatedAt)),
    ...pages.docs.map((d) => entry(`/${d.slug}`, d.updatedAt)),
  ]
}
