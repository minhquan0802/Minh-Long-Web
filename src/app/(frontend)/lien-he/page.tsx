import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import type { Metadata } from 'next'

import { ContactForm } from '@/components/forms/ContactForm'
import { PageHeader } from '@/components/ui'
import { telHref, zaloHref } from '@/lib/format'
import { getSiteSettings } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Liên hệ',
  description:
    'Hotline, Zalo, địa chỉ cửa hàng Minh Long. Gửi yêu cầu báo giá hoặc đặt lịch kỹ thuật.',
  alternates: { canonical: '/lien-he' },
}

export default async function ContactPage() {
  const s = await getSiteSettings()
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Liên hệ' }]}
        title="Liên hệ Minh Long"
        description="Gọi, nhắn Zalo hoặc để lại lời nhắn — chúng tôi phản hồi trong giờ làm việc."
      />
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <ul className="space-y-4">
            {s.hotlines?.map((h) => (
              <ContactRow key={h.id} icon={<Phone size={20} />} label={h.label ?? 'Hotline'}>
                <a
                  href={telHref(h.number)}
                  className="font-display text-xl font-bold text-harbor hover:text-sky-ink"
                >
                  {h.number}
                </a>
              </ContactRow>
            ))}
            {s.zalo && (
              <ContactRow icon={<MessageCircle size={20} />} label="Zalo">
                <a
                  href={zaloHref(s.zalo)}
                  target="_blank"
                  rel="noopener"
                  className="font-semibold text-sky-ink hover:underline"
                >
                  Chat Zalo {s.zalo}
                </a>
              </ContactRow>
            )}
            {s.email && (
              <ContactRow icon={<Mail size={20} />} label="Email">
                <a href={`mailto:${s.email}`} className="font-semibold hover:text-sky-ink">
                  {s.email}
                </a>
              </ContactRow>
            )}
            {s.addresses?.map((a) => (
              <ContactRow key={a.id} icon={<MapPin size={20} />} label={a.label ?? 'Địa chỉ'}>
                {a.mapUrl ? (
                  <a href={a.mapUrl} target="_blank" rel="noopener" className="hover:text-sky-ink">
                    {a.address}
                  </a>
                ) : (
                  a.address
                )}
              </ContactRow>
            ))}
            {s.workingHours && (
              <ContactRow icon={<Clock size={20} />} label="Giờ làm việc">
                {s.workingHours}
              </ContactRow>
            )}
          </ul>
        </div>
        <div className="rounded-panel border border-line p-6 md:p-8">
          <h2 className="section-title mb-5">Gửi lời nhắn</h2>
          <ContactForm />
        </div>
      </div>
    </>
  )
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-box bg-sky-wash text-sky-ink">
        {icon}
      </span>
      <span>
        <span className="block text-sm text-muted">{label}</span>
        <span className="block">{children}</span>
      </span>
    </li>
  )
}
