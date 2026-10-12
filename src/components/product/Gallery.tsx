'use client'

import Image from 'next/image'
import { useState } from 'react'

export function Gallery({
  images,
  alt,
}: {
  images: { large: string; thumb: string }[]
  alt: string
}) {
  const [active, setActive] = useState(0)
  if (!images.length)
    return <div className="dot-grid aspect-square rounded-panel border border-line bg-paper" />

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-panel border border-line bg-paper">
        <Image
          src={images[active].large}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 flex gap-2.5 overflow-x-auto">
          {images.map((img, i) => (
            <li key={img.thumb}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ảnh ${i + 1}`}
                aria-pressed={i === active}
                className={`relative block h-18 w-18 overflow-hidden rounded-box border-2 bg-paper ${
                  i === active ? 'border-sky' : 'border-transparent hover:border-line'
                }`}
              >
                <Image src={img.thumb} alt="" fill sizes="72px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
