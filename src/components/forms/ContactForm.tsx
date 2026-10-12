'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'
import { useActionState } from 'react'

import { submitContact } from '@/lib/actions'

type Props = {
  type?: 'contact' | 'quote' | 'service'
  productId?: number
  defaultMessage?: string
  submitLabel?: string
}

export function ContactForm({
  type = 'contact',
  productId,
  defaultMessage,
  submitLabel = 'Gửi liên hệ',
}: Props) {
  const [state, action, pending] = useActionState(submitContact, null)

  if (state?.ok) {
    return (
      <div
        className="flex items-start gap-3 rounded-box border border-ok/30 bg-[#eef8f2] p-4"
        role="status"
      >
        <CheckCircle2 className="mt-0.5 shrink-0 text-ok" />
        <p>{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="type" value={type} />
      {productId && <input type="hidden" name="product" value={productId} />}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>
      <Input
        label="Email (không bắt buộc)"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state?.values?.email}
        error={state?.errors?.email}
      />
      <div>
        <label htmlFor="cf-message" className="mb-1 block text-sm font-semibold">
          Nội dung
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          defaultValue={state?.values?.message ?? defaultMessage}
          className="field"
        />
      </div>
      {state && !state.ok && <p className="text-sm text-danger">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending && <Loader2 size={18} className="animate-spin" />}
        {pending ? 'Đang gửi…' : submitLabel}
      </button>
    </form>
  )
}

export function Input({
  label,
  name,
  error,
  ...rest
}: { label: string; name: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `f-${name}`
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
