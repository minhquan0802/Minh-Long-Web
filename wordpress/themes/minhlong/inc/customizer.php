<?php
/**
 * Giao diện → Tuỳ biến: thông tin liên hệ + nội dung trang chủ.
 * Chủ web tự sửa, không cần đụng code.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Số slide banner / cam kết / số liệu trên trang chủ. */
define('ML_SLIDES', 3);
define('ML_COMMITS', 4);
define('ML_STATS', 4);

/** Đoạn giới thiệu mặc định trên trang chủ. */
function ml_about_default()
{
    return "Minh Long là đơn vị cung cấp dịch vụ IT cho doanh nghiệp: IT Helpdesk, IT Onsite (thuê ngoài), tích hợp hệ thống và thi công hạ tầng công nghệ thông tin.\n\nChúng tôi đồng hành cùng khách hàng từ khâu tư vấn, cung cấp thiết bị chính hãng đến lắp đặt và bảo trì lâu dài.";
}

function ml_home_defaults()
{
    return array(
        'slides'  => array(
            array('Dịch vụ IT đồng hành 24/7 cùng doanh nghiệp', 'IT Helpdesk, kỹ thuật viên onsite, bảo trì hệ thống – để doanh nghiệp tập trung vào công việc chính.', 'Nhận tư vấn miễn phí', '/lien-he/'),
            array('Thi công camera, mạng LAN, Wifi trọn gói', 'Khảo sát tận nơi, thiết kế, lắp đặt và bảo hành dài hạn cho văn phòng, nhà xưởng, cửa hàng.', 'Xem dịch vụ', '/dich-vu/'),
            array('Thiết bị chính hãng – giá cạnh tranh', 'Camera Hikvision, Dahua, thiết bị mạng, máy chấm công, màn hình… có hoá đơn, bảo hành chính hãng.', 'Xem sản phẩm', '/san-pham/'),
        ),
        'commits' => array(
            array('Hỗ trợ 24/7', 'Tiếp nhận yêu cầu cả ngoài giờ hành chính'),
            array('Kỹ thuật tận nơi', 'Có mặt nhanh tại văn phòng, nhà xưởng'),
            array('Hàng chính hãng', 'Hoá đơn VAT, bảo hành theo hãng'),
            array('Báo giá minh bạch', 'Khảo sát, báo giá rõ ràng trước khi làm'),
        ),
        'stats'   => array(
            array('10+', 'Năm kinh nghiệm'),
            array('300+', 'Doanh nghiệp tin dùng'),
            array('20+', 'Kỹ thuật viên'),
            array('24/7', 'Hỗ trợ kỹ thuật'),
        ),
    );
}

/** Gom dữ liệu trang chủ từ Tuỳ biến (có mặc định). */
function ml_home_data()
{
    $d   = ml_home_defaults();
    $out = array('slides' => array(), 'commits' => array(), 'stats' => array());
    for ($i = 1; $i <= ML_SLIDES; $i++) {
        $def   = $d['slides'][$i - 1];
        $title = get_theme_mod("ml_slide{$i}_title", $def[0]);
        if (!$title) {
            continue;
        }
        $out['slides'][] = array(
            'title' => $title,
            'text'  => get_theme_mod("ml_slide{$i}_text", $def[1]),
            'btn'   => get_theme_mod("ml_slide{$i}_btn", $def[2]),
            'link'  => get_theme_mod("ml_slide{$i}_link", $def[3]),
            'image' => (int) get_theme_mod("ml_slide{$i}_image", 0),
        );
    }
    for ($i = 1; $i <= ML_COMMITS; $i++) {
        $def = $d['commits'][$i - 1];
        $out['commits'][] = array(get_theme_mod("ml_commit{$i}_title", $def[0]), get_theme_mod("ml_commit{$i}_text", $def[1]));
    }
    for ($i = 1; $i <= ML_STATS; $i++) {
        $def = $d['stats'][$i - 1];
        $out['stats'][] = array(get_theme_mod("ml_stat{$i}_value", $def[0]), get_theme_mod("ml_stat{$i}_label", $def[1]));
    }
    return $out;
}

add_action('customize_register', function ($wp) {
    $text = function ($id, $label, $section, $type = 'text', $desc = '') use ($wp) {
        $d = ml_defaults();
        $wp->add_setting($id, array(
            'default'           => isset($d[$id]) ? $d[$id] : '',
            'sanitize_callback' => $type === 'textarea' || $type === 'html' ? 'wp_kses_post' : 'sanitize_text_field',
        ));
        $wp->add_control($id, array(
            'label'       => $label,
            'section'     => $section,
            'type'        => $type === 'html' ? 'textarea' : $type,
            'description' => $desc,
        ));
    };

    /* ---- Liên hệ ---- */
    $wp->add_section('ml_contact', array('title' => 'Minh Long: Liên hệ', 'priority' => 25));
    $text('ml_company', 'Tên công ty', 'ml_contact');
    $text('ml_hotline', 'Hotline chính', 'ml_contact');
    $text('ml_hotline_2', 'Hotline phụ (không bắt buộc)', 'ml_contact');
    $text('ml_zalo', 'Số Zalo', 'ml_contact', 'text', 'Dùng cho nút "Chat Zalo"');
    $text('ml_email', 'Email', 'ml_contact');
    $text('ml_address', 'Địa chỉ', 'ml_contact', 'textarea');
    $text('ml_hours', 'Giờ làm việc', 'ml_contact');
    $text('ml_facebook', 'Link Fanpage Facebook', 'ml_contact');
    $text('ml_messenger', 'Link Messenger (m.me/...)', 'ml_contact');
    $text('ml_map_embed', 'Bản đồ Google Maps (link nhúng)', 'ml_contact', 'text', 'Google Maps → Chia sẻ → Nhúng bản đồ → chỉ dán phần link trong src="..."');
    $text('ml_footer_about', 'Giới thiệu ngắn ở chân trang', 'ml_contact', 'textarea');
    $text('ml_cf7_id', 'Mã form liên hệ (Contact Form 7)', 'ml_contact', 'text', 'Số ID của form trong mục Liên hệ → Contact Forms');

    /* ---- Trang chủ ---- */
    $wp->add_panel('ml_home', array('title' => 'Minh Long: Trang chủ', 'priority' => 26));
    $d = ml_home_defaults();

    $wp->add_section('ml_home_slides', array('title' => 'Banner đầu trang', 'panel' => 'ml_home'));
    for ($i = 1; $i <= ML_SLIDES; $i++) {
        $def = $d['slides'][$i - 1];
        $fields = array('title' => array('Tiêu đề', $def[0]), 'text' => array('Mô tả', $def[1]), 'btn' => array('Chữ trên nút', $def[2]), 'link' => array('Link nút', $def[3]));
        foreach ($fields as $k => $f) {
            $wp->add_setting("ml_slide{$i}_{$k}", array('default' => $f[1], 'sanitize_callback' => 'sanitize_text_field'));
            $wp->add_control("ml_slide{$i}_{$k}", array('label' => "Slide {$i}: {$f[0]}", 'section' => 'ml_home_slides', 'type' => $k === 'text' ? 'textarea' : 'text'));
        }
        $wp->add_setting("ml_slide{$i}_image", array('default' => 0, 'sanitize_callback' => 'absint'));
        $wp->add_control(new WP_Customize_Media_Control($wp, "ml_slide{$i}_image", array(
            'label'       => "Slide {$i}: Ảnh nền",
            'description' => 'Ảnh ngang, khoảng 1920 × 640 px. Để trống tiêu đề để ẩn slide.',
            'section'     => 'ml_home_slides',
            'mime_type'   => 'image',
        )));
    }

    $wp->add_section('ml_home_commits', array('title' => 'Dải cam kết', 'panel' => 'ml_home'));
    for ($i = 1; $i <= ML_COMMITS; $i++) {
        $def = $d['commits'][$i - 1];
        $wp->add_setting("ml_commit{$i}_title", array('default' => $def[0], 'sanitize_callback' => 'sanitize_text_field'));
        $wp->add_control("ml_commit{$i}_title", array('label' => "Cam kết {$i}: Tiêu đề", 'section' => 'ml_home_commits'));
        $wp->add_setting("ml_commit{$i}_text", array('default' => $def[1], 'sanitize_callback' => 'sanitize_text_field'));
        $wp->add_control("ml_commit{$i}_text", array('label' => "Cam kết {$i}: Mô tả", 'section' => 'ml_home_commits'));
    }

    $wp->add_section('ml_home_about', array('title' => 'Giới thiệu & số liệu', 'panel' => 'ml_home'));
    $wp->add_setting('ml_about_title', array('default' => 'Về Minh Long', 'sanitize_callback' => 'sanitize_text_field'));
    $wp->add_control('ml_about_title', array('label' => 'Tiêu đề', 'section' => 'ml_home_about'));
    $wp->add_setting('ml_about_text', array(
        'default'           => ml_about_default(),
        'sanitize_callback' => 'wp_kses_post',
    ));
    $wp->add_control('ml_about_text', array('label' => 'Nội dung', 'section' => 'ml_home_about', 'type' => 'textarea'));
    $wp->add_setting('ml_about_image', array('default' => 0, 'sanitize_callback' => 'absint'));
    $wp->add_control(new WP_Customize_Media_Control($wp, 'ml_about_image', array('label' => 'Ảnh', 'section' => 'ml_home_about', 'mime_type' => 'image')));
    for ($i = 1; $i <= ML_STATS; $i++) {
        $def = $d['stats'][$i - 1];
        $wp->add_setting("ml_stat{$i}_value", array('default' => $def[0], 'sanitize_callback' => 'sanitize_text_field'));
        $wp->add_control("ml_stat{$i}_value", array('label' => "Số liệu {$i}: Con số", 'section' => 'ml_home_about'));
        $wp->add_setting("ml_stat{$i}_label", array('default' => $def[1], 'sanitize_callback' => 'sanitize_text_field'));
        $wp->add_control("ml_stat{$i}_label", array('label' => "Số liệu {$i}: Mô tả", 'section' => 'ml_home_about'));
    }

    $wp->add_section('ml_home_products', array('title' => 'Khối sản phẩm', 'panel' => 'ml_home'));
    $wp->add_setting('ml_home_cats', array('default' => '', 'sanitize_callback' => 'sanitize_text_field'));
    $wp->add_control('ml_home_cats', array(
        'label'       => 'Danh mục hiện ở trang chủ',
        'description' => 'Nhập đường dẫn (slug) danh mục, cách nhau bởi dấu phẩy. VD: camera-quan-sat, thiet-bi-mang. Để trống = tự lấy các danh mục lớn.',
        'section'     => 'ml_home_products',
    ));
    $wp->add_setting('ml_partners', array('default' => '', 'sanitize_callback' => 'sanitize_text_field'));
    $wp->add_control('ml_partners', array(
        'label'       => 'Logo đối tác (ID ảnh)',
        'description' => 'ID các ảnh logo trong Thư viện, cách nhau bởi dấu phẩy. Để trống = tự lấy logo thương hiệu sản phẩm.',
        'section'     => 'ml_home_products',
    ));
});
