import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

import { telHref } from '@/lib/format'
import { getCategoryTree, getPolicyPages, getSiteSettings } from '@/lib/payload'

export async function Footer() {
  const [s, tree, policies] = await Promise.all([
    getSiteSettings(),
    getCategoryTree(),
    getPolicyPages(),
  ])
  const social = [
    { href: s.facebook, label: 'Facebook' },
    { href: s.youtube, label: 'YouTube' },
    { href: s.tiktok, label: 'TikTok' },
  ].filter((x): x is { href: string; label: string } => Boolean(x.href))

  return (
    <footer className="dot-grid bg-harbor text-white/75 [--dot:#1a4a63]">
      <div className="container-x grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold text-white">{s.siteName}</p>
          {s.companyName && <p className="mt-1 text-sm">{s.companyName}</p>}
          {s.footerAbout && (
            <p className="mt-4 max-w-[46ch] text-[14px] leading-relaxed">{s.footerAbout}</p>
          )}
          <ul className="mt-5 space-y-2.5 text-[14px]">
            {s.addresses?.map((a) => (
              <li key={a.id} className="flex gap-2.5">
                <MapPin size={17} className="mt-0.5 shrink-0 text-signal" aria-hidden />
                <span>
                  {a.label && <span className="text-white">{a.label}: </span>}
                  {a.mapUrl ? (
                    <a href={a.mapUrl} target="_blank" rel="noopener" className="hover:text-white">
                      {a.address}
                    </a>
                  ) : (
                    a.address
                  )}
                </span>
              </li>
            ))}
            {s.hotlines?.map((h) => (
              <li key={h.id} className="flex gap-2.5">
                <Phone size={17} className="mt-0.5 shrink-0 text-signal" aria-hidden />
                <a href={telHref(h.number)} className="hover:text-white">
                  {h.label && `${h.label}: `}
                  <span className="font-semibold text-white">{h.number}</span>
                </a>
              </li>
            ))}
            {s.email && (
              <li className="flex gap-2.5">
                <Mail size={17} className="mt-0.5 shrink-0 text-signal" aria-hidden />
                <a href={`mailto:${s.email}`} className="hover:text-white">
                  {s.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <FooterCol title="Sản phẩm">
          {tree.slice(0, 7).map((c) => (
            <FooterLink key={c.id} href={`/danh-muc/${c.slug}`}>
              {c.name}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Dịch vụ & thông tin">
          <FooterLink href="/dich-vu">Dịch vụ sửa chữa</FooterLink>
          <FooterLink href="/khuyen-mai">Khuyến mãi</FooterLink>
          <FooterLink href="/tin-tuc">Tin tức</FooterLink>
          <FooterLink href="/ho-tro">Hỗ trợ kỹ thuật</FooterLink>
          <FooterLink href="/tuyen-dung">Tuyển dụng</FooterLink>
          <FooterLink href="/gioi-thieu">Giới thiệu</FooterLink>
          <FooterLink href="/lien-he">Liên hệ</FooterLink>
        </FooterCol>

        <FooterCol title="Chính sách">
          {policies.map((p) => (
            <FooterLink key={p.id} href={`/${p.slug}`}>
              {p.title}
            </FooterLink>
          ))}
          {social.length > 0 && (
            <li className="pt-3">
              <span className="flex flex-wrap gap-2">
                {social.map((x) => (
                  <a
                    key={x.label}
                    href={x.href}
                    target="_blank"
                    rel="noopener"
                    className="rounded-tag border border-white/25 px-2.5 py-1 text-[13px] hover:border-white hover:text-white"
                  >
                    {x.label}
                  </a>
                ))}
              </span>
            </li>
          )}
        </FooterCol>
      </div>
      <div className="border-t border-harbor-line">
        <div className="container-x flex flex-col gap-1 py-4 text-[13px] md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {s.companyName ?? s.siteName}
          </p>
          {s.taxCode && <p>MST: {s.taxCode}</p>}
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-display text-[17px] font-semibold text-white">{title}</p>
      <ul className="mt-4 space-y-2 text-[14px]">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="hover:text-white">
        {children}
      </Link>
    </li>
  )
}
