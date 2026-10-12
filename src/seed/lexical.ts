/** Dựng nội dung rich text (Lexical) từ cú pháp gọn cho dữ liệu mẫu. */
type Block = string | { h2: string } | { h3: string } | { ul: string[] }

const text = (t: string) => ({
  type: 'text',
  text: t,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const base = { format: '' as const, indent: 0, version: 1, direction: 'ltr' as const }

const node = (b: Block) => {
  if (typeof b === 'string')
    return { ...base, type: 'paragraph', textFormat: 0, children: [text(b)] }
  if ('h2' in b) return { ...base, type: 'heading', tag: 'h2', children: [text(b.h2)] }
  if ('h3' in b) return { ...base, type: 'heading', tag: 'h3', children: [text(b.h3)] }
  return {
    ...base,
    type: 'list',
    listType: 'bullet',
    tag: 'ul',
    start: 1,
    children: b.ul.map((item, i) => ({
      ...base,
      type: 'listitem',
      value: i + 1,
      children: [text(item)],
    })),
  }
}

export const rich = (...blocks: Block[]) => ({
  root: { ...base, type: 'root', children: blocks.map(node) },
})
