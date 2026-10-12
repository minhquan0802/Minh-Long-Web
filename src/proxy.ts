import { type NextRequest, NextResponse } from 'next/server'

const THEME_COOKIE = 'payload-theme'

/**
 * Admin mặc định nền sáng: Payload tự theo chế độ sáng/tối của hệ điều hành
 * khi chưa có cookie, nên gán sẵn "light" ở lần vào đầu tiên.
 * Người dùng đổi bằng nút sáng/tối trên thanh admin (cookie sẽ được ghi đè).
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(THEME_COOKIE)) return NextResponse.next()

  // Cho chính lần render này thấy cookie luôn (tránh nháy nền tối)
  request.cookies.set(THEME_COOKIE, 'light')
  const response = NextResponse.next({ request: { headers: request.headers } })
  response.cookies.set(THEME_COOKIE, 'light', { path: '/', maxAge: 60 * 60 * 24 * 365 })
  return response
}

export const config = {
  matcher: '/admin/:path*',
}
