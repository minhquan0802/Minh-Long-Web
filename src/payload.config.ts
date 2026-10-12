import { postgresAdapter } from '@payloadcms/db-postgres'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vi } from '@payloadcms/translations/languages/vi'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Brands } from './collections/Brands'
import { Categories } from './collections/Categories'
import { Contacts } from './collections/Contacts'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { Services } from './collections/Services'
import { Users } from './collections/Users'
import { viOverrides } from './admin-translations'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** Đường dẫn công khai của từng loại nội dung — dùng cho SEO preview. */
const URL_PREFIX: Record<string, string> = {
  products: '/san-pham',
  services: '/dich-vu',
  posts: '/bai-viet',
  pages: '',
}

const hideApiTab = <T extends { admin?: object }>(entity: T): T => ({
  ...entity,
  admin: { ...entity.admin, hideAPIURL: true },
})

export default buildConfig({
  serverURL: SITE_URL,
  admin: {
    user: Users.slug,
    // Ngày giờ kiểu Việt Nam: 12/10/2026 11:54
    dateFormat: 'dd/MM/yyyy HH:mm',
    meta: { titleSuffix: ' – Quản trị Minh Long', icons: [{ url: '/logo-minh-long.png' }] },
    components: {
      // Nút sáng/tối trên thanh trên cùng
      actions: ['/components/admin/ThemeToggle#ThemeToggle'],
      graphics: {
        Icon: '/components/admin/Brand#AdminIcon',
        Logo: '/components/admin/Brand#AdminLogo',
      },
      views: {
        dashboard: { Component: '/components/admin/Dashboard#Dashboard' },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    supportedLanguages: { vi },
    fallbackLanguage: 'vi',
    // Chữ dễ hiểu hơn cho nhân viên — xem src/admin-translations.ts
    translations: { vi: viOverrides },
  },
  // Thứ tự ở đây = thứ tự nhóm trên menu admin
  // Ẩn tab "API" (chỉ dành cho lập trình viên) ở mọi form sửa
  collections: [
    Orders,
    Contacts,
    Products,
    Categories,
    Brands,
    Services,
    Posts,
    Pages,
    Media,
    Users,
  ].map(hideApiTab),
  globals: [SiteSettings, Homepage].map(hideApiTab),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    nestedDocsPlugin({
      collections: ['categories'],
      generateLabel: (_, doc) => String(doc.name ?? ''),
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    seoPlugin({
      collections: ['products', 'services', 'posts', 'pages', 'categories'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => `${doc?.name || doc?.title || ''} | Minh Long`,
      generateDescription: ({ doc }) => {
        const text = doc?.shortDescription || doc?.summary || doc?.excerpt || doc?.description
        return typeof text === 'string' ? text.slice(0, 160) : ''
      },
      generateImage: ({ doc }) => doc?.images?.[0] || doc?.image || doc?.cover,
      generateURL: ({ doc, collectionConfig }) =>
        `${SITE_URL}${URL_PREFIX[collectionConfig?.slug ?? ''] ?? ''}/${doc?.slug ?? ''}`,
    }),
  ],
})
