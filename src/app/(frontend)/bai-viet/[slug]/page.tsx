import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { NEWS_HUB, POST_SECTIONS, PostTeaser } from '@/components/PostList'
import { ProductGrid } from '@/components/product/ProductCard'
import { RichText } from '@/components/RichText'
import { Breadcrumbs } from '@/components/ui'
import { asDoc, formatDate, mediaUrl, PLACEHOLDER } from '@/lib/format'
import { getPayloadClient, PUBLISHED } from '@/lib/payload'
import type { Product, User } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

const getPost = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [PUBLISHED, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPost((await params).slug)
  if (!p) return {}
  const image = mediaUrl(p.meta?.image ?? p.cover, 'large')
  return {
    title: p.meta?.title || p.title,
    description: p.meta?.description || p.excerpt || undefined,
    alternates: { canonical: `/bai-viet/${p.slug}` },
    openGraph: {
      type: 'article',
      publishedTime: p.publishedAt ?? undefined,
      images: image ? [image] : undefined,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug)
  if (!post) notFound()

  const section = POST_SECTIONS[post.type]
  const author = asDoc<User>(post.author)
  const cover = mediaUrl(post.cover, 'large') ?? PLACEHOLDER.wide
  const promoProducts = (post.promoProducts ?? []).filter(
    (p): p is Product => typeof p === 'object' && p._status === 'published',
  )
  const payload = await getPayloadClient()
  const related = await payload.find({
    collection: 'posts',
    where: { and: [PUBLISHED, { type: { equals: post.type } }, { id: { not_equals: post.id } }] },
    sort: '-publishedAt',
    limit: 3,
    depth: 1,
  })

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    image: cover ? `${siteUrl}${cover}` : undefined,
    author: author ? { '@type': 'Person', name: author.name } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container-x max-w-[820px] py-8">
        <Breadcrumbs
          items={[
            { label: NEWS_HUB.title, href: NEWS_HUB.path },
            { label: section.title, href: section.path },
            { label: post.title },
          ]}
        />
        <h1 className="mt-5 text-[28px] font-bold text-harbor md:text-[38px]">{post.title}</h1>
        <p className="mt-3 text-sm text-muted">
          {formatDate(post.publishedAt)}
          {author?.name && <> · {author.name}</>}
        </p>
        {post.type === 'khuyen-mai' && (post.promoStart || post.promoEnd) && (
          <p className="mt-4 inline-block rounded-tag bg-signal-wash px-3 py-1.5 font-semibold text-harbor">
            Thời gian: {formatDate(post.promoStart)} – {formatDate(post.promoEnd)}
          </p>
        )}
        {cover && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-panel bg-harbor">
            <Image
              src={cover}
              alt=""
              fill
              priority
              sizes="(min-width: 820px) 780px, 100vw"
              className="object-cover"
            />
          </div>
        )}
        {post.excerpt && (
          <p className="mt-6 text-[18px] leading-relaxed font-medium text-ink/90">{post.excerpt}</p>
        )}
        <RichText data={post.content} className="mt-6" />
      </article>

      {promoProducts.length > 0 && (
        <section className="bg-paper">
          <div className="container-x py-12">
            <h2 className="section-title mb-6">Sản phẩm áp dụng</h2>
            <ProductGrid products={promoProducts} />
          </div>
        </section>
      )}

      {related.docs.length > 0 && (
        <section className="container-x border-t border-line py-12">
          <h2 className="section-title mb-6">Bài cùng chuyên mục</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.docs.map((p) => (
              <li key={p.id}>
                <PostTeaser post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
