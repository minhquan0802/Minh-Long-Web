import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

type Role = NonNullable<User['roles']>[number]

const hasRole = (user: unknown, ...roles: Role[]) =>
  Boolean((user as User | null)?.roles?.some((r) => roles.includes(r)))

export const anyone: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const isAdmin: Access = ({ req }) => hasRole(req.user, 'admin')

export const isAdminField: FieldAccess = ({ req }) => hasRole(req.user, 'admin')

/** Admin + biên tập viên: quản lý nội dung, sản phẩm. */
export const isEditor: Access = ({ req }) => hasRole(req.user, 'admin', 'editor')

/** Admin + nhân viên bán hàng: xử lý đơn hàng, liên hệ. */
export const isSales: Access = ({ req }) => hasRole(req.user, 'admin', 'sales')

/** Khách chỉ thấy bản đã xuất bản; người đăng nhập thấy cả bản nháp. */
export const publishedOrLoggedIn: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

/** Ẩn mục khỏi menu admin với người không có vai trò phù hợp (quyền truy cập vẫn do `access` quyết định). */
export const hiddenUnless =
  (...roles: Role[]) =>
  ({ user }: { user: unknown }) =>
    !hasRole(user, ...roles)
