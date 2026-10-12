# Website Minh Long

Next.js 16 + Payload CMS 3 + PostgreSQL. Một project duy nhất gồm website, trang quản trị (`/admin`) và API.

## Chạy trên máy (dev)

Yêu cầu: Node.js 20+, Docker Desktop đang chạy.

```bash
docker compose up -d     # bật PostgreSQL (lần đầu tự tải image)
npm install              # chỉ cần lần đầu
npm run dev              # http://localhost:3000  –  admin: http://localhost:3000/admin
```

Tạo dữ liệu mẫu (XOÁ sản phẩm/bài viết/ảnh hiện có, giữ tài khoản): `npm run seed`

Chạy bản production trên máy (nhanh như khi lên host): `npm run build` rồi `npm start`.
Bật website bản chạy thật bằng 1 cú bấm đúp: `start-website.bat` (tự bật Docker + database, build lần đầu, chạy server). Sau khi sửa code: `start-website.bat build` để build lại. Tên miền cho bản chạy thật đặt trong `.env.production`.
Xoá bản build/cache cho nhẹ máy (tắt server trước): `npm run clean` — thư mục `.next` sẽ tự tạo lại khi chạy dev/build.

Tắt database: `docker compose stop`. Dữ liệu vẫn được giữ trong Docker volume `pgdata`.

File `.env` (copy từ `.env.example`):

| Biến | Ý nghĩa |
|---|---|
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL |
| `PAYLOAD_SECRET` | Chuỗi bí mật ngẫu nhiên, dài |
| `NEXT_PUBLIC_SERVER_URL` | URL website (dùng cho SEO, link chia sẻ) |

## Cấu trúc

```
src/
├── app/(frontend)/     Website công khai
├── app/(payload)/      Trang admin + API (Payload tự sinh)
├── collections/        Bảng dữ liệu = form trong admin
│   Products, Categories, Brands      – Cửa hàng
│   Orders, Contacts                  – Bán hàng
│   Services, Posts, Pages, Media     – Nội dung
│   Users                             – Tài khoản (admin / editor / sales)
├── globals/            SiteSettings (hotline, Zalo, footer), Homepage (banner, khối trang chủ)
├── components/         Giao diện: layout/, product/, cart/, forms/
├── lib/                Hàm lấy dữ liệu, server actions (form, đặt hàng), định dạng giá
├── seed/               Dữ liệu mẫu (npm run seed)
├── access/             Phân quyền
├── fields/slug.ts      Slug tự sinh, hỗ trợ tiếng Việt
└── payload.config.ts   Cấu hình chính
```

Sau khi sửa collection, chạy `npm run generate:types` để cập nhật kiểu TypeScript.
