import { Check, MessageCircle, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { ContactForm } from '@/components/forms/ContactForm'
import { RichText } from '@/components/RichText'
import { PageHeader } from '@/components/ui'
import { mediaUrl, PLACEHOLDER, telHref, zaloHref } from '@/lib/format'
import { getPayloadClient, getSiteSettings, PUBLISHED } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

const getService = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    where: { and: [PUBLISHED, { slug: { equals: slug } }] },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getService((await params).slug)
  if (!s) return {}
  const image = mediaUrl(s.meta?.image ?? s.image, 'large')
  return {
    title: s.meta?.title || s.title,
    description: s.meta?.description || s.summary,
    alternates: { canonical: `/dich-vu/${s.slug}` },
    openGraph: { images: image ? [image] : undefined },
  }
}

export default async function ServicePage({ params }: Props) {
  const service = await getService((await params).slug)
  if (!service) notFound()
  const [settings, payload] = await Promise.all([getSiteSettings(), getPayloadClient()])
  const phone =
    settings.hotlines?.find((h) => /kỹ thuật/i.test(h.label ?? ''))?.number ??
    settings.hotlines?.[0]?.number
  const others = await payload.find({
    collection: 'services',
    where: { and: [PUBLISHED, { id: { not_equals: service.id } }] },
    sort: 'order',
    limit: 8,
    depth: 0,
  })
  const img = mediaUrl(service.image, 'large') ?? PLACEHOLDER.wide

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Dịch vụ', href: '/dich-vu' }, { label: service.title }]}
        title={service.title}
        description={service.summary}
      >
        {service.priceFrom && (
          <p className="mt-4 inline-block rounded-tag bg-signal-wash px-3 py-1 font-display font-semibold text-harbor">
            Giá tham khảo: {service.priceFrom}
          </p>
        )}
      </PageHeader>

      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_360px]">
        <article>
          {img && (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-panel bg-harbor">
              <Image
                src={img}
                alt={service.title}
                fill
                priority
                sizes="(min-width:1024px) 800px, 100vw"
                className="object-cover"
              />
            </div>
          )}
          {service.highlights && service.highlights.length > 0 && (
            <ul className="mb-8 grid gap-3 sm:grid-cols-2">
              {service.highlights.map((h) => (
                <li
                  key={h.id}
                  className="flex items-start gap-2.5 rounded-box bg-paper px-4 py-3 font-medium"
                >
                  <Check size={18} className="mt-0.5 shrink-0 text-ok" aria-hidden />
                  {h.text}
                </li>
              ))}
            </ul>
          )}
          <RichText data={service.content} />
        </article>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-panel bg-harbor p-5 text-white">
            <p className="font-display text-lg font-bold">Đặt lịch kỹ thuật</p>
            <p className="mt-1 text-sm text-white/75">
              Gọi hoặc nhắn Zalo để được hẹn giờ nhanh nhất.
            </p>
            <div className="mt-4 grid gap-2.5">
              {phone && (
                <a href={telHref(phone)} className="btn btn-signal">
                  <Phone size={18} /> {phone}
                </a>
              )}
              {settings.zalo && (
                <a
                  href={zaloHref(settings.zalo)}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-ghost-light"
                >
                  <MessageCircle size={18} /> Nhắn Zalo
                </a>
              )}
            </div>
          </div>
          <div className="rounded-panel border border-line p-5">
            <p className="mb-4 font-display text-lg font-bold text-harbor">
              Hoặc để lại số, chúng tôi gọi lại
            </p>
            <ContactForm
              type="service"
              defaultMessage={`Dịch vụ: ${service.title}`}
              submitLabel="Gửi yêu cầu"
            />
          </div>
          {others.docs.length > 0 && (
            <nav aria-label="Dịch vụ khác">
              <p className="mb-2 font-display font-semibold text-harbor">Dịch vụ khác</p>
              <ul className="divide-y divide-line border-y border-line text-[14.5px]">
                {others.docs.map((o) => (
                  <li key={o.id}>
                    <Link href={`/dich-vu/${o.slug}`} className="block py-2.5 hover:text-sky-ink">
                      {o.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
      </div>
    </>
  )
}
