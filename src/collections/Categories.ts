import { createBreadcrumbsField, createParentField } from '@payloadcms/plugin-nested-docs'
import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '@/access'
import { slugField } from '@/fields/slug'

/** Danh mục sản phẩm, hỗ trợ nhiều cấp (Laptop > Laptop gaming). */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Danh mục', plural: 'Danh mục sản phẩm' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'order', 'showInMenu'],
    group: 'Sản phẩm',
    pagination: { defaultLimit: 25 },
  },
  defaultSort: 'order',
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin',
          fields: [
            { name: 'name', type: 'text', label: 'Tên danh mục', required: true },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh / icon' },
            { name: 'description', type: 'textarea', label: 'Mô tả' },
            {
              type: 'row',
              fields: [
                {
                  name: 'order',
                  type: 'number',
                  label: 'Thứ tự',
                  defaultValue: 0,
                  admin: { description: 'Số nhỏ hiển thị trước' },
                },
                {
                  name: 'showInMenu',
                  type: 'checkbox',
                  label: 'Hiện trên menu',
                  defaultValue: true,
                },
              ],
            },
          ],
        },
      ],
    },
    // Các trường bên dưới nằm ở cột phải; tab SEO được plugin thêm vào sau
    slugField('name'),
    createParentField('categories', {
      label: 'Danh mục cha',
      admin: {
        position: 'sidebar',
        description:
          'Để trống nếu đây là danh mục lớn (VD: Laptop). Chọn cha nếu là danh mục con (VD: Laptop gaming).',
        components: { Cell: '/components/admin/cells#CategoryCell' },
      },
    }),
    // Đường dẫn cha-con, plugin tự tính — không cần sửa tay
    createBreadcrumbsField('categories', { admin: { hidden: true } }),
  ],
}
