'use server'

import { getPayloadClient } from './payload'

export type FormState = {
  ok: boolean
  message: string
  errors?: Record<string, string>
  /** Trả lại dữ liệu đã nhập để form không bị xoá trắng khi báo lỗi */
  values?: Record<string, string>
  orderCode?: string
}

const valuesOf = (fd: FormData, keys: string[]) =>
  Object.fromEntries(keys.map((k) => [k, clean(fd.get(k), 2000)]))

const PHONE_RE = /^(0|\+84)\d{9,10}$/
const clean = (v: FormDataEntryValue | null, max = 500) =>
  String(v ?? '')
    .trim()
    .slice(0, max)

/** Chống spam đơn giản: ô "website" ẩn chỉ bot mới điền. */
const isBot = (fd: FormData) => clean(fd.get('website')) !== ''

/** Form liên hệ / phiếu sửa chữa / yêu cầu báo giá. */
export async function submitContact(_: FormState | null, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true, message: 'Đã gửi.' }

  const name = clean(fd.get('name'), 100)
  const phone = clean(fd.get('phone'), 20).replace(/[\s.-]/g, '')
  const email = clean(fd.get('email'), 120)
  const type =
    (['contact', 'quote', 'service'] as const).find((t) => t === fd.get('type')) ?? 'contact'
  const device = clean(fd.get('device'), 60)
  const message = clean(fd.get('message'), 2000)
  const productId = Number(fd.get('product')) || undefined

  const errors: Record<string, string> = {}
  if (name.length < 2) errors.name = 'Nhập họ tên của bạn'
  if (!PHONE_RE.test(phone)) errors.phone = 'Số điện thoại chưa đúng (VD: 0909123456)'
  if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Email chưa đúng định dạng'
  if (Object.keys(errors).length)
    return {
      ok: false,
      message: 'Kiểm tra lại thông tin bên dưới.',
      errors,
      values: valuesOf(fd, ['name', 'phone', 'email', 'message']),
    }

  const payload = await getPayloadClient()
  await payload.create({
    collection: 'contacts',
    overrideAccess: true,
    data: {
      name,
      phone,
      email: email || undefined,
      type,
      message: [device && `Thiết bị: ${device}`, message].filter(Boolean).join('\n') || undefined,
      product: productId,
    },
  })

  return {
    ok: true,
    message:
      type === 'service'
        ? 'Kỹ thuật viên sẽ gọi lại cho bạn trong giờ làm việc để hẹn lịch.'
        : 'Đã gửi. Chúng tôi sẽ liên hệ lại sớm.',
  }
}

/** Đặt hàng: giá luôn lấy lại từ DB, không tin giá gửi từ trình duyệt. */
export async function placeOrder(_: FormState | null, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: false, message: 'Không gửi được đơn.' }

  const customerName = clean(fd.get('name'), 100)
  const customerPhone = clean(fd.get('phone'), 20).replace(/[\s.-]/g, '')
  const customerEmail = clean(fd.get('email'), 120)
  const address = clean(fd.get('address'), 300)
  const note = clean(fd.get('note'), 1000)

  let lines: { id: number; qty: number }[] = []
  try {
    lines = (JSON.parse(String(fd.get('items') ?? '[]')) as { id: number; qty: number }[])
      .map((l) => ({ id: Number(l.id), qty: Math.max(1, Math.min(99, Math.floor(Number(l.qty)))) }))
      .filter((l) => l.id && l.qty)
  } catch {}

  const errors: Record<string, string> = {}
  if (customerName.length < 2) errors.name = 'Nhập họ tên người nhận'
  if (!PHONE_RE.test(customerPhone)) errors.phone = 'Số điện thoại chưa đúng (VD: 0909123456)'
  if (customerEmail && !/^\S+@\S+\.\S+$/.test(customerEmail))
    errors.email = 'Email chưa đúng định dạng'
  if (address.length < 8) errors.address = 'Nhập địa chỉ giao hàng đầy đủ'
  const values = valuesOf(fd, ['name', 'phone', 'email', 'address', 'note'])
  if (!lines.length) return { ok: false, message: 'Giỏ hàng đang trống.', values }
  if (Object.keys(errors).length)
    return { ok: false, message: 'Kiểm tra lại thông tin bên dưới.', errors, values }

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { and: [{ id: { in: lines.map((l) => l.id) } }, { _status: { equals: 'published' } }] },
    limit: lines.length,
    depth: 0,
  })

  const items = []
  for (const line of lines) {
    const p = docs.find((d) => d.id === line.id)
    const price = p?.salePrice ?? p?.price
    if (!p || price == null || p.stockStatus === 'out_of_stock') {
      return {
        ok: false,
        message: `Sản phẩm "${p?.name ?? '#' + line.id}" hiện không đặt online được. Vui lòng gọi hotline.`,
        values,
      }
    }
    items.push({ product: p.id, name: p.name, unitPrice: price, quantity: line.qty })
  }

  const order = await payload.create({
    collection: 'orders',
    overrideAccess: true,
    data: {
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      address,
      note: note || undefined,
      items,
      paymentMethod: 'cod',
    },
  })

  return { ok: true, message: 'Đặt hàng thành công.', orderCode: order.code ?? undefined }
}
