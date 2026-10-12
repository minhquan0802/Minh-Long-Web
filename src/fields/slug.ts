import type { TextField } from 'payload'
import { slugField as payloadSlugField } from 'payload'

import { slugifyVi } from '@/lib/slugify'

/** Slug tự sinh từ tiêu đề, hỗ trợ tiếng Việt có dấu. */
export const slugField = (useAsSlug = 'title') =>
  payloadSlugField({
    useAsSlug,
    slugify: ({ valueToSlugify }) => slugifyVi(valueToSlugify),
    overrides: (field) => {
      field.fields = field.fields.map((f) => {
        if (!('name' in f) || f.name !== 'slug') return f
        const slug = f as TextField
        return {
          ...slug,
          label: 'Đường dẫn (slug)',
          hooks: {
            ...slug.hooks,
            // Sinh slug trước bước validate (tạo qua API/seed không cần nhập slug),
            // và chuẩn hoá slug nhập tay về dạng không dấu.
            beforeValidate: [({ value, data }) => slugifyVi(value || data?.[useAsSlug]) || value],
          },
        }
      })
      return field
    },
  })
