'use client'

import { Check, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { type CartItem, useCart } from './CartProvider'

type Props = { item: Omit<CartItem, 'qty'> }

/** Nút nhỏ trên thẻ sản phẩm. */
export function AddToCartIcon({ item }: Props) {
  const { add } = useCart()
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        add(item)
        setDone(true)
        setTimeout(() => setDone(false), 1400)
      }}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-box border border-line text-sky-ink transition-colors hover:border-sky hover:bg-sky-wash"
      aria-label={done ? 'Đã thêm vào giỏ' : `Thêm ${item.name} vào giỏ`}
    >
      {done ? <Check size={17} /> : <ShoppingCart size={17} strokeWidth={1.8} />}
    </button>
  )
}

/** Khối chọn số lượng + thêm giỏ + mua ngay ở trang chi tiết. */
export function AddToCartPanel({ item, disabled }: Props & { disabled?: boolean }) {
  const { add } = useCart()
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  return (
    <div className="flex flex-wrap items-stretch gap-3">
      <div className="inline-flex h-12 items-center rounded-box border border-line">
        <button
          type="button"
          className="flex h-full w-11 items-center justify-center text-muted hover:text-ink disabled:opacity-40"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="Giảm số lượng"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          className="flex h-full w-11 items-center justify-center text-muted hover:text-ink"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          aria-label="Tăng số lượng"
        >
          <Plus size={16} />
        </button>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          add(item, qty)
          setAdded(true)
        }}
        className="btn btn-outline h-12 flex-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {added ? <Check size={18} /> : <ShoppingCart size={18} strokeWidth={1.8} />}
        {added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          add(item, qty)
          router.push('/gio-hang')
        }}
        className="btn btn-primary h-12 flex-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Mua ngay
      </button>
    </div>
  )
}
