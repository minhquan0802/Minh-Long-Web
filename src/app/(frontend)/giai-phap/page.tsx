import { PostList, postListMetadata } from '@/components/PostList'

export const metadata = postListMetadata('giai-phap')

export default function Page({ searchParams }: { searchParams: Promise<{ trang?: string }> }) {
  return <PostList type="giai-phap" searchParams={searchParams} />
}
