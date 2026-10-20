# Claude Code

## Project notes
- Website giới thiệu + catalogue thiết bị IT và dịch vụ cho Minh Long (minhlongtek.com). **Không phải web bán hàng**: có giá nhưng không giỏ hàng / thanh toán; khách gọi hoặc chat Zalo.
- WordPress trên hosting cPanel của chủ web (PHP 7.4, LiteSpeed). Môi trường máy: `wordpress/docker-compose.yml` (PHP 7.4 + MariaDB, cổng 3000). Mọi code phải chạy được trên PHP 7.4.
- Theme riêng: `wordpress/themes/minhlong/`. WooCommerce chạy chế độ trưng bày (`inc/woocommerce.php`), dịch vụ là post type `dich-vu` (`inc/services.php`), thông tin liên hệ/trang chủ chỉnh trong Tuỳ biến (`inc/customizer.php`).
- Ngôn ngữ giao diện và admin: tiếng Việt. Màu theo logo Minh Long (`--ml-blue #1a6fb5`, `--ml-navy #0b2e59`), font Roboto.
- WP-CLI: `MSYS_NO_PATHCONV=1 docker compose run --rm cli wp ...` (chạy trong `wordpress/`; Git Bash cần `MSYS_NO_PATHCONV=1`).
- Nội dung mẫu: `wordpress/import/import.php` (chạy lại không tạo trùng).
- Bản Next.js + Payload cũ: git tag `nextjs-payload`.
