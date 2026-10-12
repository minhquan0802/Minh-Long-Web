# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Project notes
- Website bán thiết bị IT + dịch vụ sửa chữa cho Minh Long. Tham khảo cấu trúc nội dung của d2ksuachuabaotri.vn nhưng KHÔNG sao chép giao diện/nội dung.
- Ngôn ngữ UI và nhãn admin: tiếng Việt. Màu thương hiệu: #1D8FBD (lấy từ logo).
- Slug: luôn dùng `slugField()` từ `src/fields/slug.ts` (Payload mặc định làm mất chữ có dấu).
- Collection có SEO plugin (`tabbedUI`): field đầu tiên phải là `tabs`, các field sidebar để ngoài tabs.
- Đơn hàng/liên hệ từ khách được tạo qua route server (overrideAccess), không mở `create` công khai.
- Admin tuỳ biến: dashboard `src/components/admin/Dashboard.tsx`, cell bảng `src/components/admin/cells.tsx`, CSS `src/app/(payload)/custom.scss`. Thứ tự mảng `collections` = thứ tự menu; ẩn menu theo vai trò bằng `hiddenUnless()`. Thêm collection mới → thêm icon vào `scripts/gen-admin-nav-icons.mjs` rồi chạy lại script.
- Chữ trong admin: ghi đè bản dịch Payload ở `src/admin-translations.ts` (quy ước: cột "Trên website" = "Đang hiện" / "Đang ẩn" / "Lưu & hiện lên website" / "Ẩn khỏi website"). Không dùng từ "xuất bản", "tài liệu", "phiên bản" với người dùng.
- Dev DB: `docker compose up -d` (Postgres 17). Thanh toán: VNPAY sandbox (bước sau).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
