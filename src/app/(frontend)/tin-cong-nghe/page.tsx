import { PostList, postListMetadata } from '@/components/PostList'

export const metadata = postListMetadata('tin-tuc')

export default function Page({ searchParams }: { searchParams: Promise<{ trang?: string }> }) {
  return <PostList type="tin-tuc" searchParams={searchParams} />
}
