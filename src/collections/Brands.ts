import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '@/access'
import { slugField } from '@/fields/slug'

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: { singular: 'Thương hiệu', plural: 'Thương hiệu' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'featured'],
    group: 'Sản phẩm',
    pagination: { defaultLimit: 25 },
  },
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'name', type: 'text', label: 'Tên thương hiệu', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
    { name: 'description', type: 'textarea', label: 'Giới thiệu' },
    { name: 'featured', type: 'checkbox', label: 'Hiện ở trang chủ', defaultValue: false },
    slugField('name'),
  ],
}
