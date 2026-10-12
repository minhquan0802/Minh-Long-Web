import type { GlobalConfig } from 'payload'

import { anyone, hiddenUnless, isAdmin } from '@/access'

/** Thông tin chung: liên hệ, mạng xã hội, footer. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cài đặt chung',
  admin: { group: 'Cài đặt', hidden: hiddenUnless('admin') },
  access: { read: anyone, update: isAdmin },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin công ty',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              label: 'Tên website',
              required: true,
              defaultValue: 'Minh Long',
            },
            { name: 'companyName', type: 'text', label: 'Tên công ty đầy đủ' },
            { name: 'tagline', type: 'text', label: 'Khẩu hiệu' },
            { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
            { name: 'taxCode', type: 'text', label: 'Mã số thuế' },
          ],
        },
        {
          label: 'Liên hệ',
          fields: [
            {
              name: 'hotlines',
              type: 'array',
              label: 'Hotline',
              labels: { singular: 'Số', plural: 'Số điện thoại' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'number', type: 'text', label: 'Số điện thoại', required: true },
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Ghi chú',
                      admin: { placeholder: 'Kỹ thuật / Bán hàng' },
                    },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'zalo',
                  type: 'text',
                  label: 'Số Zalo',
                  admin: { description: 'Dùng cho nút "Chat Zalo"' },
                },
                { name: 'email', type: 'email', label: 'Email' },
              ],
            },
            {
              name: 'addresses',
              type: 'array',
              label: 'Địa chỉ',
              labels: { singular: 'Địa chỉ', plural: 'Địa chỉ' },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Tên chi nhánh',
                  admin: { placeholder: 'Trụ sở chính' },
                },
                { name: 'address', type: 'text', label: 'Địa chỉ', required: true },
                { name: 'mapUrl', type: 'text', label: 'Link Google Maps' },
              ],
            },
            {
              name: 'workingHours',
              type: 'text',
              label: 'Giờ làm việc',
              admin: { placeholder: 'T2 – T7: 8:00 – 18:00' },
            },
          ],
        },
        {
          label: 'Mạng xã hội',
          fields: [
            { name: 'facebook', type: 'text', label: 'Facebook' },
            { name: 'youtube', type: 'text', label: 'YouTube' },
            { name: 'tiktok', type: 'text', label: 'TikTok' },
            { name: 'messenger', type: 'text', label: 'Link Messenger (m.me/...)' },
          ],
        },
        {
          label: 'Chân trang',
          fields: [{ name: 'footerAbout', type: 'textarea', label: 'Giới thiệu ngắn ở footer' }],
        },
      ],
    },
  ],
}
