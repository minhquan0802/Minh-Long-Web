import { Clock, Phone, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { CartButton } from '@/components/cart/CartButton'
import { mediaUrl, telHref } from '@/lib/format'
import { getCategoryTree, getSiteSettings } from '@/lib/payload'

import { CategoryMenu, type MenuCategory } from './CategoryMenu'
import { MobileMenu } from './MobileMenu'
import { StickyNav } from './StickyNav'

export const NAV_LINKS = [
  { href: '/san-pham', label: 'Sản phẩm' },
  { href: '/dich-vu', label: 'Dịch vụ sửa chữa' },
  { href: '/khuyen-mai', label: 'Khuyến mãi' },
  { href: '/giai-phap', label: 'Giải pháp' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/ho-tro', label: 'Hỗ trợ' },
  { href: '/gioi-thieu', label: 'Giới thiệu' },
  { href: '/lien-he', label: 'Liên hệ' },
]

export async function Header() {
  const [settings, tree] = await Promise.all([getSiteSettings(), getCategoryTree()])
  const logo = mediaUrl(settings.logo, 'thumbnail')
  const hotline = settings.hotlines?.[0]
  const techLine = settings.hotlines?.find((h) => /kỹ thuật/i.test(h.label ?? '')) ?? hotline

  const menu: MenuCategory[] = tree
    .filter((c) => c.showInMenu !== false)
    .map((c) => ({
      name: c.name,
      href: `/danh-muc/${c.slug}`,
      image: mediaUrl(c.image, 'thumbnail'),
      children: c.children.map((ch) => ({ name: ch.name, href: `/danh-muc/${c.slug}/${ch.slug}` })),
    }))

  return (
    // Các hàng là phần tử ngang hàng (không bọc chung) để thanh menu "dính" được suốt trang
    <>
      {/* Dải thông tin — cuộn đi bình thường */}
      <div className="bg-harbor-deep text-[13px] text-white/80">
        <div className="container-x flex h-9 items-center justify-between gap-4">
          <p className="truncate">{settings.tagline}</p>
          <div className="hidden items-center gap-5 md:flex">
            {settings.workingHours && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} aria-hidden /> {settings.workingHours}
              </span>
            )}
            {settings.hotlines?.map((h) => (
              <a key={h.id} href={telHref(h.number)} className="hover:text-white">
                {h.label ? `${h.label}: ` : ''}
                <span className="font-semibold text-white">{h.number}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Logo + tìm kiếm. Mobile: hàng này dính ở đầu màn hình khi cuộn */}
      <header className="sticky top-0 z-40 border-b border-line bg-white md:static">
        <div className="container-x flex items-center gap-3 py-3 md:gap-6 md:py-4">
          <MobileMenu categories={menu} links={NAV_LINKS} hotline={hotline?.number} />
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label={`${settings.siteName} – Trang chủ`}
          >
            {logo && (
              <Image src={logo} alt="" width={44} height={44} className="rounded-box" priority />
            )}
            <span className="leading-none">
              <span className="block font-display text-[22px] font-bold tracking-tight text-harbor md:text-[26px]">
                {settings.siteName}
              </span>
              <span className="mt-1 hidden text-[11.5px] text-muted md:block">
                Thiết bị & kỹ thuật IT
              </span>
            </span>
          </Link>

          <form action="/san-pham" role="search" className="relative hidden flex-1 md:block">
            <label htmlFor="q" className="sr-only">
              Tìm sản phẩm
            </label>
            <input
              id="q"
              name="q"
              type="search"
              placeholder="Tìm laptop, camera, máy in, mã sản phẩm…"
              className="field h-12 pr-14"
            />
            <button
              type="submit"
              className="absolute top-1 right-1 flex h-10 w-11 items-center justify-center rounded-box bg-harbor text-white hover:bg-harbor-deep"
              aria-label="Tìm"
            >
              <Search size={18} />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-3 md:ml-0">
            {techLine && (
              <a href={telHref(techLine.number)} className="hidden items-center gap-2.5 lg:flex">
                <span className="flex h-11 w-11 items-center justify-center rounded-box bg-signal text-harbor-deep">
                  <Phone size={19} />
                </span>
                <span className="leading-tight">
                  <span className="block text-xs text-muted">Gọi kỹ thuật</span>
                  <span className="font-display text-[17px] font-bold text-harbor">
                    {techLine.number}
                  </span>
                </span>
              </a>
            )}
            <CartButton />
          </div>
        </div>
      </header>

      {/* Ô tìm kiếm trên mobile — cuộn đi bình thường */}
      <div className="border-b border-line bg-white md:hidden">
        <form action="/san-pham" role="search" className="container-x relative py-3">
          <input
            name="q"
            type="search"
            placeholder="Tìm sản phẩm…"
            aria-label="Tìm sản phẩm"
            className="field pr-12"
          />
          <button
            type="submit"
            className="absolute top-3 right-4 flex h-11 w-11 items-center justify-center text-muted"
            aria-label="Tìm"
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Menu chính (desktop) — dính ở mép trên khi cuộn */}
      <StickyNav logo={logo} siteName={settings.siteName}>
        <CategoryMenu categories={menu} />
        <ul className="flex items-stretch overflow-x-auto">
          {NAV_LINKS.map((l) => (
            <li key={l.href} className="flex">
              <Link
                href={l.href}
                className="flex items-center px-3 text-[14.5px] font-medium whitespace-nowrap text-ink hover:text-sky-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </StickyNav>
    </>
  )
}
