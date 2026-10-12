import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Chakra_Petch } from 'next/font/google'

import { CartProvider } from '@/components/cart/CartProvider'
import { FloatingContact } from '@/components/layout/FloatingContact'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getSiteSettings } from '@/lib/payload'

import './globals.css'

// Dữ liệu lấy trực tiếp từ DB mỗi lần tải trang → sửa trong admin là thấy ngay,
// và không cần DB lúc build Docker image.
export const dynamic = 'force-dynamic'

const chakra = Chakra_Petch({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  variable: '--font-chakra',
  display: 'swap',
})

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bevn',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: {
      default: `${s.siteName} – ${s.tagline ?? 'Thiết bị & dịch vụ IT'}`,
      template: `%s | ${s.siteName}`,
    },
    description: s.footerAbout ?? undefined,
    openGraph: { siteName: s.siteName, locale: 'vi_VN', type: 'website' },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${chakra.variable} ${beVietnam.variable}`}>
      <body className="pb-14 md:pb-0">
        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <FloatingContact />
        </CartProvider>
      </body>
    </html>
  )
}
