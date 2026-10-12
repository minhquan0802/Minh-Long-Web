import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Category } from '@/payload-types'

export const getPayloadClient = () => getPayload({ config })

const PUBLISHED = { _status: { equals: 'published' } } as const

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getHomepage = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'homepage', depth: 1 })
})

export type CategoryNode = Category & { children: Category[] }

/** Toàn bộ danh mục, gom thành cây 2 cấp cho menu. */
export const getCategoryTree = cache(async (): Promise<CategoryNode[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    limit: 200,
    sort: 'order',
    depth: 1,
  })
  const parentId = (c: Category) => (typeof c.parent === 'object' ? c.parent?.id : c.parent)
  return docs
    .filter((c) => !parentId(c))
    .map((root) => ({ ...root, children: docs.filter((c) => parentId(c) === root.id) }))
})

export const getPolicyPages = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { and: [PUBLISHED, { isPolicy: { equals: true } }] },
    limit: 20,
    select: { title: true, slug: true },
  })
  return docs
})

export { PUBLISHED }
