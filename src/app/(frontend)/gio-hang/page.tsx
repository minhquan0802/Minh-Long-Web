import type { Metadata } from 'next'

import { CartView } from '@/components/cart/CartView'
import { PageHeader } from '@/components/ui'

export const metadata: Metadata = { title: 'Giỏ hàng', robots: { index: false } }

export default function CartPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: 'Giỏ hàng' }]} title="Giỏ hàng" />
      <div className="container-x py-8">
        <CartView />
      </div>
    </>
  )
}
