import { Check, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { BannerSlider } from '@/components/BannerSlider'
import { RepairTicket } from '@/components/forms/RepairTicket'
import { ProductGrid } from '@/components/product/ProductCard'
import { SERVICE_ICONS } from '@/components/ui'
import { asDoc, formatDate, mediaUrl, PLACEHOLDER, telHref } from '@/lib/format'
import {
  getCategoryTree,
  getHomepage,
  getPayloadClient,
  getSiteSettings,
  PUBLISHED,
} from '@/lib/payload'
import type { Category, Media, Product } from '@/payload-types'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [home, settings, tree] = await Promise.all([
    getHomepage(),
    getSiteSettings(),
    getCategoryTree(),
  ])
  const banners = (home.banners ?? [])
    .map((m) => asDoc<Media>(m))
    .filter((m): m is Media => Boolean(m?.url))
    .map((m) => ({ src: mediaUrl(m, 'large') ?? mediaUrl(m)!, alt: m.alt ?? '' }))
  const phone = settings.hotlines?.[0]?.number

  const featuredIds = (home.featuredProducts ?? []).map((p) => (typeof p === 'object' ? p.id : p))
  const [featured, services, latestPosts, brands] = await Promise.all([
    payload.find({
      collection: 'products',
      where: featuredIds.length
        ? { and: [PUBLISHED, { id: { in: featuredIds } }] }
        : { and: [PUBLISHED, { featured: { equals: true } }] },
      limit: 10,
      depth: 1,
    }),
    payload.find({
      collection: 'services',
      where: { and: [PUBLISHED, { featured: { equals: true } }] },
      sort: 'order',
      limit: 6,
      depth: 0,
    }),
    payload.find({
      collection: 'posts',
      where: PUBLISHED,
      sort: '-publishedAt',
      limit: 4,
      depth: 1,
    }),
    payload.find({
      collection: 'brands',
      where: { featured: { equals: true } },
      limit: 14,
      depth: 1,
    }),
  ])

  // Mỗi danh mục nổi bật: lấy sản phẩm của nó + danh mục con
  const featuredCats = (home.featuredCategories ?? []).filter(
    (c): c is Category => typeof c === 'object',
  )
  const catBlocks = await Promise.all(
    featuredCats.map(async (cat) => {
      const node = tree.find((t) => t.id === cat.id)
      const ids = [cat.id, ...(node?.children.map((c) => c.id) ?? [])]
      const { docs } = await payload.find({
        collection: 'products',
        where: { and: [PUBLISHED, { category: { in: ids } }] },
        limit: 5,
        sort: '-featured',
        depth: 1,
      })
      return { cat, children: node?.children ?? [], products: docs as Product[] }
    }),
  )

  return (
    <>
      {/* HERO: lời mời + phiếu yêu cầu kỹ thuật */}
      <section className="dot-grid relative overflow-hidden bg-harbor text-white [--dot:#1a4a63]">
        <div className="container-x grid items-center gap-10 py-10 md:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-16">
          <div>
            <h1 className="max-w-[18ch] text-[32px] font-bold sm:text-[40px] lg:text-[50px]">
              {home.heroTitle || settings.tagline}
            </h1>
            {home.heroSubtitle && (
              <p className="mt-5 max-w-[52ch] text-[16.5px] text-white/80">{home.heroSubtitle}</p>
            )}
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              {phone && (
                <a href={telHref(phone)} className="btn btn-signal h-12 px-6 text-base">
                  <Phone size={18} /> Gọi {phone}
                </a>
              )}
              <Link
                href={home.heroCtaLink || '/dich-vu'}
                className="btn btn-ghost-light h-12 px-6 text-base"
              >
                {home.heroCtaLabel || 'Xem dịch vụ'}
              </Link>
            </div>
            {home.reasons && home.reasons.length > 0 && (
              <ul className="mt-9 grid max-w-[560px] gap-x-6 gap-y-2.5 text-[14.5px] text-white/85 sm:grid-cols-2">
                {home.reasons.slice(0, 4).map((r) => (
                  <li key={r.id} className="flex items-start gap-2">
                    <Check size={17} className="mt-0.5 shrink-0 text-signal" aria-hidden />
                    {r.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="lg:pl-4">
            <RepairTicket />
          </div>
        </div>
      </section>

      {/* Banner quảng cáo (chọn nhiều ảnh trong admin) */}
      <BannerSlider banners={banners} />

      {/* Danh mục */}
      <section className="border-b border-line">
        <div className="container-x py-6">
          <ul className="flex snap-x gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-9 md:overflow-visible">
            {tree.map((c) => (
              <li key={c.id} className="w-[104px] shrink-0 snap-start md:w-auto">
                <Link
                  href={`/danh-muc/${c.slug}`}
                  className="group flex flex-col items-center gap-2 text-center"
                >
                  <span className="relative block aspect-square w-full overflow-hidden rounded-box border border-line bg-paper transition-colors group-hover:border-sky">
                    <Image
                      src={mediaUrl(c.image, 'thumbnail') ?? PLACEHOLDER.square}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </span>
                  <span className="text-[13.5px] leading-tight font-medium text-ink group-hover:text-sky-ink">
                    {c.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sản phẩm tiêu biểu */}
      {featured.docs.length > 0 && (
        <section className="container-x py-12">
          <SectionHead title="Sản phẩm tiêu biểu" href="/san-pham" />
          <ProductGrid products={featured.docs} priorityCount={5} />
        </section>
      )}

      {/* Khối theo danh mục */}
      {catBlocks.map(({ cat, children, products }, i) =>
        products.length ? (
          <section key={cat.id} className={i % 2 === 0 ? 'bg-paper' : ''}>
            <div className="container-x py-12">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                <h2 className="section-title">{cat.name}</h2>
                <nav
                  className="flex flex-wrap items-center gap-2 text-sm"
                  aria-label={`Danh mục con của ${cat.name}`}
                >
                  {children.map((ch) => (
                    <Link
                      key={ch.id}
                      href={`/danh-muc/${cat.slug}/${ch.slug}`}
                      className="rounded-box border border-line bg-white px-3 py-1.5 hover:border-sky hover:text-sky-ink"
                    >
                      {ch.name}
                    </Link>
                  ))}
                  <Link
                    href={`/danh-muc/${cat.slug}`}
                    className="px-2 py-1.5 font-semibold text-sky-ink hover:underline"
                  >
                    Xem tất cả
                  </Link>
                </nav>
              </div>
              <ProductGrid products={products} />
            </div>
          </section>
        ) : null,
      )}

      {/* Dịch vụ: dạng danh sách, không phải lưới thẻ */}
      {services.docs.length > 0 && (
        <section className="container-x py-14">
          <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
            <div>
              <h2 className="section-title">Dịch vụ kỹ thuật</h2>
              <p className="mt-3 text-muted">
                Sửa chữa tại cửa hàng hoặc tận nơi. Kiểm tra miễn phí, báo giá rõ ràng, chỉ làm khi
                bạn đồng ý.
              </p>
              <Link href="/dich-vu" className="btn btn-outline mt-6">
                Tất cả dịch vụ
              </Link>
            </div>
            <ul className="grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
              {services.docs.map((s) => {
                const Icon = SERVICE_ICONS[s.icon ?? 'wrench']
                return (
                  <li key={s.id} className="border-b border-line">
                    <Link href={`/dich-vu/${s.slug}`} className="group flex gap-4 py-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-box bg-sky-wash text-sky-ink">
                        <Icon size={21} strokeWidth={1.7} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-harbor group-hover:text-sky-ink">
                          {s.title}
                        </span>
                        <span className="mt-1 line-clamp-2 block text-[14px] text-muted">
                          {s.summary}
                        </span>
                        {s.priceFrom && (
                          <span className="mt-2 inline-block text-[13px] font-semibold text-ink">
                            {s.priceFrom}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Giới thiệu + số liệu */}
      {(home.aboutTitle || home.stats?.length) && (
        <section className="bg-paper">
          <div className="container-x grid gap-10 py-14 lg:grid-cols-2 lg:items-center">
            <div>
              {home.aboutTitle && <h2 className="section-title max-w-[22ch]">{home.aboutTitle}</h2>}
              {home.aboutText && (
                <p className="mt-4 max-w-[60ch] text-[16px] text-ink/85">{home.aboutText}</p>
              )}
              <Link
                href="/gioi-thieu"
                className="mt-6 inline-block font-semibold text-sky-ink hover:underline"
              >
                Về Minh Long
              </Link>
            </div>
            {home.stats && home.stats.length > 0 && (
              <dl className="grid grid-cols-2 border-t border-l border-line bg-white">
                {home.stats.map((s) => (
                  <div key={s.id} className="border-r border-b border-line p-5 md:p-6">
                    <dt className="text-[14px] text-muted">{s.label}</dt>
                    <dd className="mt-1 font-display text-[30px] font-bold text-harbor md:text-[36px]">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
      )}

      {/* Thương hiệu */}
      {brands.docs.length > 0 && (
        <section className="border-y border-line">
          <div className="container-x py-8">
            <h2 className="sr-only">Thương hiệu phân phối</h2>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
              {brands.docs.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/san-pham?hang=${b.slug}`}
                    className="flex h-14 items-center justify-center rounded-box border border-line bg-white px-3 opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
                    title={b.name}
                  >
                    {mediaUrl(b.logo, 'card') ? (
                      <Image
                        src={mediaUrl(b.logo, 'card')!}
                        alt={b.name}
                        width={120}
                        height={60}
                        className="h-9 w-auto object-contain"
                      />
                    ) : (
                      <span className="font-semibold">{b.name}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Bài viết mới */}
      {latestPosts.docs.length > 0 && (
        <section className="container-x py-14">
          <SectionHead title="Tin tức & hướng dẫn" href="/tin-tuc" />
          <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
            {latestPosts.docs.slice(0, 1).map((p) => (
              <Link key={p.id} href={`/bai-viet/${p.slug}`} className="group block">
                <span className="relative block aspect-[16/9] overflow-hidden rounded-box bg-harbor">
                  <Image
                    src={mediaUrl(p.cover, 'large') ?? PLACEHOLDER.wide}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 640px, 100vw"
                    className="object-cover"
                  />
                </span>
                <p className="mt-4 text-[13px] text-muted">{formatDate(p.publishedAt)}</p>
                <h3 className="mt-1 text-[22px] font-bold text-harbor group-hover:text-sky-ink">
                  {p.title}
                </h3>
                {p.excerpt && <p className="mt-2 text-muted">{p.excerpt}</p>}
              </Link>
            ))}
            <ul className="divide-y divide-line">
              {latestPosts.docs.slice(1).map((p) => (
                <li key={p.id}>
                  <Link href={`/bai-viet/${p.slug}`} className="group flex gap-4 py-4 first:pt-0">
                    <span className="relative block aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-box bg-harbor">
                      <Image
                        src={mediaUrl(p.cover, 'card') ?? PLACEHOLDER.wide}
                        alt=""
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </span>
                    <span>
                      <span className="block text-[13px] text-muted">
                        {formatDate(p.publishedAt)}
                      </span>
                      <span className="mt-1 line-clamp-3 block font-semibold text-harbor group-hover:text-sky-ink">
                        {p.title}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}

function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="section-title">{title}</h2>
      <Link href={href} className="text-sm font-semibold text-sky-ink hover:underline">
        Xem tất cả
      </Link>
    </div>
  )
}
