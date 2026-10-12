'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { CartButton } from '@/components/cart/CartButton'

/**
 * Thanh menu chính (desktop) dính ở mép trên khi cuộn.
 * Lúc đã dính: hiện thêm logo nhỏ bên trái + giỏ hàng bên phải,
 * vì hàng logo/giỏ hàng phía trên đã cuộn mất.
 */
export function StickyNav({
  logo,
  siteName,
  children,
}: {
  logo: string | null
  siteName: string
  children: React.ReactNode
}) {
  const sentinel = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      {/* Mốc 0px ngay trên thanh menu: khuất khỏi màn hình = thanh đang dính */}
      <div ref={sentinel} aria-hidden className="h-0" />
      <nav
        aria-label="Menu chính"
        className={`sticky top-0 z-40 hidden border-b border-line bg-white transition-shadow md:block ${
          stuck ? 'shadow-[0_6px_20px_-10px_rgb(14_58_82/0.35)]' : ''
        }`}
      >
        <div className="container-x flex h-16 items-stretch gap-1">
          <Link
            href="/"
            aria-label={`${siteName} – Trang chủ`}
            tabIndex={stuck ? 0 : -1}
            aria-hidden={!stuck}
            className={`flex shrink-0 items-center overflow-hidden transition-all duration-200 ${
              stuck ? 'mr-2 w-9 opacity-100' : 'w-0 opacity-0'
            }`}
          >
            {logo && <Image src={logo} alt="" width={34} height={34} className="rounded-box" />}
          </Link>

          {children}

          <div
            className={`ml-auto flex items-center pl-2 transition-opacity duration-200 ${
              stuck ? 'opacity-100' : 'pointer-events-none invisible opacity-0'
            }`}
          >
            <CartButton />
          </div>
        </div>
      </nav>
    </>
  )
}
