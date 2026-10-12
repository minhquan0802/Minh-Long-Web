'use client'

import { Menu, Phone, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { telHref } from '@/lib/format'

import type { MenuCategory } from './CategoryMenu'

export function MobileMenu({
  categories,
  links,
  hotline,
}: {
  categories: MenuCategory[]
  links: { href: string; label: string }[]
  hotline?: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-box border border-line text-harbor"
        aria-label="Mở menu"
        aria-expanded={open}
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-harbor-deep/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[min(340px,88vw)] flex-col bg-white">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="font-display text-lg font-bold text-harbor">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center"
                aria-label="Đóng menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-1">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block py-2 font-semibold text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 mb-2 text-sm font-semibold text-muted">Danh mục sản phẩm</p>
              <ul className="divide-y divide-line border-y border-line">
                {categories.map((c) => (
                  <li key={c.href} className="py-2.5">
                    <Link href={c.href} className="font-medium text-harbor">
                      {c.name}
                    </Link>
                    {c.children.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                        {c.children.map((ch) => (
                          <Link key={ch.href} href={ch.href}>
                            {ch.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {hotline && (
              <a href={telHref(hotline)} className="btn btn-signal m-4">
                <Phone size={18} /> Gọi {hotline}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
