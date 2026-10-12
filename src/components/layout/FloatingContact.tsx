import { MessageCircle, Phone } from 'lucide-react'

import { telHref, zaloHref } from '@/lib/format'
import { getSiteSettings } from '@/lib/payload'

/**
 * Desktop: cụm nút tròn góc phải.
 * Mobile: thanh liên hệ cố định ở đáy màn hình (dễ bấm bằng ngón cái).
 */
export async function FloatingContact() {
  const s = await getSiteSettings()
  const phone = s.hotlines?.[0]?.number
  if (!phone && !s.zalo) return null

  return (
    <>
      <div className="fixed right-5 bottom-6 z-30 hidden flex-col gap-3 md:flex">
        {s.zalo && (
          <a
            href={zaloHref(s.zalo)}
            target="_blank"
            rel="noopener"
            className="flex h-13 w-13 items-center justify-center rounded-full bg-[#0068ff] text-[13px] font-bold text-white shadow-lg ring-4 ring-white"
            aria-label="Chat Zalo"
          >
            Zalo
          </a>
        )}
        {s.messenger && (
          <a
            href={s.messenger}
            target="_blank"
            rel="noopener"
            className="flex h-13 w-13 items-center justify-center rounded-full bg-sky-strong text-white shadow-lg ring-4 ring-white"
            aria-label="Nhắn tin Messenger"
          >
            <MessageCircle size={22} />
          </a>
        )}
        {phone && (
          <a
            href={telHref(phone)}
            className="flex h-13 w-13 items-center justify-center rounded-full bg-signal text-harbor-deep shadow-lg ring-4 ring-white"
            aria-label={`Gọi ${phone}`}
          >
            <Phone size={22} />
          </a>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
        {phone && (
          <a
            href={telHref(phone)}
            className="flex h-14 items-center justify-center gap-2 bg-signal font-semibold text-harbor-deep"
          >
            <Phone size={18} /> Gọi ngay
          </a>
        )}
        {s.zalo && (
          <a
            href={zaloHref(s.zalo)}
            target="_blank"
            rel="noopener"
            className="flex h-14 items-center justify-center gap-2 bg-[#0068ff] font-semibold text-white"
          >
            <MessageCircle size={18} /> Chat Zalo
          </a>
        )}
      </div>
    </>
  )
}
