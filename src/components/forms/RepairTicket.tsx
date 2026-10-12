'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'
import { useActionState, useState } from 'react'

import { submitContact } from '@/lib/actions'

const DEVICES = ['Laptop', 'Máy bàn', 'Máy in', 'Camera', 'Mạng / Wifi', 'Khác']

/**
 * Phiếu yêu cầu kỹ thuật — điểm nhấn của trang chủ.
 * Hình dạng phiếu tiếp nhận: dải vàng ở đầu, hai lỗ bấm ở mép, đường xé nét đứt.
 */
export function RepairTicket() {
  const [state, action, pending] = useActionState(submitContact, null)
  const [device, setDevice] = useState('Laptop')

  return (
    <div className="relative rounded-panel bg-white text-ink shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)]">
      <div className="flex items-center justify-between rounded-t-panel bg-signal px-5 py-3 text-harbor-deep">
        <p className="font-display text-[17px] font-bold">Phiếu yêu cầu kỹ thuật</p>
        <p className="text-[13px] font-medium">Miễn phí kiểm tra</p>
      </div>

      {/* Đường xé + 2 lỗ ở mép phiếu */}
      <div className="relative h-0" aria-hidden>
        <span className="absolute top-[-9px] -left-[9px] h-[18px] w-[18px] rounded-full bg-harbor" />
        <span className="absolute top-[-9px] -right-[9px] h-[18px] w-[18px] rounded-full bg-harbor" />
      </div>

      {state?.ok ? (
        <div className="flex flex-col items-center px-6 py-12 text-center" role="status">
          <CheckCircle2 size={44} className="text-ok" />
          <p className="mt-3 font-display text-xl font-bold text-harbor">Đã nhận phiếu</p>
          <p className="mt-1 max-w-[34ch] text-muted">{state.message}</p>
        </div>
      ) : (
        <form
          action={action}
          className="space-y-4 border-t-2 border-dashed border-line px-5 pt-5 pb-6"
          noValidate
        >
          <input type="hidden" name="type" value="service" />
          <input type="hidden" name="device" value={device} />
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden
          />

          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Thiết bị cần xử lý</legend>
            <div className="flex flex-wrap gap-2">
              {DEVICES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDevice(d)}
                  aria-pressed={device === d}
                  className={`rounded-box border px-3 py-1.5 text-sm font-medium transition-colors ${
                    device === d
                      ? 'border-harbor bg-harbor text-white'
                      : 'border-line hover:border-sky'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Họ tên"
              name="name"
              autoComplete="name"
              defaultValue={state?.values?.name}
              error={state?.errors?.name}
            />
            <Field
              label="Số điện thoại"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              defaultValue={state?.values?.phone}
              error={state?.errors?.phone}
            />
          </div>
          <div>
            <label htmlFor="rt-message" className="mb-1 block text-sm font-semibold">
              Mô tả lỗi <span className="font-normal text-muted">(không bắt buộc)</span>
            </label>
            <textarea
              id="rt-message"
              name="message"
              rows={2}
              defaultValue={state?.values?.message}
              className="field resize-none"
              placeholder="VD: Laptop không lên nguồn, máy in kẹt giấy…"
            />
          </div>

          {state && !state.ok && <p className="text-sm text-danger">{state.message}</p>}

          <button type="submit" disabled={pending} className="btn btn-primary w-full">
            {pending && <Loader2 size={18} className="animate-spin" />}
            {pending ? 'Đang gửi…' : 'Gửi yêu cầu'}
          </button>
          <p className="text-center text-[13px] text-muted">
            Kỹ thuật viên gọi lại để hẹn giờ, báo giá trước khi làm.
          </p>
        </form>
      )}
    </div>
  )
}

function Field({
  label,
  name,
  error,
  ...rest
}: { label: string; name: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `rt-${name}`
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        name={name}
        className="field"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1 text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
