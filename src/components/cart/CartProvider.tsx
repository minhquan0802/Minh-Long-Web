'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  id: number
  slug: string
  name: string
  /** Giá hiển thị lúc thêm vào giỏ — server luôn tính lại khi đặt hàng. */
  price: number
  image: string | null
  qty: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  ready: boolean
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  setQty: (id: number, qty: number) => void
  remove: (id: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const KEY = 'ml-cart-v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // localStorage bị chặn (chế độ ẩn danh...) — giỏ hàng chỉ sống trong phiên
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {}
  }, [items, ready])

  const add = useCallback<CartContextValue['add']>((item, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === item.id)
      if (found)
        return prev.map((i) => (i.id === item.id ? { ...i, qty: Math.min(99, i.qty + qty) } : i))
      return [...prev, { ...item, qty }]
    })
  }, [])

  const setQty = useCallback((id: number, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i)),
    )
  }, [])

  const remove = useCallback(
    (id: number) => setItems((prev) => prev.filter((i) => i.id !== id)),
    [],
  )
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, ready, add, setQty, remove, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart phải nằm trong <CartProvider>')
  return ctx
}
