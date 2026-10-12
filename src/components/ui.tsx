import {
  ChevronRight,
  Cloud,
  Code,
  Camera,
  HardDrive,
  Laptop,
  type LucideIcon,
  Phone,
  Printer,
  Server,
  Wifi,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'

import type { Service } from '@/payload-types'

export const SERVICE_ICONS: Record<NonNullable<Service['icon']>, LucideIcon> = {
  wrench: Wrench,
  laptop: Laptop,
  server: Server,
  'hard-drive': HardDrive,
  printer: Printer,
  wifi: Wifi,
  camera: Camera,
  phone: Phone,
  code: Code,
  cloud: Cloud,
}

export type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: 'Trang chủ', href: '/' }, ...items]
  return (
    <nav aria-label="Đường dẫn" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} className="text-line" aria-hidden />}
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="hover:text-sky-ink">
                {c.label}
              </Link>
            ) : (
              <span className="text-ink" aria-current="page">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: all.map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: c.label,
              ...(c.href ? { item: `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}${c.href}` } : {}),
            })),
          }),
        }}
      />
    </nav>
  )
}

export function PageHeader({
  crumbs,
  title,
  description,
  children,
}: {
  crumbs: Crumb[]
  title: string
  description?: string | null
  children?: React.ReactNode
}) {
  return (
    <div className="border-b border-line bg-paper">
      <div className="container-x py-6 md:py-8">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-3 text-[28px] font-bold text-harbor md:text-[34px]">{title}</h1>
        {description && <p className="mt-2 max-w-[68ch] text-muted">{description}</p>}
        {children}
      </div>
    </div>
  )
}

/** Phân trang dạng link — giữ nguyên các tham số lọc khác. */
export function Pagination({
  page,
  totalPages,
  basePath,
  params,
}: {
  page: number
  totalPages: number
  basePath: string
  params: Record<string, string | undefined>
}) {
  if (totalPages <= 1) return null
  const href = (p: number) => {
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) if (v && k !== 'trang') sp.set(k, v)
    if (p > 1) sp.set('trang', String(p))
    const qs = sp.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  )
  return (
    <nav aria-label="Phân trang" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && p - pages[i - 1] > 1 && <span className="text-muted">…</span>}
          <Link
            href={href(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-box border px-3 font-semibold ${
              p === page ? 'border-harbor bg-harbor text-white' : 'border-line hover:border-sky'
            }`}
          >
            {p}
          </Link>
        </span>
      ))}
    </nav>
  )
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="dot-grid rounded-[var(--radius-panel)] border border-dashed border-line px-6 py-14 text-center">
      <p className="font-display text-xl font-semibold text-harbor">{title}</p>
      {children && <div className="mt-2 text-muted">{children}</div>}
    </div>
  )
}
