import type { CollectionConfig } from 'payload'

import { isEditor, publishedOrLoggedIn } from '@/access'
import { slugField } from '@/fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Sản phẩm', plural: 'Sản phẩm' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'images', 'category', 'price', 'salePrice', 'stockStatus', '_status'],
    listSearchableFields: ['name', 'sku'],
    group: 'Sản phẩm',
    pagination: { defaultLimit: 25 },
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrLoggedIn, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin chung',
          fields: [
            { name: 'name', type: 'text', label: 'Tên sản phẩm', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'category',
                  type: 'relationship',
                  relationTo: 'categories',
                  label: 'Danh mục',
                  required: true,
                  admin: { components: { Cell: '/components/admin/cells#CategoryCell' } },
                },
                { name: 'brand', type: 'relationship', relationTo: 'brands', label: 'Thương hiệu' },
              ],
            },
            {
              type: 'collapsible',
              label: 'Giá bán',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'price',
                      type: 'number',
                      label: 'Giá niêm yết (VNĐ)',
                      min: 0,
                      admin: {
                        description: 'Để trống → hiển thị "Liên hệ"',
                        components: { Cell: '/components/admin/cells#PriceCell' },
                      },
                    },
                    {
                      name: 'salePrice',
                      type: 'number',
                      label: 'Giá khuyến mãi (VNĐ)',
                      min: 0,
                      admin: {
                        description: 'Để trống nếu không giảm giá. % giảm được tự tính.',
                        components: { Cell: '/components/admin/cells#PriceCell' },
                      },
                      validate: (
                        value: number | null | undefined,
                        { siblingData }: { siblingData: { price?: number | null } },
                      ) => {
                        if (value == null) return true
                        if (siblingData.price == null) return 'Cần nhập giá niêm yết trước'
                        if (value >= siblingData.price)
                          return 'Giá khuyến mãi phải thấp hơn giá niêm yết'
                        return true
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Hình ảnh',
              admin: {
                description: 'Ảnh đầu tiên là ảnh đại diện. Kéo thả để sắp xếp.',
                components: { Cell: '/components/admin/cells#ThumbCell' },
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Mô tả ngắn',
              admin: { description: 'Vài dòng nổi bật, hiện cạnh giá ở trang chi tiết' },
            },
          ],
        },
        {
          label: 'Mô tả & Thông số',
          fields: [
            { name: 'description', type: 'richText', label: 'Mô tả chi tiết' },
            {
              name: 'specs',
              type: 'array',
              label: 'Thông số kỹ thuật',
              labels: { singular: 'Thông số', plural: 'Thông số' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Tên',
                      required: true,
                      admin: { placeholder: 'CPU' },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      label: 'Giá trị',
                      required: true,
                      admin: { placeholder: 'Intel Core i5-1335U' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // Các trường bên dưới nằm ở cột phải; tab SEO được plugin thêm vào sau
    slugField('name'),
    {
      name: 'sku',
      type: 'text',
      label: 'Mã sản phẩm (SKU)',
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'stockStatus',
      type: 'select',
      label: 'Tình trạng',
      defaultValue: 'in_stock',
      options: [
        { label: 'Còn hàng', value: 'in_stock' },
        { label: 'Hết hàng', value: 'out_of_stock' },
        { label: 'Đặt trước', value: 'preorder' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'warranty',
      type: 'text',
      label: 'Bảo hành',
      admin: { position: 'sidebar', placeholder: '12 tháng' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Sản phẩm nổi bật',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
