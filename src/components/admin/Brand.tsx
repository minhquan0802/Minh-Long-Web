/* eslint-disable @next/next/no-img-element */

/** Icon góc trái menu admin */
export function AdminIcon() {
  return (
    <img
      src="/logo-minh-long.png"
      alt="Minh Long"
      width={28}
      height={28}
      style={{ borderRadius: 5 }}
    />
  )
}

/** Logo trang đăng nhập admin */
export function AdminLogo() {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <img src="/logo-minh-long.png" alt="" width={56} height={56} style={{ borderRadius: 8 }} />
      <span style={{ lineHeight: 1.15 }}>
        <span
          style={{ display: 'block', fontSize: 28, fontWeight: 700, color: 'var(--theme-text)' }}
        >
          Minh Long
        </span>
        <span style={{ display: 'block', fontSize: 14, color: 'var(--theme-elevation-500)' }}>
          Trang quản trị website
        </span>
      </span>
    </span>
  )
}
