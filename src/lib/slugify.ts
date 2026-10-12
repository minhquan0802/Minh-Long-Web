/**
 * Tạo slug không dấu cho tiếng Việt.
 * "Sửa Laptop Đà Nẵng" -> "sua-laptop-da-nang"
 */
export const slugifyVi = (value: unknown): string =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
