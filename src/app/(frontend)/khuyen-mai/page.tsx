import { PostList, postListMetadata } from '@/components/PostList'

export const metadata = postListMetadata('khuyen-mai')

export default function Page({ searchParams }: { searchParams: Promise<{ trang?: string }> }) {
  return <PostList type="khuyen-mai" searchParams={searchParams} />
}
