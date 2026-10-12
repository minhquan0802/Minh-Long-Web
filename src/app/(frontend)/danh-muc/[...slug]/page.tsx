import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { type ListingParams, ProductListing } from '@/components/product/ProductListing'
import { PageHeader } from '@/components/ui'
import { mediaUrl } from '@/lib/format'
import { getCategoryTree } from '@/lib/payload'

type Props = { params: Promise<{ slug: string[] }>; searchParams: Promise<ListingParams> }

/** /danh-muc/laptop hoặc /danh-muc/laptop/laptop-gaming */
async function resolve(slugs: string[]) {
  const tree = await getCategoryTree()
  const root = tree.find((c) => c.slug === slugs[0])
  if (!root || slugs.length > 2) return null
  if (slugs.length === 1) return { root, current: root, children: root.children }
  const child = root.children.find((c) => c.slug === slugs[1])
  return child ? { root, current: child, children: [] } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await resolve((await params).slug)
  if (!found) return {}
  const { current } = found
  return {
    title: current.meta?.title || current.name,
    description: current.meta?.description || current.description || undefined,
    alternates: { canonical: `/danh-muc${current.breadcrumbs?.at(-1)?.url ?? `/${current.slug}`}` },
    openGraph: { images: mediaUrl(current.meta?.image ?? current.image, 'large') ?? undefined },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const slugs = (await params).slug
  const found = await resolve(slugs)
  if (!found) notFound()
  const { root, current, children } = found
  const isChild = current.id !== root.id

  return (
    <>
      <PageHeader
        crumbs={[
          { label: 'Sản phẩm', href: '/san-pham' },
          ...(isChild ? [{ label: root.name, href: `/danh-muc/${root.slug}` }] : []),
          { label: current.name },
        ]}
        title={current.name}
        description={current.description}
      >
        {(children.length > 0 || isChild) && (
          <nav className="mt-5 flex flex-wrap gap-2 text-sm" aria-label="Danh mục con">
            {(isChild ? root.children : children).map((c) => (
              <Link
                key={c.id}
                href={`/danh-muc/${root.slug}/${c.slug}`}
                aria-current={c.id === current.id ? 'page' : undefined}
                className={`rounded-box border px-3 py-1.5 ${
                  c.id === current.id
                    ? 'border-harbor bg-harbor text-white'
                    : 'border-line bg-white hover:border-sky'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        )}
      </PageHeader>
      <div className="container-x py-8">
        <ProductListing
          basePath={`/danh-muc/${slugs.join('/')}`}
          params={await searchParams}
          categoryIds={[current.id, ...children.map((c) => c.id)]}
        />
      </div>
    </>
  )
}
