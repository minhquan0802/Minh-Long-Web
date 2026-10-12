import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { RichText } from '@/components/RichText'
import { PageHeader } from '@/components/ui'
import { mediaUrl } from '@/lib/format'
import { getPayloadClient, PUBLISHED } from '@/lib/payload'

/** Trang tĩnh: /gioi-thieu, /chinh-sach-bao-hanh, ... */
type Props = { params: Promise<{ slug: string }> }

const getPage = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { and: [PUBLISHED, { slug: { equals: slug } }] },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPage((await params).slug)
  if (!p) return {}
  const image = mediaUrl(p.meta?.image ?? p.cover, 'large')
  return {
    title: p.meta?.title || p.title,
    description: p.meta?.description || undefined,
    alternates: { canonical: `/${p.slug}` },
    openGraph: { images: image ? [image] : undefined },
  }
}

export default async function StaticPage({ params }: Props) {
  const page = await getPage((await params).slug)
  if (!page) notFound()
  return (
    <>
      <PageHeader crumbs={[{ label: page.title }]} title={page.title} />
      <div className="container-x py-10">
        <RichText data={page.content} />
      </div>
    </>
  )
}
