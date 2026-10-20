# Website Minh Long — bản WordPress

Website giới thiệu dịch vụ IT + catalogue thiết bị. WooCommerce chạy ở **chế độ trưng bày**: có giá, không giỏ hàng, không thanh toán — khách gọi / chat Zalo để mua.

Môi trường giống hosting thật của Minh Long: **PHP 7.4 + MariaDB**, WordPress mới nhất, WooCommerce, Contact Form 7, Flamingo.

## Chạy trên máy

Cần Docker Desktop đang bật. Trong thư mục `wordpress/`:

```bash
docker compose up -d        # bật website + database
docker compose stop         # tắt (dữ liệu vẫn giữ)
```

- Trên máy: http://localhost:3000 — quản trị: http://localhost:3000/wp-admin
- Cho người khác xem: https://minhquan0802.id.vn (Cloudflare Tunnel đang trỏ vào cổng 3000)
- Tài khoản admin: `minhlong` — mật khẩu trong file `.wp-admin-pass.local` ở thư mục gốc dự án (không đưa lên git)

## Cấu trúc

```
wordpress/
├── docker-compose.yml        WordPress (PHP 7.4) + MariaDB + WP-CLI
├── themes/minhlong/          Theme riêng của Minh Long
│   ├── style.css             Toàn bộ giao diện (màu theo logo)
│   ├── functions.php         Nạp các file trong inc/
│   ├── inc/customizer.php    Giao diện → Tuỳ biến: hotline, Zalo, banner, số liệu
│   ├── inc/woocommerce.php   Chế độ trưng bày, giá "Liên hệ", nút Gọi / Zalo
│   ├── inc/services.php      Mục "Dịch vụ" trong admin
│   └── front-page.php …      Các trang
└── import/import.php         Nhập nội dung mẫu (danh mục, sản phẩm, dịch vụ, bài viết, menu, form)
```

Chạy lại nhập nội dung (không tạo trùng):

```bash
MSYS_NO_PATHCONV=1 docker compose run --rm cli wp eval-file /import/import.php
```

## Khi chuyển lên hosting cPanel

1. Cài theme: nén thư mục `themes/minhlong` thành zip → Giao diện → Giao diện → Tải lên.
2. Chuyển nội dung: dùng plugin Duplicator / All-in-One WP Migration (bản miễn phí).
3. Form liên hệ: Liên hệ → Contact Forms → "Yêu cầu tư vấn" → tab Cài đặt bổ sung → **xoá dòng `skip_mail: on`** để form gửi email thật.
4. Kiểm tra lại hotline, Zalo, địa chỉ, bản đồ trong Giao diện → Tuỳ biến → "Minh Long: Liên hệ".
