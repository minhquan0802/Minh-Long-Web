import type { CollectionConfig } from 'payload'

import { isEditor, publishedOrLoggedIn } from '@/access'
import { slugField } from '@/fields/slug'

/** Dịch vụ: sửa laptop, cứu dữ liệu, bảo trì máy tính... */
export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Dịch vụ', plural: 'Dịch vụ' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'priceFrom', 'order', '_status'],
    group: 'Nội dung',
    pagination: { defaultLimit: 25 },
  },
  defaultSort: 'order',
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrLoggedIn, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Nội dung',
          fields: [
            { name: 'title', type: 'text', label: 'Tên dịch vụ', required: true },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh đại diện' },
            { name: 'summary', type: 'textarea', label: 'Tóm tắt', required: true },
            { name: 'content', type: 'richText', label: 'Nội dung chi tiết' },
            {
              name: 'highlights',
              type: 'array',
              label: 'Điểm nổi bật',
              labels: { singular: 'Ý', plural: 'Các ý' },
              fields: [{ name: 'text', type: 'text', label: 'Nội dung', required: true }],
            },
          ],
        },
      ],
    },
    // Các trường bên dưới nằm ở cột phải; tab SEO được plugin thêm vào sau
    slugField(),
    {
      name: 'priceFrom',
      type: 'text',
      label: 'Giá tham khảo',
      admin: { position: 'sidebar', placeholder: 'Từ 150.000đ' },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Biểu tượng',
      defaultValue: 'wrench',
      options: [
        { label: 'Cờ lê (sửa chữa)', value: 'wrench' },
        { label: 'Laptop', value: 'laptop' },
        { label: 'Máy chủ', value: 'server' },
        { label: 'Ổ cứng / dữ liệu', value: 'hard-drive' },
        { label: 'Máy in', value: 'printer' },
        { label: 'Mạng / Wifi', value: 'wifi' },
        { label: 'Camera', value: 'camera' },
        { label: 'Điện thoại', value: 'phone' },
        { label: 'Phần mềm', value: 'code' },
        { label: 'Đám mây', value: 'cloud' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ tự',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Dịch vụ nổi bật (trang chủ)',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
