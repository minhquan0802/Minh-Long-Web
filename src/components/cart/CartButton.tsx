'use client'

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

import { useCart } from './CartProvider'

export function CartButton() {
  const { count } = useCart()
  return (
    <Link
      href="/gio-hang"
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-box border border-line text-harbor hover:border-sky"
      aria-label={count ? `Giỏ hàng: ${count} sản phẩm` : 'Giỏ hàng'}
    >
      <ShoppingCart size={20} strokeWidth={1.8} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-5 rounded-full bg-signal px-1 text-center font-display text-xs font-bold leading-5 text-harbor-deep">
          {count}
        </span>
      )}
    </Link>
  )
}
