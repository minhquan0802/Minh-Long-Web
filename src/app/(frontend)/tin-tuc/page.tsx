import { PostList, postListMetadata } from '@/components/PostList'

export const metadata = postListMetadata('all')

export default function Page({ searchParams }: { searchParams: Promise<{ trang?: string }> }) {
  return <PostList type="all" searchParams={searchParams} />
}
