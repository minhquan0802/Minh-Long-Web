import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Hình ảnh', plural: 'Thư viện ảnh' },
  admin: { group: 'Nội dung', pagination: { defaultLimit: 25 } },
  access: {
    read: anyone,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Mô tả ảnh (alt)',
      admin: {
        description: 'Mô tả ngắn nội dung ảnh, giúp SEO hình ảnh. Để trống sẽ dùng tên file.',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    // Tự tạo các kích thước, lưu dạng WebP cho nhẹ
    formatOptions: { format: 'webp', options: { quality: 82 } },
    resizeOptions: { width: 2000, withoutEnlargement: true },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        fit: 'cover',
        formatOptions: { format: 'webp' },
      },
      { name: 'card', width: 600, formatOptions: { format: 'webp' } },
      { name: 'large', width: 1200, formatOptions: { format: 'webp' } },
    ],
    adminThumbnail: 'thumbnail',
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.alt && data.filename) data.alt = String(data.filename).replace(/\.[^.]+$/, '')
        return data
      },
    ],
  },
}
