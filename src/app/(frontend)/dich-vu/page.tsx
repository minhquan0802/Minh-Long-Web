import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { PageHeader, SERVICE_ICONS } from '@/components/ui'
import { mediaUrl, PLACEHOLDER } from '@/lib/format'
import { getPayloadClient, PUBLISHED } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Dịch vụ sửa chữa & bảo trì',
  description:
    'Sửa laptop, máy in, cứu dữ liệu, lắp camera, thi công mạng Wifi tận nơi. Kiểm tra miễn phí, báo giá trước.',
  alternates: { canonical: '/dich-vu' },
}

export default async function ServicesPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    where: PUBLISHED,
    sort: 'order',
    limit: 50,
    depth: 1,
  })

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Dịch vụ' }]}
        title="Dịch vụ sửa chữa & bảo trì"
        description="Kỹ thuật viên kiểm tra miễn phí và báo giá trước. Bạn đồng ý thì mới làm."
      />
      <div className="container-x py-10">
        <ul className="grid gap-6 md:grid-cols-2">
          {docs.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon ?? 'wrench']
            const img = mediaUrl(s.image, 'card') ?? PLACEHOLDER.wide
            return (
              <li key={s.id}>
                <Link
                  href={`/dich-vu/${s.slug}`}
                  className="group grid h-full overflow-hidden rounded-panel border border-line transition-colors hover:border-sky sm:grid-cols-[200px_1fr]"
                >
                  <span className="relative block aspect-[16/9] bg-harbor sm:aspect-auto">
                    {img && (
                      <Image
                        src={img}
                        alt=""
                        fill
                        priority={i < 2}
                        sizes="(min-width:640px) 200px, 100vw"
                        className="object-cover object-[65%_50%]"
                      />
                    )}
                  </span>
                  <span className="flex flex-col p-5">
                    <span className="flex items-center gap-2 text-sky-ink">
                      <Icon size={18} aria-hidden />
                      {s.priceFrom && (
                        <span className="text-[13px] font-semibold text-ink">{s.priceFrom}</span>
                      )}
                    </span>
                    <span className="mt-2 font-display text-[19px] leading-snug font-semibold text-harbor group-hover:text-sky-ink">
                      {s.title}
                    </span>
                    <span className="mt-2 line-clamp-3 text-[14.5px] text-muted">{s.summary}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
