<?php
/**
 * Hàm tiện ích dùng chung.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Giá trị mặc định cho các ô trong Tuỳ biến (Giao diện → Tuỳ biến). */
function ml_defaults()
{
    return array(
        'ml_hotline'      => '0972 375 826',
        'ml_hotline_2'    => '',
        'ml_zalo'         => '0972375826',
        'ml_email'        => 'lienhe@minhlongtek.com',
        'ml_address'      => 'TP. Hồ Chí Minh',
        'ml_hours'        => 'Thứ 2 – Thứ 7: 8:00 – 17:30',
        'ml_facebook'     => '',
        'ml_messenger'    => '',
        'ml_map_embed'    => '',
        'ml_company'      => 'Công ty TNHH Giải pháp Công nghệ Minh Long',
        'ml_footer_about' => 'Minh Long cung cấp dịch vụ IT Helpdesk, IT Onsite (thuê ngoài), tích hợp hệ thống, thi công hạ tầng mạng – camera cho doanh nghiệp và hộ gia đình.',
        'ml_cf7_id'       => '',
    );
}

/** Lấy cài đặt theme (có mặc định). */
function ml_opt($key)
{
    $defaults = ml_defaults();
    $default  = isset($defaults[$key]) ? $defaults[$key] : '';
    return get_theme_mod($key, $default);
}

/** "0972 375 826" -> "tel:0972375826" */
function ml_tel($phone)
{
    return 'tel:' . preg_replace('/[^0-9+]/', '', (string) $phone);
}

/** Link chat Zalo từ số điện thoại. */
function ml_zalo_link($phone = null)
{
    $phone = $phone ? $phone : ml_opt('ml_zalo');
    return 'https://zalo.me/' . preg_replace('/[^0-9]/', '', (string) $phone);
}

/** Định dạng giá kiểu Việt Nam: 15.990.000đ */
function ml_vnd($amount)
{
    return number_format((float) $amount, 0, ',', '.') . 'đ';
}

/**
 * Icon SVG nét (bộ Lucide, giấy phép ISC).
 * Dùng: echo ml_icon('phone');
 */
function ml_icon($name, $size = 20, $class = '')
{
    $paths = array(
        'phone'    => '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
        'mail'     => '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
        'clock'    => '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
        'map'      => '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
        'search'   => '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
        'menu'     => '<path d="M4 6h16M4 12h16M4 18h16"/>',
        'close'    => '<path d="M18 6 6 18M6 6l12 12"/>',
        'chevron'  => '<path d="m9 18 6-6-6-6"/>',
        'down'     => '<path d="m6 9 6 6 6-6"/>',
        'check'    => '<path d="M20 6 9 17l-5-5"/>',
        'shield'   => '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
        'headset'  => '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>',
        'truck'    => '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
        'tag'      => '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
        'wrench'   => '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
        'monitor'  => '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
        'server'   => '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
        'network'  => '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8"/>',
        'camera'   => '<path d="M16.75 12h3.632a1 1 0 0 1 .894 1.447l-2.034 4.069a1 1 0 0 1-1.708.134l-2.124-2.97"/><path d="M17.106 9.053a1 1 0 0 1 .447 1.341l-3.106 6.211a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3z"/><path d="M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15M2 21v-4M7 9h.01"/>',
        'users'    => '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
        'message'  => '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
        'arrow-up' => '<path d="m5 12 7-7 7 7M12 19V5"/>',
        'facebook' => '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    );
    $body = isset($paths[$name]) ? $paths[$name] : '';
    return sprintf(
        '<svg class="ml-icon %s" width="%d" height="%d" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>',
        esc_attr($class),
        (int) $size,
        (int) $size,
        $body
    );
}

/** Tiêu đề khối trang chủ + link "Xem tất cả". */
function ml_section_head($title, $link = '', $link_text = 'Xem tất cả')
{
    echo '<div class="ml-section-head"><h2 class="ml-section-title">' . esc_html($title) . '</h2>';
    if ($link) {
        echo '<a class="ml-section-more" href="' . esc_url($link) . '">' . esc_html($link_text) . ' ' . ml_icon('chevron', 16) . '</a>';
    }
    echo '</div>';
}

/** Ảnh mặc định khi bài/sản phẩm chưa có ảnh. */
function ml_placeholder_url()
{
    return ML_URI . '/assets/img/placeholder.png';
}

/** Breadcrumb đơn giản cho bài viết / trang / dịch vụ. */
function ml_breadcrumb($items)
{
    echo '<nav class="ml-breadcrumb" aria-label="Đường dẫn"><a href="' . esc_url(home_url('/')) . '">Trang chủ</a>';
    foreach ($items as $label => $url) {
        echo ' <span aria-hidden="true">/</span> ';
        if ($url) {
            echo '<a href="' . esc_url($url) . '">' . esc_html($label) . '</a>';
        } else {
            echo '<span>' . esc_html($label) . '</span>';
        }
    }
    echo '</nav>';
}
