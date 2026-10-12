import type { CollectionConfig } from 'payload'

import { hiddenUnless, isAdmin, isSales } from '@/access'

/** Mã đơn dạng ML251012-4821 (ngày + 4 số ngẫu nhiên). */
const generateOrderCode = () => {
  const d = new Date()
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `ML${ymd}-${Math.floor(1000 + Math.random() * 9000)}`
}

/**
 * Đơn hàng. Khách KHÔNG tạo trực tiếp qua API của Payload —
 * đơn online được tạo từ route đặt hàng phía server (tự lấy lại giá từ DB).
 * Nhân viên có thể tạo tay đơn đặt qua điện thoại trong admin.
 */
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Đơn hàng', plural: 'Đơn hàng' },
  admin: {
    useAsTitle: 'code',
    defaultColumns: [
      'code',
      'customerName',
      'customerPhone',
      'total',
      'paymentMethod',
      'paymentStatus',
      'status',
      'createdAt',
    ],
    listSearchableFields: ['code', 'customerName', 'customerPhone'],
    group: 'Bán hàng',
    hidden: hiddenUnless('admin', 'sales'),
    pagination: { defaultLimit: 25 },
  },
  defaultSort: '-createdAt',
  access: { read: isSales, create: isSales, update: isSales, delete: isAdmin },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data) return data
        if (operation === 'create' && !data.code) data.code = generateOrderCode()
        // Tổng tiền luôn tính lại từ danh sách sản phẩm
        if (Array.isArray(data.items)) {
          data.total = data.items.reduce(
            (sum: number, i: { unitPrice?: number; quantity?: number }) =>
              sum + (i.unitPrice ?? 0) * (i.quantity ?? 0),
            0,
          )
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'code',
          type: 'text',
          label: 'Mã đơn',
          unique: true,
          index: true,
          admin: { readOnly: true, description: 'Tự sinh khi tạo đơn' },
        },
        {
          name: 'status',
          type: 'select',
          label: 'Trạng thái xử lý',
          defaultValue: 'new',
          options: [
            { label: 'Mới', value: 'new' },
            { label: 'Đã xác nhận', value: 'confirmed' },
            { label: 'Đang giao', value: 'shipping' },
            { label: 'Hoàn tất', value: 'completed' },
            { label: 'Đã huỷ', value: 'cancelled' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Khách hàng',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'customerName', type: 'text', label: 'Họ tên', required: true },
            { name: 'customerPhone', type: 'text', label: 'Điện thoại', required: true },
            { name: 'customerEmail', type: 'email', label: 'Email' },
          ],
        },
        { name: 'address', type: 'textarea', label: 'Địa chỉ giao hàng' },
        { name: 'note', type: 'textarea', label: 'Ghi chú của khách' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Sản phẩm',
      labels: { singular: 'Sản phẩm', plural: 'Sản phẩm' },
      required: true,
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'product', type: 'relationship', relationTo: 'products', label: 'Sản phẩm' },
            // Lưu lại tên + giá tại thời điểm đặt, phòng khi sản phẩm bị sửa/xoá
            { name: 'name', type: 'text', label: 'Tên', required: true },
            { name: 'unitPrice', type: 'number', label: 'Đơn giá', required: true },
            { name: 'quantity', type: 'number', label: 'SL', required: true, min: 1 },
          ],
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      label: 'Tổng tiền (VNĐ)',
      admin: {
        readOnly: true,
        description: 'Tự tính từ danh sách sản phẩm',
        components: { Cell: '/components/admin/cells#PriceCell' },
      },
    },
    { name: 'internalNote', type: 'textarea', label: 'Ghi chú nội bộ' },
    // --- Sidebar ---
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Thanh toán',
      required: true,
      defaultValue: 'cod',
      options: [
        { label: 'Tiền mặt khi nhận hàng (COD)', value: 'cod' },
        { label: 'VNPAY', value: 'vnpay' },
        { label: 'Chuyển khoản', value: 'bank_transfer' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      label: 'Tình trạng thanh toán',
      defaultValue: 'unpaid',
      options: [
        { label: 'Chưa thanh toán', value: 'unpaid' },
        { label: 'Đã thanh toán', value: 'paid' },
        { label: 'Thất bại', value: 'failed' },
        { label: 'Đã hoàn tiền', value: 'refunded' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'vnpay',
      type: 'group',
      label: 'Thông tin giao dịch VNPAY',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => data?.paymentMethod === 'vnpay',
      },
      fields: [
        { name: 'transactionNo', type: 'text', label: 'Mã GD VNPAY' },
        { name: 'bankCode', type: 'text', label: 'Ngân hàng' },
        { name: 'responseCode', type: 'text', label: 'Mã phản hồi' },
        { name: 'payDate', type: 'text', label: 'Thời gian thanh toán' },
      ],
    },
  ],
}
