import type { CollectionConfig } from 'payload'

import { hiddenUnless, isAdmin, isAdminField } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Tài khoản', plural: 'Tài khoản' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
    group: 'Cài đặt',
    hidden: hiddenUnless('admin'),
  },
  auth: true,
  access: {
    // Ai cũng tự xem/sửa được tài khoản mình; chỉ admin quản lý người khác
    read: ({ req }) => (isAdmin({ req }) ? true : { id: { equals: req.user?.id } }),
    update: ({ req }) => (isAdmin({ req }) ? true : { id: { equals: req.user?.id } }),
    create: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Họ tên', required: true },
    {
      name: 'roles',
      type: 'select',
      label: 'Vai trò',
      hasMany: true,
      saveToJWT: true,
      required: true,
      defaultValue: ['editor'],
      access: { update: isAdminField },
      options: [
        { label: 'Quản trị viên', value: 'admin' },
        { label: 'Biên tập viên (sản phẩm, bài viết)', value: 'editor' },
        { label: 'Bán hàng (đơn hàng, liên hệ)', value: 'sales' },
      ],
      hooks: {
        // Tài khoản đầu tiên tạo qua /admin luôn là quản trị viên
        beforeChange: [
          async ({ req, operation, value }) => {
            if (operation !== 'create') return value
            const { totalDocs } = await req.payload.count({ collection: 'users', req })
            return totalDocs === 0 ? ['admin'] : value
          },
        ],
      },
    },
  ],
}
