import type { CollectionConfig } from 'payload'

import { hiddenUnless, isAdmin, isSales } from '@/access'

/** Form liên hệ / yêu cầu báo giá / đặt lịch sửa chữa từ website. */
export const Contacts: CollectionConfig = {
  slug: 'contacts',
  labels: { singular: 'Liên hệ', plural: 'Liên hệ & Báo giá' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'type', 'status', 'createdAt'],
    listSearchableFields: ['name', 'phone', 'email'],
    group: 'Bán hàng',
    hidden: hiddenUnless('admin', 'sales'),
    pagination: { defaultLimit: 25 },
  },
  defaultSort: '-createdAt',
  // Tạo từ route form phía server (có kiểm tra + chống spam)
  access: { read: isSales, create: isAdmin, update: isSales, delete: isAdmin },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: 'Họ tên', required: true },
        { name: 'phone', type: 'text', label: 'Điện thoại', required: true },
        { name: 'email', type: 'email', label: 'Email' },
      ],
    },
    { name: 'company', type: 'text', label: 'Công ty' },
    { name: 'message', type: 'textarea', label: 'Nội dung' },
    { name: 'product', type: 'relationship', relationTo: 'products', label: 'Sản phẩm quan tâm' },
    { name: 'service', type: 'relationship', relationTo: 'services', label: 'Dịch vụ quan tâm' },
    { name: 'internalNote', type: 'textarea', label: 'Ghi chú nội bộ' },
    {
      name: 'type',
      type: 'select',
      label: 'Loại yêu cầu',
      defaultValue: 'contact',
      options: [
        { label: 'Liên hệ chung', value: 'contact' },
        { label: 'Yêu cầu báo giá', value: 'quote' },
        { label: 'Đặt lịch sửa chữa', value: 'service' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái',
      defaultValue: 'new',
      options: [
        { label: 'Mới', value: 'new' },
        { label: 'Đã liên hệ lại', value: 'contacted' },
        { label: 'Hoàn tất', value: 'done' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
