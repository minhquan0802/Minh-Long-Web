'use client'

import { ChevronDown, LayoutGrid } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export type MenuCategory = {
  name: string
  href: string
  image: string | null
  children: { name: string; href: string }[]
}

/** Nút "Danh mục sản phẩm" mở bảng danh mục (desktop). */
export function CategoryMenu({ categories }: { categories: MenuCategory[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative flex" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="category-panel"
        // Rê chuột đã mở sẵn → bấm không được đóng lại; đóng bằng bấm ra ngoài / Esc / rời chuột
        onClick={() => setOpen(true)}
        onMouseEnter={() => setOpen(true)}
        className="my-2.5 flex items-center gap-2 rounded-box bg-sky-strong px-4 text-[14.5px] font-semibold text-white hover:bg-sky-ink"
      >
        <LayoutGrid size={17} aria-hidden />
        Danh mục sản phẩm
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id="category-panel"
          className="absolute top-full left-0 w-[min(880px,calc(100vw-48px))] rounded-b-panel border border-t-0 border-line bg-white p-5 shadow-[0_18px_40px_-12px_rgb(14_58_82/0.25)]"
        >
          <ul className="grid grid-cols-3 gap-x-6 gap-y-5">
            {categories.map((c) => (
              <li key={c.href} className="flex gap-3">
                {c.image && (
                  <Image
                    src={c.image}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 shrink-0 rounded-box bg-paper"
                  />
                )}
                <div>
                  <Link href={c.href} className="font-semibold text-harbor hover:text-sky-ink">
                    {c.name}
                  </Link>
                  {c.children.length > 0 && (
                    <ul className="mt-1 space-y-0.5 text-[14px] text-muted">
                      {c.children.map((ch) => (
                        <li key={ch.href}>
                          <Link href={ch.href} className="hover:text-sky-ink">
                            {ch.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
