import fs from 'fs'
import { createRequire } from 'module'
import sharp from 'sharp'

const require = createRequire(import.meta.url)

/** Lấy phần thân (các path) của một icon lucide. */
const iconBody = (name: string) => {
  const file = require.resolve(`lucide-static/icons/${name}.svg`)
  const svg = fs.readFileSync(file, 'utf8')
  return svg.slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>'))
}

const icon = (name: string, x: number, y: number, size: number, color: string, stroke: number) =>
  `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${iconBody(name)}</g>`

const dots = (w: number, h: number, color: string) =>
  `<pattern id="d" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="${color}"/></pattern><rect width="${w}" height="${h}" fill="url(#d)"/>`

/** Ảnh sản phẩm mẫu: nền sáng, icon thiết bị lớn. */
export const productImage = async (iconName: string, variant = 0) => {
  const tints = ['#EEF5F9', '#F3F6F8', '#EDF3F6', '#F1F5F7']
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
    <rect width="800" height="800" fill="${tints[variant % tints.length]}"/>
    <defs>${dots(800, 800, '#D3E2EA')}</defs>${dots(800, 800, '#D3E2EA')}
    <circle cx="400" cy="400" r="250" fill="#FFFFFF"/>
    ${icon(iconName, 232, 232, 336, '#1D8FBD', 1.1)}
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

/** Ảnh bìa bài viết / dịch vụ: nền xanh đậm, icon vàng. */
export const coverImage = async (iconName: string, variant = 0) => {
  const bgs = ['#0E3A52', '#12465F', '#0B3044']
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675">
    <rect width="1200" height="675" fill="${bgs[variant % bgs.length]}"/>
    <defs>${dots(1200, 675, '#1D5B78')}</defs>${dots(1200, 675, '#1D5B78')}
    <circle cx="${780 + (variant % 3) * 60}" cy="337" r="230" fill="#1D8FBD" opacity="0.35"/>
    ${icon(iconName, 640 + (variant % 3) * 60, 197, 280, '#FFB81C', 1.2)}
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

/** Logo thương hiệu mẫu: chữ trên nền trắng. */
export const brandLogo = async (name: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
    <rect width="400" height="200" fill="#FFFFFF"/>
    <text x="200" y="118" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" fill="#54707F">${name}</text>
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}
