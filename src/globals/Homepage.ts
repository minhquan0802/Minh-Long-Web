import type { GlobalConfig } from 'payload'

import { anyone, hiddenUnless, isEditor } from '@/access'

/** Nội dung trang chủ — chỉnh trong admin, không cần sửa code. */
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Trang chủ',
  admin: { group: 'Cài đặt', hidden: hiddenUnless('admin', 'editor') },
  access: { read: anyone, update: isEditor },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Banner',
          fields: [
            {
              type: 'collapsible',
              label: 'Chữ ở đầu trang (cạnh phiếu sửa chữa)',
              fields: [
                {
                  name: 'heroTitle',
                  type: 'text',
                  label: 'Tiêu đề lớn',
                  admin: { description: 'Để trống sẽ dùng khẩu hiệu trong Cài đặt chung' },
                },
                { name: 'heroSubtitle', type: 'textarea', label: 'Mô tả' },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'heroCtaLabel',
                      type: 'text',
                      label: 'Chữ trên nút',
                      admin: { placeholder: 'Xem dịch vụ' },
                    },
                    {
                      name: 'heroCtaLink',
                      type: 'text',
                      label: 'Link nút',
                      admin: { placeholder: '/dich-vu' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'banners',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Ảnh banner quảng cáo',
              admin: {
                description:
                  'Chọn được nhiều ảnh cùng lúc; ảnh tự chuyển sau 5 giây, kéo thả để đổi thứ tự. Kích thước đẹp nhất: 1920 × 600 px. Để trống thì không hiện dải banner.',
              },
            },
          ],
        },
        {
          label: 'Khối nổi bật',
          fields: [
            {
              name: 'featuredCategories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              label: 'Danh mục hiện ở trang chủ',
              admin: {
                description: 'Mỗi danh mục sẽ có một khối sản phẩm riêng, theo thứ tự chọn',
              },
            },
            {
              name: 'featuredProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'Sản phẩm tiêu biểu',
              admin: { description: 'Để trống → tự lấy các sản phẩm đánh dấu "nổi bật"' },
            },
          ],
        },
        {
          label: 'Giới thiệu & Số liệu',
          fields: [
            { name: 'aboutTitle', type: 'text', label: 'Tiêu đề giới thiệu' },
            { name: 'aboutText', type: 'textarea', label: 'Đoạn giới thiệu' },
            { name: 'aboutImage', type: 'upload', relationTo: 'media', label: 'Ảnh giới thiệu' },
            {
              name: 'stats',
              type: 'array',
              label: 'Số liệu',
              labels: { singular: 'Số liệu', plural: 'Số liệu' },
              maxRows: 6,
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'value',
                      type: 'text',
                      label: 'Con số',
                      required: true,
                      admin: { placeholder: '10+' },
                    },
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Mô tả',
                      required: true,
                      admin: { placeholder: 'Năm kinh nghiệm' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Lý do chọn chúng tôi',
          fields: [
            {
              name: 'reasonsTitle',
              type: 'text',
              label: 'Tiêu đề',
              defaultValue: 'Vì sao chọn Minh Long?',
            },
            {
              name: 'reasons',
              type: 'array',
              label: 'Các lý do',
              labels: { singular: 'Lý do', plural: 'Lý do' },
              maxRows: 8,
              fields: [
                { name: 'title', type: 'text', label: 'Tiêu đề', required: true },
                { name: 'description', type: 'textarea', label: 'Mô tả' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
