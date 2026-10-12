import type { Media, Product } from '@/payload-types'

const vnd = new Intl.NumberFormat('vi-VN')

/** 15990000 -> "15.990.000đ" */
export const formatVND = (n: number) => `${vnd.format(n)}đ`

/** Giá khách thực trả (giá KM nếu có), null = "Liên hệ". */
export const effectivePrice = (p: Pick<Product, 'price' | 'salePrice'>) =>
  p.salePrice ?? p.price ?? null

export const discountPercent = (p: Pick<Product, 'price' | 'salePrice'>) =>
  p.price && p.salePrice ? Math.round((1 - p.salePrice / p.price) * 100) : 0

export const formatDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : ''

/** Relationship có thể là id hoặc object (tuỳ depth) — chỉ lấy khi đã populate. */
export const asDoc = <T extends object>(v: number | T | null | undefined): T | null =>
  v && typeof v === 'object' ? v : null

export type ImageSize = 'thumbnail' | 'card' | 'large'

/** Ảnh mặc định (logo Minh Long) khi sản phẩm / bài viết / dịch vụ chưa có ảnh */
export const PLACEHOLDER = {
  square: '/images/placeholder-square.webp',
  wide: '/images/placeholder-wide.webp',
}

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? ''

export const mediaUrl = (m: Media | number | null | undefined, size?: ImageSize) => {
  const doc = asDoc(m)
  if (!doc) return null
  const url = (size && doc.sizes?.[size]?.url) || doc.url || null
  // Ảnh lưu trên chính server → dùng đường dẫn tương đối cho next/image
  return url && SITE_URL && url.startsWith(SITE_URL) ? url.slice(SITE_URL.length) : url
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`
export const zaloHref = (phone: string) => `https://zalo.me/${phone.replace(/[^\d]/g, '')}`

export const STOCK_LABEL: Record<NonNullable<Product['stockStatus']>, string> = {
  in_stock: 'Còn hàng',
  out_of_stock: 'Hết hàng',
  preorder: 'Đặt trước',
}
