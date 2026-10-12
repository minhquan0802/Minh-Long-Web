import type { CollectionConfig } from 'payload'

import { isEditor, publishedOrLoggedIn } from '@/access'
import { slugField } from '@/fields/slug'

/** Trang tĩnh: Giới thiệu, Chính sách bảo hành, Vận chuyển, Đổi trả... */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Trang', plural: 'Trang tĩnh' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isPolicy', '_status'],
    group: 'Nội dung',
    pagination: { defaultLimit: 25 },
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrLoggedIn, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Nội dung',
          fields: [
            { name: 'title', type: 'text', label: 'Tiêu đề', required: true },
            { name: 'cover', type: 'upload', relationTo: 'media', label: 'Ảnh bìa' },
            { name: 'content', type: 'richText', label: 'Nội dung', required: true },
          ],
        },
      ],
    },
    // Các trường bên dưới nằm ở cột phải; tab SEO được plugin thêm vào sau
    slugField(),
    {
      name: 'isPolicy',
      type: 'checkbox',
      label: 'Là trang chính sách (hiện ở footer)',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
