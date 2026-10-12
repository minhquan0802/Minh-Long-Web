import type { CollectionConfig } from 'payload'

import { isEditor, publishedOrLoggedIn } from '@/access'
import { slugField } from '@/fields/slug'

export const POST_TYPES = [
  { label: 'Tin công nghệ', value: 'tin-tuc' },
  { label: 'Hỗ trợ kỹ thuật', value: 'ho-tro' },
  { label: 'Khuyến mãi', value: 'khuyen-mai' },
  { label: 'Giải pháp', value: 'giai-phap' },
  { label: 'Tuyển dụng', value: 'tuyen-dung' },
] as const

/** Tất cả bài viết dùng chung một bảng, phân loại bằng `type`. */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Bài viết', plural: 'Bài viết' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'publishedAt', '_status'],
    group: 'Nội dung',
    pagination: { defaultLimit: 25 },
  },
  defaultSort: '-publishedAt',
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
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Tóm tắt',
              admin: { description: 'Hiện ở danh sách bài viết' },
            },
            { name: 'content', type: 'richText', label: 'Nội dung', required: true },
            {
              type: 'collapsible',
              label: 'Thông tin khuyến mãi',
              admin: { condition: (data) => data?.type === 'khuyen-mai' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'promoStart', type: 'date', label: 'Bắt đầu' },
                    { name: 'promoEnd', type: 'date', label: 'Kết thúc' },
                  ],
                },
                {
                  name: 'promoProducts',
                  type: 'relationship',
                  relationTo: 'products',
                  hasMany: true,
                  label: 'Sản phẩm áp dụng',
                },
              ],
            },
          ],
        },
      ],
    },
    // Các trường bên dưới nằm ở cột phải; tab SEO được plugin thêm vào sau
    {
      name: 'type',
      type: 'select',
      label: 'Chuyên mục',
      required: true,
      defaultValue: 'tin-tuc',
      options: [...POST_TYPES],
      index: true,
      admin: { position: 'sidebar' },
    },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Ngày đăng',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) =>
            value ?? (siblingData._status === 'published' ? new Date() : value),
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Người viết',
      admin: { position: 'sidebar' },
      hooks: {
        beforeChange: [
          ({ value, req, operation }) => (operation === 'create' && !value ? req.user?.id : value),
        ],
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Bài nổi bật',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
