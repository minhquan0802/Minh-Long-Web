import { MessageCircle, Phone, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { AddToCartPanel } from '@/components/cart/AddToCart'
import { ContactForm } from '@/components/forms/ContactForm'
import { Gallery } from '@/components/product/Gallery'
import { Price } from '@/components/product/Price'
import { ProductGrid } from '@/components/product/ProductCard'
import { Breadcrumbs, type Crumb } from '@/components/ui'
import { RichText } from '@/components/RichText'
import {
  PLACEHOLDER,
  asDoc,
  discountPercent,
  effectivePrice,
  formatVND,
  mediaUrl,
  STOCK_LABEL,
  telHref,
  zaloHref,
} from '@/lib/format'
import { getCategoryTree, getPayloadClient, getSiteSettings, PUBLISHED } from '@/lib/payload'
import type { Brand, Category, Media } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

const getProduct = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { and: [PUBLISHED, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug)
  if (!p) return {}
  const image = mediaUrl(p.meta?.image ?? p.images?.[0], 'large')
  return {
    title: p.meta?.title || p.name,
    description: p.meta?.description || p.shortDescription || undefined,
    alternates: { canonical: `/san-pham/${p.slug}` },
    openGraph: { type: 'website', images: image ? [image] : undefined },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug)
  if (!product) notFound()

  const [settings, tree, payload] = await Promise.all([
    getSiteSettings(),
    getCategoryTree(),
    getPayloadClient(),
  ])
  const category = asDoc<Category>(product.category)
  const brand = asDoc<Brand>(product.brand)
  const price = effectivePrice(product)
  const off = discountPercent(product)
  const phone = settings.hotlines?.[0]?.number
  const unavailable = product.stockStatus === 'out_of_stock'

  // Đường dẫn: Sản phẩm > Danh mục cha > Danh mục con > Tên sản phẩm
  const crumbs: Crumb[] = [{ label: 'Sản phẩm', href: '/san-pham' }]
  if (category) {
    const parent = tree.find((t) => t.children.some((c) => c.id === category.id))
    if (parent) crumbs.push({ label: parent.name, href: `/danh-muc/${parent.slug}` })
    crumbs.push({
      label: category.name,
      href: parent ? `/danh-muc/${parent.slug}/${category.slug}` : `/danh-muc/${category.slug}`,
    })
  }
  crumbs.push({ label: product.name })

  const images = (product.images ?? [])
    .map((m) => asDoc<Media>(m))
    .filter((m): m is Media => Boolean(m))
    .map((m) => ({ large: mediaUrl(m, 'large')!, thumb: mediaUrl(m, 'thumbnail')! }))
  if (!images.length) images.push({ large: PLACEHOLDER.square, thumb: PLACEHOLDER.square })

  const related = category
    ? await payload.find({
        collection: 'products',
        where: {
          and: [
            PUBLISHED,
            { category: { equals: category.id } },
            { id: { not_equals: product.id } },
          ],
        },
        limit: 5,
        depth: 1,
      })
    : null

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku ?? undefined,
    image: images.map((i) => `${siteUrl}${i.large}`),
    description: product.shortDescription ?? undefined,
    brand: brand ? { '@type': 'Brand', name: brand.name } : undefined,
    ...(price != null && {
      offers: {
        '@type': 'Offer',
        url: `${siteUrl}/san-pham/${product.slug}`,
        priceCurrency: 'VND',
        price,
        availability: unavailable ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      },
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-x py-5">
        <Breadcrumbs items={crumbs} />
      </div>

      <section className="container-x grid gap-8 pb-12 lg:grid-cols-[minmax(0,560px)_1fr] lg:gap-12">
        <Gallery images={images} alt={product.name} />

        <div>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            {brand && (
              <Link
                href={`/san-pham?hang=${brand.slug}`}
                className="font-semibold text-sky-ink hover:underline"
              >
                {brand.name}
              </Link>
            )}
            {product.sku && <span>Mã: {product.sku}</span>}
            {product.stockStatus && (
              <span className={unavailable ? 'text-danger' : 'text-ok'}>
                {STOCK_LABEL[product.stockStatus]}
              </span>
            )}
          </p>
          <h1 className="mt-2 text-[26px] font-bold text-harbor md:text-[32px]">{product.name}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 rounded-box border border-line bg-paper px-5 py-4">
            <Price price={product.price} salePrice={product.salePrice} size="lg" />
            {off > 0 && (
              <span className="flex flex-col gap-1">
                <span className="tag-sale w-fit">-{off}%</span>
                <span className="text-[13px] text-muted">
                  Tiết kiệm {formatVND(product.price! - product.salePrice!)}
                </span>
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-5 max-w-[60ch] text-[15.5px]">{product.shortDescription}</p>
          )}

          {product.specs && product.specs.length > 0 && (
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-[14.5px]">
              {product.specs.slice(0, 5).map((s) => (
                <div key={s.id} className="contents">
                  <dt className="text-muted">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6">
            {price != null ? (
              <AddToCartPanel
                disabled={unavailable}
                item={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price,
                  image: images[0]?.thumb ?? null,
                }}
              />
            ) : (
              <p className="mb-3 text-muted">
                Sản phẩm báo giá theo số lượng và cấu hình. Gọi hoặc nhắn Zalo để nhận giá tốt nhất.
              </p>
            )}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {phone && (
                <a href={telHref(phone)} className="btn btn-signal">
                  <Phone size={18} /> Gọi tư vấn {phone}
                </a>
              )}
              {settings.zalo && (
                <a
                  href={zaloHref(settings.zalo)}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-outline"
                >
                  <MessageCircle size={18} /> Nhắn Zalo
                </a>
              )}
            </div>
          </div>

          <ul className="mt-6 grid gap-3 border-t border-line pt-5 text-[14px] sm:grid-cols-3">
            <li className="flex gap-2.5">
              <ShieldCheck size={20} className="shrink-0 text-sky" aria-hidden />
              <span>Bảo hành {product.warranty ?? 'chính hãng'}</span>
            </li>
            <li className="flex gap-2.5">
              <Truck size={20} className="shrink-0 text-sky" aria-hidden />
              <Link href="/chinh-sach-van-chuyen" className="hover:text-sky-ink">
                Giao nhanh nội thành
              </Link>
            </li>
            <li className="flex gap-2.5">
              <RotateCcw size={20} className="shrink-0 text-sky" aria-hidden />
              <Link href="/chinh-sach-doi-tra" className="hover:text-sky-ink">
                Đổi mới 7 ngày nếu lỗi
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
          <div>
            <h2 className="section-title mb-5">Mô tả sản phẩm</h2>
            <RichText data={product.description} />
          </div>
          <aside className="space-y-8">
            {product.specs && product.specs.length > 0 && (
              <div>
                <h2 className="section-title mb-4">Thông số kỹ thuật</h2>
                <table className="w-full overflow-hidden rounded-box border border-line bg-white text-[14.5px]">
                  <tbody>
                    {product.specs.map((s) => (
                      <tr key={s.id} className="border-b border-line last:border-0">
                        <th
                          scope="row"
                          className="w-2/5 bg-paper px-4 py-2.5 text-left font-medium text-muted"
                        >
                          {s.label}
                        </th>
                        <td className="px-4 py-2.5">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="rounded-box border border-line bg-white p-5">
              <h2 className="font-display text-lg font-bold text-harbor">Cần báo giá số lượng?</h2>
              <p className="mt-1 mb-4 text-sm text-muted">
                Để lại số điện thoại, bộ phận bán hàng gọi lại trong giờ làm việc.
              </p>
              <ContactForm
                type="quote"
                productId={product.id}
                defaultMessage={`Báo giá: ${product.name}`}
                submitLabel="Gửi yêu cầu báo giá"
              />
            </div>
          </aside>
        </div>
      </section>

      {related && related.docs.length > 0 && (
        <section className="container-x py-12">
          <h2 className="section-title mb-6">Sản phẩm cùng loại</h2>
          <ProductGrid products={related.docs} />
        </section>
      )}
    </>
  )
}
