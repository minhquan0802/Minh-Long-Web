import { PostList, postListMetadata } from '@/components/PostList'

export const metadata = postListMetadata('tuyen-dung')

export default function Page({ searchParams }: { searchParams: Promise<{ trang?: string }> }) {
  return <PostList type="tuyen-dung" searchParams={searchParams} />
}
