import { PostList, postListMetadata } from '@/components/PostList'

export const metadata = postListMetadata('ho-tro')

export default function Page({ searchParams }: { searchParams: Promise<{ trang?: string }> }) {
  return <PostList type="ho-tro" searchParams={searchParams} />
}
