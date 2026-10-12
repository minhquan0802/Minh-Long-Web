import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { Where } from 'payload'

import { EmptyState, PageHeader, Pagination } from '@/components/ui'
import { formatDate, mediaUrl, PLACEHOLDER } from '@/lib/format'
import { getPayloadClient, PUBLISHED } from '@/lib/payload'
import type { Post } from '@/payload-types'

type PostType = Post['type']
/** 'all' = trang /tin-tuc: hiện bài của mọi chuyên mục */
type Section = PostType | 'all'

/** Trang tổng hợp, cũng là mục cha trên breadcrumb của mọi bài viết. */
export const NEWS_HUB = {
  path: '/tin-tuc',
  title: 'Tin tức',
  description: 'Tin công nghệ, hướng dẫn kỹ thuật, khuyến mãi và hoạt động của Minh Long.',
}

export const POST_SECTIONS: Record<PostType, { path: string; title: string; description: string }> =
  {
    'tin-tuc': {
      path: '/tin-cong-nghe',
      title: 'Tin công nghệ',
      description: 'Tin công nghệ, sản phẩm mới trên thị trường.',
    },
    'ho-tro': {
      path: '/ho-tro',
      title: 'Hỗ trợ kỹ thuật',
      description: 'Hướng dẫn tự xử lý lỗi máy tính, máy in, camera, Wifi thường gặp.',
    },
    'khuyen-mai': {
      path: '/khuyen-mai',
      title: 'Khuyến mãi',
      description: 'Chương trình ưu đãi đang diễn ra tại Minh Long.',
    },
    'giai-phap': {
      path: '/giai-phap',
      title: 'Giải pháp',
      description: 'Giải pháp CNTT trọn gói cho văn phòng, cửa hàng, doanh nghiệp.',
    },
    'tuyen-dung': {
      path: '/tuyen-dung',
      title: 'Tuyển dụng',
      description: 'Cơ hội làm việc cùng đội ngũ kỹ thuật Minh Long.',
    },
  }

const sectionOf = (s: Section) => (s === 'all' ? NEWS_HUB : POST_SECTIONS[s])

export const postListMetadata = (s: Section): Metadata => ({
  title: sectionOf(s).title,
  description: sectionOf(s).description,
  alternates: { canonical: sectionOf(s).path },
})

export async function PostList({
  type,
  searchParams,
}: {
  type: Section
  searchParams: Promise<{ trang?: string }>
}) {
  const section = sectionOf(type)
  const page = Math.max(1, Number((await searchParams).trang) || 1)
  const payload = await getPayloadClient()
  const where: Where = type === 'all' ? PUBLISHED : { and: [PUBLISHED, { type: { equals: type } }] }
  const result = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit: 12,
    page,
    depth: 1,
  })

  const chips = [
    { key: 'all', path: NEWS_HUB.path, title: 'Tất cả' },
    ...Object.entries(POST_SECTIONS).map(([key, s]) => ({ key, path: s.path, title: s.title })),
  ]

  return (
    <>
      <PageHeader
        crumbs={
          type === 'all'
            ? [{ label: NEWS_HUB.title }]
            : [{ label: NEWS_HUB.title, href: NEWS_HUB.path }, { label: section.title }]
        }
        title={section.title}
        description={section.description}
      >
        <nav className="mt-5 flex flex-wrap gap-2 text-sm" aria-label="Chuyên mục">
          {chips.map((c) => (
            <Link
              key={c.key}
              href={c.path}
              aria-current={c.key === type ? 'page' : undefined}
              className={`rounded-box border px-3 py-1.5 ${
                c.key === type
                  ? 'border-harbor bg-harbor text-white'
                  : 'border-line bg-white hover:border-sky'
              }`}
            >
              {c.title}
            </Link>
          ))}
        </nav>
      </PageHeader>
      <div className="container-x py-10">
        {result.docs.length ? (
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {result.docs.map((p) => (
              <li key={p.id}>
                {/* Trang tổng hợp: ghi chuyên mục cạnh ngày đăng để phân biệt */}
                <PostTeaser post={p} showType={type === 'all'} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Chưa có bài viết">Mục này sẽ sớm được cập nhật.</EmptyState>
        )}
        <Pagination
          page={page}
          totalPages={result.totalPages}
          basePath={section.path}
          params={{}}
        />
      </div>
    </>
  )
}

export function PostTeaser({ post, showType }: { post: Post; showType?: boolean }) {
  const img = mediaUrl(post.cover, 'card') ?? PLACEHOLDER.wide
  return (
    <Link href={`/bai-viet/${post.slug}`} className="group block">
      <span className="relative block aspect-[16/9] overflow-hidden rounded-box bg-harbor">
        {img && (
          <Image
            src={img}
            alt=""
            fill
            sizes="(min-width:1024px) 380px, (min-width:640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </span>
      <span className="mt-3 flex items-center gap-2 text-[13px] text-muted">
        {showType && (
          <span className="rounded-tag bg-sky-wash px-2 py-0.5 font-medium text-sky-ink">
            {POST_SECTIONS[post.type].title}
          </span>
        )}
        {formatDate(post.publishedAt)}
      </span>
      <span className="mt-1 line-clamp-2 block font-display text-[18px] leading-snug font-semibold text-harbor group-hover:text-sky-ink">
        {post.title}
      </span>
      {post.excerpt && (
        <span className="mt-1.5 line-clamp-2 block text-[14.5px] text-muted">{post.excerpt}</span>
      )}
    </Link>
  )
}
