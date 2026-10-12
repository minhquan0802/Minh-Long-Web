import { formatVND } from '@/lib/format'

type Props = {
  price?: number | null
  salePrice?: number | null
  size?: 'sm' | 'lg'
}

/** Giá bán: không có giá → "Liên hệ"; có giá KM → giá KM + giá gốc gạch ngang. */
export function Price({ price, salePrice, size = 'sm' }: Props) {
  const main = size === 'lg' ? 'text-[30px]' : 'text-[17px] md:text-[18px]'
  if (price == null) {
    return <span className={`font-display font-bold text-sky-ink ${main}`}>Liên hệ</span>
  }
  return (
    <span className="flex flex-col leading-tight">
      <span className={`font-display font-bold text-harbor ${main}`}>
        {formatVND(salePrice ?? price)}
      </span>
      {salePrice != null && (
        <s className={`text-muted ${size === 'lg' ? 'text-base' : 'text-[13px]'}`}>
          {formatVND(price)}
        </s>
      )}
    </span>
  )
}
