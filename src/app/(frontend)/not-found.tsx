import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="dot-grid">
      <div className="container-x flex flex-col items-center py-24 text-center">
        <p className="font-display text-[64px] leading-none font-bold text-sky">404</p>
        <h1 className="mt-4 text-2xl font-bold text-harbor">Không tìm thấy trang này</h1>
        <p className="mt-2 max-w-[44ch] text-muted">
          Đường dẫn có thể đã thay đổi hoặc sản phẩm đã ngừng kinh doanh.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Về trang chủ
          </Link>
          <Link href="/san-pham" className="btn btn-outline">
            Xem sản phẩm
          </Link>
        </div>
      </div>
    </div>
  )
}
