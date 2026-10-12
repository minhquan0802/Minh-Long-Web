import type { Payload } from 'payload'
import Link from 'next/link'

import type { User } from '@/payload-types'

/**
 * Trang chủ admin: việc cần xử lý + lối tắt, thay cho lưới ô mặc định của Payload.
 * Mỗi vai trò chỉ thấy phần liên quan tới mình.
 */
type Props = { payload: Payload; user?: User | null }

const vnd = new Intl.NumberFormat('vi-VN')
const ago = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 60) return `${Math.max(1, m)} phút trước`
  if (m < 60 * 24) return `${Math.round(m / 60)} giờ trước`
  return new Date(iso).toLocaleDateString('vi-VN')
}

const ORDER_STATUS: Record<string, string> = {
  new: 'Mới',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Hoàn tất',
  cancelled: 'Đã huỷ',
}
const CONTACT_TYPE: Record<string, string> = {
  contact: 'Liên hệ',
  quote: 'Báo giá',
  service: 'Sửa chữa',
}

const A = '/admin/collections'

export async function Dashboard({ payload, user }: Props) {
  const roles = user?.roles ?? []
  const isAdmin = roles.includes('admin')
  const canSell = isAdmin || roles.includes('sales')
  const canEdit = isAdmin || roles.includes('editor')

  const [newOrders, newContacts, outOfStock, drafts, orders, contacts] = await Promise.all([
    canSell ? payload.count({ collection: 'orders', where: { status: { equals: 'new' } } }) : null,
    canSell
      ? payload.count({ collection: 'contacts', where: { status: { equals: 'new' } } })
      : null,
    canEdit
      ? payload.count({
          collection: 'products',
          where: { stockStatus: { equals: 'out_of_stock' } },
        })
      : null,
    canEdit
      ? payload.count({ collection: 'posts', where: { _status: { equals: 'draft' } } })
      : null,
    canSell ? payload.find({ collection: 'orders', limit: 6, sort: '-createdAt', depth: 0 }) : null,
    canSell
      ? payload.find({ collection: 'contacts', limit: 6, sort: '-createdAt', depth: 0 })
      : null,
  ])

  const tiles = [
    newOrders && {
      label: 'Đơn hàng mới',
      hint: 'cần gọi xác nhận',
      value: newOrders.totalDocs,
      href: `${A}/orders?where[status][equals]=new`,
    },
    newContacts && {
      label: 'Liên hệ chưa xử lý',
      hint: 'báo giá, phiếu sửa chữa',
      value: newContacts.totalDocs,
      href: `${A}/contacts?where[status][equals]=new`,
    },
    outOfStock && {
      label: 'Sản phẩm hết hàng',
      hint: 'kiểm tra lại kho',
      value: outOfStock.totalDocs,
      href: `${A}/products?where[stockStatus][equals]=out_of_stock`,
    },
    drafts && {
      label: 'Bài viết nháp',
      hint: 'chưa xuất bản',
      value: drafts.totalDocs,
      href: `${A}/posts?where[_status][equals]=draft`,
    },
  ].filter(Boolean) as { label: string; hint: string; value: number; href: string }[]

  const actions = [
    canEdit && { label: 'Thêm sản phẩm', href: `${A}/products/create` },
    canEdit && { label: 'Viết bài', href: `${A}/posts/create` },
    canEdit && { label: 'Thêm dịch vụ', href: `${A}/services/create` },
    canSell && { label: 'Tạo đơn tại quầy', href: `${A}/orders/create` },
    canEdit && { label: 'Sửa trang chủ', href: '/admin/globals/homepage' },
    isAdmin && { label: 'Hotline, địa chỉ, logo', href: '/admin/globals/site-settings' },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <div className="ml-dash gutter--left gutter--right">
      <header className="ml-dash__head">
        <div>
          <h1>Chào {user?.name ?? 'bạn'}</h1>
          <p>Đây là những việc đang chờ trên website Minh Long.</p>
        </div>
        <a href="/" target="_blank" rel="noopener" className="ml-dash__site">
          Xem website
        </a>
      </header>

      {tiles.length > 0 && (
        <section className="ml-dash__tiles">
          {tiles.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className={`ml-tile${t.value > 0 ? ' ml-tile--hot' : ''}`}
            >
              <span className="ml-tile__value">{t.value}</span>
              <span className="ml-tile__label">{t.label}</span>
              <span className="ml-tile__hint">{t.hint}</span>
            </Link>
          ))}
        </section>
      )}

      {actions.length > 0 && (
        <section className="ml-dash__actions" aria-label="Thao tác nhanh">
          {actions.map((a) => (
            <Link key={a.href} href={a.href} className="ml-action">
              {a.label}
            </Link>
          ))}
        </section>
      )}

      {canSell && (
        <section className="ml-dash__lists">
          <div className="ml-panel">
            <div className="ml-panel__head">
              <h2>Đơn hàng gần đây</h2>
              <Link href={`${A}/orders`}>Tất cả đơn</Link>
            </div>
            {orders?.docs.length ? (
              <table>
                <tbody>
                  {orders.docs.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <Link href={`${A}/orders/${o.id}`} className="ml-strong">
                          {o.code}
                        </Link>
                        <span className="ml-muted">{o.customerName}</span>
                      </td>
                      <td className="ml-num">{vnd.format(o.total ?? 0)}đ</td>
                      <td>
                        <span className={`ml-pill ml-pill--${o.status ?? 'new'}`}>
                          {ORDER_STATUS[o.status ?? 'new']}
                        </span>
                      </td>
                      <td className="ml-time">{ago(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="ml-empty">
                Chưa có đơn hàng nào. Đơn khách đặt trên website sẽ hiện ở đây.
              </p>
            )}
          </div>

          <div className="ml-panel">
            <div className="ml-panel__head">
              <h2>Liên hệ & phiếu sửa chữa</h2>
              <Link href={`${A}/contacts`}>Tất cả</Link>
            </div>
            {contacts?.docs.length ? (
              <table>
                <tbody>
                  {contacts.docs.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <Link href={`${A}/contacts/${c.id}`} className="ml-strong">
                          {c.name}
                        </Link>
                        <a href={`tel:${c.phone}`} className="ml-muted">
                          {c.phone}
                        </a>
                      </td>
                      <td>
                        <span className="ml-pill">{CONTACT_TYPE[c.type ?? 'contact']}</span>
                      </td>
                      <td>
                        {c.status === 'new' && (
                          <span className="ml-pill ml-pill--new">Chưa gọi</span>
                        )}
                      </td>
                      <td className="ml-time">{ago(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="ml-empty">Chưa có liên hệ nào.</p>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
