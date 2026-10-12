'use client'

import { CheckCircle2, Loader2, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useActionState, useEffect } from 'react'

import { Input } from '@/components/forms/ContactForm'
import { EmptyState } from '@/components/ui'
import { placeOrder } from '@/lib/actions'
import { formatVND, PLACEHOLDER } from '@/lib/format'

import { useCart } from './CartProvider'

export function CartView() {
  const { items, total, ready, setQty, remove, clear } = useCart()
  const [state, action, pending] = useActionState(placeOrder, null)

  useEffect(() => {
    if (state?.ok) {
      clear()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [state, clear])

  if (state?.ok) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center" role="status">
        <CheckCircle2 size={52} className="mx-auto text-ok" />
        <h2 className="mt-4 font-display text-2xl font-bold text-harbor">Đặt hàng thành công</h2>
        <p className="mt-2">
          Mã đơn của bạn:{' '}
          <strong className="font-display text-lg text-harbor">{state.orderCode}</strong>
        </p>
        <p className="mt-2 text-muted">
          Nhân viên sẽ gọi xác nhận đơn và thời gian giao hàng. Thanh toán khi nhận hàng.
        </p>
        <Link href="/san-pham" className="btn btn-outline mt-6">
          Tiếp tục mua sắm
        </Link>
      </div>
    )
  }

  if (!ready) return <div className="h-40" aria-busy="true" />

  if (!items.length) {
    return (
      <EmptyState title="Giỏ hàng đang trống">
        <Link href="/san-pham" className="text-sky-ink underline">
          Xem sản phẩm
        </Link>{' '}
        để thêm vào giỏ.
      </EmptyState>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <ul className="divide-y divide-line border-y border-line">
        {items.map((i) => (
          <li key={i.id} className="flex gap-4 py-4">
            <Link
              href={`/san-pham/${i.slug}`}
              className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-box bg-paper"
            >
              <Image
                src={i.image ?? PLACEHOLDER.square}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Link
                  href={`/san-pham/${i.slug}`}
                  className="line-clamp-2 font-medium hover:text-sky-ink"
                >
                  {i.name}
                </Link>
                <p className="mt-0.5 text-sm text-muted">{formatVND(i.price)}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="inline-flex h-10 items-center rounded-box border border-line">
                  <button
                    type="button"
                    onClick={() => setQty(i.id, i.qty - 1)}
                    disabled={i.qty <= 1}
                    className="flex h-full w-9 items-center justify-center disabled:opacity-40"
                    aria-label="Giảm"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-7 text-center tabular-nums">{i.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(i.id, i.qty + 1)}
                    className="flex h-full w-9 items-center justify-center"
                    aria-label="Tăng"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <p className="w-28 text-right font-display font-bold text-harbor">
                  {formatVND(i.price * i.qty)}
                </p>
                <button
                  type="button"
                  onClick={() => remove(i.id)}
                  className="text-muted hover:text-danger"
                  aria-label={`Xoá ${i.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <form
        action={action}
        className="space-y-4 rounded-panel border border-line p-5 md:p-6"
        noValidate
      >
        <h2 className="font-display text-xl font-bold text-harbor">Thông tin nhận hàng</h2>
        <input
          type="hidden"
          name="items"
          value={JSON.stringify(items.map((i) => ({ id: i.id, qty: i.qty })))}
        />
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />
        <Input
          label="Họ tên"
          name="name"
          autoComplete="name"
          defaultValue={state?.values?.name}
          error={state?.errors?.name}
        />
        <Input
          label="Số điện thoại"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          defaultValue={state?.values?.phone}
          error={state?.errors?.phone}
        />
        <Input
          label="Email (không bắt buộc)"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state?.values?.email}
          error={state?.errors?.email}
        />
        <Input
          label="Địa chỉ giao hàng"
          name="address"
          autoComplete="street-address"
          defaultValue={state?.values?.address}
          error={state?.errors?.address}
        />
        <div>
          <label htmlFor="f-note" className="mb-1 block text-sm font-semibold">
            Ghi chú
          </label>
          <textarea
            id="f-note"
            name="note"
            rows={2}
            defaultValue={state?.values?.note}
            className="field"
            placeholder="Giờ nhận hàng, thông tin xuất hoá đơn VAT…"
          />
        </div>

        <div className="rounded-box bg-paper p-4">
          <p className="text-sm font-semibold">Thanh toán</p>
          <p className="mt-1 text-sm text-muted">
            Tiền mặt khi nhận hàng (COD). Thanh toán online VNPAY sẽ có sớm.
          </p>
        </div>

        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <span className="text-muted">Tạm tính</span>
          <span className="font-display text-2xl font-bold text-harbor">{formatVND(total)}</span>
        </div>
        {state && !state.ok && <p className="text-sm text-danger">{state.message}</p>}
        <button type="submit" disabled={pending} className="btn btn-primary h-12 w-full text-base">
          {pending && <Loader2 size={18} className="animate-spin" />}
          {pending ? 'Đang đặt hàng…' : 'Đặt hàng'}
        </button>
      </form>
    </div>
  )
}
