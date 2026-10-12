/**
 * Tạo dữ liệu mẫu:  npm run seed
 * CẢNH BÁO: xoá toàn bộ sản phẩm, danh mục, bài viết, ảnh... hiện có (giữ lại tài khoản).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload, type CollectionSlug } from 'payload'

import config from '@payload-config'

import { brands, categories, pages, posts, products, services } from './data'
import { brandLogo, coverImage, productImage } from './images'
import { rich } from './lexical'
import { slugifyVi } from '@/lib/slugify'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)

const upload = async (data: Buffer, name: string, alt: string) =>
  payload.create({
    collection: 'media',
    data: { alt },
    file: { data, name: `${name}.png`, mimetype: 'image/png', size: data.length },
  })

// 1. Xoá dữ liệu cũ
const wipe: CollectionSlug[] = [
  'orders',
  'contacts',
  'posts',
  'products',
  'services',
  'pages',
  'brands',
  'categories',
  'media',
]
for (const collection of wipe) {
  await payload.delete({ collection, where: { id: { exists: true } }, overrideAccess: true })
}
log('Đã xoá dữ liệu cũ')

// 2. Thương hiệu
const brandIds: Record<string, number> = {}
for (const name of brands) {
  const logo = await upload(await brandLogo(name), `brand-${name.toLowerCase()}`, `Logo ${name}`)
  const doc = await payload.create({
    collection: 'brands',
    data: { name, slug: slugifyVi(name), logo: logo.id, featured: true },
  })
  brandIds[name] = doc.id
}
log(`${brands.length} thương hiệu`)

// 3. Danh mục (2 cấp)
const categoryIds: Record<string, number> = {}
let order = 0
for (const cat of categories) {
  const img = await productImage(cat.icon, order)
  const media = await upload(img, `cat-${cat.slug}`, cat.name)
  const parent = await payload.create({
    collection: 'categories',
    data: {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: media.id,
      order: order++,
    },
  })
  categoryIds[cat.slug] = parent.id
  for (const [i, child] of (cat.children ?? []).entries()) {
    const doc = await payload.create({
      collection: 'categories',
      data: { name: child.name, slug: child.slug, parent: parent.id, order: i },
    })
    categoryIds[child.slug] = doc.id
  }
}
log(`${Object.keys(categoryIds).length} danh mục`)

// 4. Sản phẩm
const productIds: number[] = []
for (const [i, p] of products.entries()) {
  const images = []
  for (let v = 0; v < 2; v++) {
    const m = await upload(
      await productImage(p.icon, i + v),
      `${p.sku.toLowerCase()}-${v + 1}`,
      p.name,
    )
    images.push(m.id)
  }
  const doc = await payload.create({
    collection: 'products',
    data: {
      name: p.name,
      slug: slugifyVi(p.name),
      category: categoryIds[p.category],
      brand: brandIds[p.brand],
      price: p.price,
      salePrice: p.sale,
      sku: p.sku,
      images,
      shortDescription: p.short,
      description: rich(
        p.short,
        { h2: 'Điểm nổi bật' },
        { ul: p.specs.map(([l, v]) => `${l}: ${v}`) },
        'Sản phẩm chính hãng, đầy đủ hoá đơn VAT. Minh Long hỗ trợ cài đặt và giao hàng tận nơi.',
      ),
      specs: p.specs.map(([label, value]) => ({ label, value })),
      warranty: p.warranty,
      stockStatus: p.stock ?? 'in_stock',
      featured: Boolean(p.featured),
      _status: 'published',
    },
  })
  productIds.push(doc.id)
}
log(`${products.length} sản phẩm`)

// 5. Dịch vụ
const serviceIds: number[] = []
for (const [i, s] of services.entries()) {
  const cover = await upload(await coverImage(s.lucide, i), `dich-vu-${i + 1}`, s.title)
  const doc = await payload.create({
    collection: 'services',
    data: {
      title: s.title,
      slug: slugifyVi(s.title),
      summary: s.summary,
      priceFrom: s.priceFrom,
      icon: s.icon as 'wrench',
      image: cover.id,
      order: i,
      featured: i < 6,
      highlights: s.highlights.map((text) => ({ text })),
      content: rich(
        s.summary,
        { h2: 'Quy trình làm việc' },
        {
          ul: [
            'Tiếp nhận yêu cầu qua hotline, Zalo hoặc form trên website',
            'Kỹ thuật viên kiểm tra, báo giá rõ ràng trước khi làm',
            'Thực hiện, bàn giao và hướng dẫn sử dụng',
            'Bảo hành và hỗ trợ sau dịch vụ',
          ],
        },
      ),
      _status: 'published',
    },
  })
  serviceIds.push(doc.id)
}
log(`${services.length} dịch vụ`)

// 6. Bài viết
for (const [i, p] of posts.entries()) {
  const cover = await upload(await coverImage(p.icon, i), `bai-viet-${i + 1}`, p.title)
  const publishedAt = new Date(Date.now() - p.daysAgo * 86_400_000).toISOString()
  await payload.create({
    collection: 'posts',
    data: {
      title: p.title,
      slug: slugifyVi(p.title),
      type: p.type,
      excerpt: p.excerpt,
      cover: cover.id,
      content: rich(...p.body),
      publishedAt,
      featured: Boolean(p.featured),
      ...(p.type === 'khuyen-mai'
        ? {
            promoStart: publishedAt,
            promoEnd: new Date(Date.now() + 30 * 86_400_000).toISOString(),
            promoProducts: productIds.slice(0, 4),
          }
        : {}),
      _status: 'published',
    },
  })
}
log(`${posts.length} bài viết`)

// 7. Trang tĩnh
for (const p of pages) {
  await payload.create({
    collection: 'pages',
    data: {
      title: p.title,
      slug: p.slug,
      isPolicy: p.isPolicy,
      content: rich(...p.body),
      _status: 'published',
    },
  })
}
log(`${pages.length} trang tĩnh`)

// 8. Cài đặt chung + trang chủ
const logoBuf = fs.readFileSync(path.join(dirname, 'assets/logo.png'))
const logo = await upload(logoBuf, 'logo-minh-long', 'Logo Minh Long')

await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    siteName: 'Minh Long',
    companyName: 'Công ty TNHH Công nghệ Minh Long',
    tagline: 'Thiết bị công nghệ & dịch vụ kỹ thuật tận nơi',
    logo: logo.id,
    hotlines: [
      { number: '0909 123 456', label: 'Bán hàng' },
      { number: '0909 654 321', label: 'Kỹ thuật' },
    ],
    zalo: '0909123456',
    email: 'lienhe@minhlong.vn',
    addresses: [
      { label: 'Cửa hàng', address: '123 Đường Ví Dụ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh' },
    ],
    workingHours: 'Thứ 2 – Thứ 7: 8:00 – 18:00',
    facebook: 'https://facebook.com/',
    youtube: 'https://youtube.com/',
    footerAbout:
      'Minh Long cung cấp laptop, máy tính, camera, thiết bị mạng chính hãng và dịch vụ sửa chữa, bảo trì tận nơi cho gia đình và doanh nghiệp.',
  },
})

await payload.updateGlobal({
  slug: 'homepage',
  data: {
    heroTitle: 'Máy hỏng, mạng chập chờn? Kỹ thuật Minh Long có mặt trong 2 giờ.',
    heroSubtitle:
      'Sửa laptop, máy in, lắp camera và mạng Wifi cho nhà ở và văn phòng. Kiểm tra miễn phí, báo giá trước khi làm.',
    heroCtaLabel: 'Xem dịch vụ',
    heroCtaLink: '/dich-vu',
    featuredCategories: ['laptop', 'camera-an-ninh', 'thiet-bi-mang', 'may-in-muc-in'].map(
      (s) => categoryIds[s],
    ),
    aboutTitle: 'Một đầu mối cho mọi việc công nghệ của bạn',
    aboutText:
      'Từ chiếc laptop cho nhân viên mới đến hệ thống camera, mạng cho cả văn phòng — Minh Long tư vấn, cung cấp thiết bị và chăm sóc kỹ thuật lâu dài, để bạn yên tâm làm việc.',
    stats: [
      { value: '10+', label: 'năm kinh nghiệm' },
      { value: '2.000+', label: 'khách hàng' },
      { value: '2 giờ', label: 'có mặt nội thành' },
      { value: '100%', label: 'hàng chính hãng' },
    ],
    reasonsTitle: 'Vì sao khách hàng chọn Minh Long',
    reasons: [
      {
        title: 'Báo giá trước, làm sau',
        description: 'Kiểm tra miễn phí, báo rõ chi phí và chỉ sửa khi bạn đồng ý.',
      },
      {
        title: 'Hàng chính hãng, có hoá đơn',
        description: 'Nhập từ nhà phân phối chính thức, xuất hoá đơn VAT đầy đủ.',
      },
      {
        title: 'Kỹ thuật đến tận nơi',
        description: 'Nội thành có mặt trong khoảng 2 giờ, hỗ trợ từ xa khi cần gấp.',
      },
      {
        title: 'Bảo hành tại chỗ',
        description: 'Nhận và trả bảo hành tận nơi cho khách doanh nghiệp.',
      },
    ],
  },
})
log('Cài đặt chung + trang chủ')
log('Hoàn tất ✔')
process.exit(0)
