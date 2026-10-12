'use client'

import type { DefaultCellComponentProps } from 'payload'
import { useEffect, useState } from 'react'

const vnd = new Intl.NumberFormat('vi-VN')

/** Giá trong bảng danh sách: 15.990.000đ, để trống thì hiện gạch ngang. */
export function PriceCell({ cellData }: DefaultCellComponentProps) {
  if (typeof cellData !== 'number')
    return <span style={{ color: 'var(--theme-elevation-400)' }}>—</span>
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{vnd.format(cellData)}đ</span>
}

type MediaLike = {
  thumbnailURL?: string | null
  url?: string | null
  sizes?: { thumbnail?: { url?: string | null } }
}

const thumbOf = (m: MediaLike) => m.sizes?.thumbnail?.url || m.thumbnailURL || m.url || null

// Danh sách chỉ trả về id ảnh → lấy URL thumbnail, cache lại để không gọi trùng
const cache = new Map<number, Promise<string | null>>()
const fetchThumb = (id: number) => {
  if (!cache.has(id)) {
    cache.set(
      id,
      fetch(`/api/media/${id}?depth=0`, { credentials: 'include' })
        .then((r) => (r.ok ? r.json() : null))
        .then((m: MediaLike | null) => (m ? thumbOf(m) : null))
        .catch(() => null),
    )
  }
  return cache.get(id)!
}

/** Ảnh đại diện nhỏ của sản phẩm (ảnh đầu tiên). */
export function ThumbCell({ cellData }: DefaultCellComponentProps) {
  const first = (Array.isArray(cellData) ? cellData[0] : cellData) as MediaLike | number | undefined
  const [src, setSrc] = useState<string | null>(
    first && typeof first === 'object' ? thumbOf(first) : null,
  )
  useEffect(() => {
    if (typeof first === 'number') fetchThumb(first).then(setSrc)
  }, [first])

  const box = { width: 44, height: 44, borderRadius: 6, background: 'var(--theme-elevation-100)' }
  if (!src) return <span style={{ ...box, display: 'block' }} />
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" style={{ ...box, objectFit: 'cover', display: 'block' }} />
}

const nameCache = new Map<string, Promise<string | null>>()
const fetchCategoryName = (id: number) => {
  const key = `categories:${id}`
  if (!nameCache.has(key)) {
    nameCache.set(
      key,
      fetch(`/api/categories/${id}?depth=0`, { credentials: 'include' })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { name?: string } | null) => d?.name ?? null)
        .catch(() => null),
    )
  }
  return nameCache.get(key)!
}

/** Tên danh mục trong bảng sản phẩm. */
export function CategoryCell({ cellData }: DefaultCellComponentProps) {
  const initial =
    cellData && typeof cellData === 'object' ? ((cellData as { name?: string }).name ?? null) : null
  const [name, setName] = useState<string | null>(initial)
  useEffect(() => {
    if (typeof cellData === 'number') fetchCategoryName(cellData).then(setName)
  }, [cellData])
  return <span>{name ?? '—'}</span>
}
