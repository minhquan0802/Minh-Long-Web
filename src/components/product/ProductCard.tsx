import Image from 'next/image'
import Link from 'next/link'

import { AddToCartIcon } from '@/components/cart/AddToCart'
import { asDoc, discountPercent, effectivePrice, mediaUrl, PLACEHOLDER } from '@/lib/format'
import type { Brand, Product } from '@/payload-types'

import { Price } from './Price'

/** Thẻ sản phẩm kiểu "tem thiết bị": hãng + mã ở đầu, giá to ở chân. */
export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const brand = asDoc<Brand>(product.brand)
  const img = mediaUrl(product.images?.[0], 'card') ?? PLACEHOLDER.square
  const price = effectivePrice(product)
  const off = discountPercent(product)
  const href = `/san-pham/${product.slug}`
  const unavailable = product.stockStatus === 'out_of_stock'

  return (
    <article className="group relative flex flex-col rounded-box border border-line bg-white transition-colors hover:border-sky">
      <Link
        href={href}
        className="relative block aspect-square overflow-hidden rounded-t-box bg-paper"
      >
        {img && (
          <Image
            src={img}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        )}
        {off > 0 && <span className="tag-sale absolute top-3 left-0">-{off}%</span>}
        {product.stockStatus && product.stockStatus !== 'in_stock' && (
          <span className="absolute right-2 bottom-2 rounded-tag bg-white/90 px-2 py-0.5 text-xs font-semibold text-muted">
            {unavailable ? 'Hết hàng' : 'Đặt trước'}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3 md:p-4">
        <p className="flex items-center justify-between gap-2 text-xs text-muted">
          <span className="font-semibold text-sky-ink">{brand?.name ?? ' '}</span>
          {product.warranty && <span>BH {product.warranty}</span>}
        </p>
        <h3 className="line-clamp-2 min-h-[2.6em] font-sans text-[14.5px] leading-[1.3] font-medium text-ink">
          <Link href={href} className="after:absolute after:inset-0 hover:text-sky-ink">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Price price={product.price} salePrice={product.salePrice} size="sm" />
          {price !== null && !unavailable && (
            <div className="relative z-10">
              <AddToCartIcon
                item={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price,
                  image: mediaUrl(product.images?.[0], 'thumbnail') ?? PLACEHOLDER.square,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export function ProductGrid({
  products,
  priorityCount = 0,
}: {
  products: Product[]
  priorityCount?: number
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  )
}
