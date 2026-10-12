import type { Metadata } from 'next'

import { type ListingParams, ProductListing } from '@/components/product/ProductListing'
import { PageHeader } from '@/components/ui'

type Props = { searchParams: Promise<ListingParams> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Tìm “${q}”` : 'Tất cả sản phẩm',
    description:
      'Laptop, máy tính, camera, thiết bị mạng, máy in chính hãng — giá tốt, bảo hành tận nơi.',
    // Trang kết quả tìm kiếm không cần lên Google
    robots: q ? { index: false } : undefined,
    alternates: { canonical: '/san-pham' },
  }
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Sản phẩm' }]}
        title={params.q ? 'Kết quả tìm kiếm' : 'Tất cả sản phẩm'}
      />
      <div className="container-x py-8">
        <ProductListing basePath="/san-pham" params={params} />
      </div>
    </>
  )
}
