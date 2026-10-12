// Sinh src/app/(payload)/nav-icons.scss: icon cho từng mục menu admin.
// Thêm collection mới → thêm 1 dòng vào ICONS rồi chạy: node scripts/gen-admin-nav-icons.mjs
import fs from 'fs'

const ICONS = {
  'nav-orders': 'receipt-text',
  'nav-contacts': 'phone-call',
  'nav-products': 'package',
  'nav-categories': 'layout-grid',
  'nav-brands': 'tag',
  'nav-services': 'wrench',
  'nav-posts': 'newspaper',
  'nav-pages': 'file-text',
  'nav-media': 'images',
  'nav-users': 'users',
  'nav-global-site-settings': 'settings',
  'nav-global-homepage': 'house',
}

const svg = (name) =>
  fs
    .readFileSync(`node_modules/lucide-static/icons/${name}.svg`, 'utf8')
    .replace(/<!--.*?-->/gs, '')
    .replace(/\s*class="[^"]*"/, '')
    .replace(/\s+/g, ' ')
    .trim()

let css = `/* FILE TỰ SINH bởi scripts/gen-admin-nav-icons.mjs — sửa ở script rồi chạy lại. */\n\n`
for (const [id, icon] of Object.entries(ICONS)) {
  const uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg(icon))}`
  css += `#${id}::before {\n  -webkit-mask-image: url("${uri}");\n  mask-image: url("${uri}");\n}\n`
}
fs.writeFileSync('src/app/(payload)/nav-icons.scss', css)
console.log('Đã sinh', Object.keys(ICONS).length, 'icon')
