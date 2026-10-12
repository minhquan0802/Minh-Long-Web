import Link from 'next/link'
import type { Where } from 'payload'

import { EmptyState, Pagination } from '@/components/ui'
import { getPayloadClient, PUBLISHED } from '@/lib/payload'

import { ProductGrid } from './ProductCard'

export type ListingParams = {
  hang?: string
  gia?: string
  'sap-xep'?: string
  trang?: string
  q?: string
}

const PRICE_RANGES = [
  { key: 'duoi-2tr', label: 'Dưới 2 triệu', min: 0, max: 2_000_000 },
  { key: '2-10tr', label: '2 – 10 triệu', min: 2_000_000, max: 10_000_000 },
  { key: '10-20tr', label: '10 – 20 triệu', min: 10_000_000, max: 20_000_000 },
  { key: 'tren-20tr', label: 'Trên 20 triệu', min: 20_000_000, max: undefined },
]

const SORTS = [
  { key: 'moi', label: 'Mới nhất', sort: '-createdAt' },
  { key: 'gia-tang', label: 'Giá thấp → cao', sort: 'price' },
  { key: 'gia-giam', label: 'Giá cao → thấp', sort: '-price' },
]

const PER_PAGE = 20

/**
 * Danh sách sản phẩm + bộ lọc hãng / khoảng giá / sắp xếp.
 * Bộ lọc là link thường (không cần JavaScript), Google cũng đọc được.
 */
export async function ProductListing({
  basePath,
  params,
  categoryIds,
}: {
  basePath: string
  params: ListingParams
  categoryIds?: number[]
}) {
  const payload = await getPayloadClient()
  const page = Math.max(1, Number(params.trang) || 1)
  const sort = SORTS.find((s) => s.key === params['sap-xep']) ?? SORTS[0]
  const range = PRICE_RANGES.find((r) => r.key === params.gia)

  const base: Where[] = [PUBLISHED]
  if (categoryIds?.length) base.push({ category: { in: categoryIds } })
  if (params.q) base.push({ or: [{ name: { like: params.q } }, { sku: { like: params.q } }] })

  // Hãng có trong phạm vi hiện tại (để bộ lọc chỉ hiện hãng có hàng)
  const scope = await payload.find({
    collection: 'products',
    where: { and: base },
    limit: 500,
    depth: 1,
    select: { brand: true },
  })
  const brandMap = new Map<string, { name: string; slug: string; count: number }>()
  for (const p of scope.docs) {
    if (p.brand && typeof p.brand === 'object') {
      const b = brandMap.get(p.brand.slug) ?? { name: p.brand.name, slug: p.brand.slug, count: 0 }
      b.count++
      brandMap.set(p.brand.slug, b)
    }
  }
  const brands = [...brandMap.values()].sort((a, b) => b.count - a.count)

  const where: Where[] = [...base]
  if (params.hang) where.push({ 'brand.slug': { equals: params.hang } })
  if (range) {
    where.push({ price: { greater_than_equal: range.min } })
    if (range.max) where.push({ price: { less_than: range.max } })
  }

  const result = await payload.find({
    collection: 'products',
    where: { and: where },
    sort: sort.sort,
    limit: PER_PAGE,
    page,
    depth: 1,
  })

  const link = (patch: Partial<ListingParams>) => {
    const next: Record<string, string | undefined> = { ...params, ...patch, trang: undefined }
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(next)) if (v) sp.set(k, v)
    const qs = sp.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }
  const hasFilter = Boolean(params.hang || params.gia)

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside aria-label="Bộ lọc" className="space-y-6 text-[14.5px]">
        <FilterGroup title="Hãng">
          <FilterLink href={link({ hang: undefined })} active={!params.hang}>
            Tất cả
          </FilterLink>
          {brands.map((b) => (
            <FilterLink key={b.slug} href={link({ hang: b.slug })} active={params.hang === b.slug}>
              {b.name} <span className="text-muted">({b.count})</span>
            </FilterLink>
          ))}
        </FilterGroup>
        <FilterGroup title="Khoảng giá">
          <FilterLink href={link({ gia: undefined })} active={!params.gia}>
            Tất cả
          </FilterLink>
          {PRICE_RANGES.map((r) => (
            <FilterLink key={r.key} href={link({ gia: r.key })} active={params.gia === r.key}>
              {r.label}
            </FilterLink>
          ))}
        </FilterGroup>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted">
            {params.q && (
              <>
                Kết quả cho <strong className="text-ink">“{params.q}”</strong>:{' '}
              </>
            )}
            {result.totalDocs} sản phẩm
            {hasFilter && (
              <Link
                href={link({ hang: undefined, gia: undefined })}
                className="ml-3 text-sky-ink underline"
              >
                Bỏ lọc
              </Link>
            )}
          </p>
          <div className="flex flex-wrap gap-1.5 text-sm" role="group" aria-label="Sắp xếp">
            {SORTS.map((s) => (
              <Link
                key={s.key}
                href={link({ 'sap-xep': s.key === 'moi' ? undefined : s.key })}
                aria-current={sort.key === s.key ? 'true' : undefined}
                className={`rounded-box border px-3 py-1.5 ${
                  sort.key === s.key
                    ? 'border-harbor bg-harbor text-white'
                    : 'border-line hover:border-sky'
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        {result.docs.length ? (
          <ProductGrid products={result.docs} priorityCount={4} />
        ) : (
          <EmptyState title="Chưa có sản phẩm phù hợp">
            Thử bỏ bớt bộ lọc, hoặc{' '}
            <Link href="/lien-he" className="text-sky-ink underline">
              gửi yêu cầu báo giá
            </Link>{' '}
            — chúng tôi tìm hàng giúp bạn.
          </EmptyState>
        )}

        <Pagination
          page={page}
          totalPages={result.totalPages}
          basePath={basePath}
          params={params}
        />
      </div>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-display text-[16px] font-semibold text-harbor">{title}</p>
      <ul className="flex flex-wrap gap-2 lg:block lg:space-y-0.5">{children}</ul>
    </div>
  )
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? 'true' : undefined}
        className={`block rounded-box border px-3 py-1.5 lg:border-0 lg:px-2 lg:py-1 ${
          active
            ? 'border-sky bg-sky-wash font-semibold text-sky-ink'
            : 'border-line hover:text-sky-ink'
        }`}
      >
        {children}
      </Link>
    </li>
  )
}
