<?php
/**
 * Khai báo theme: menu, ảnh, CSS/JS.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('after_setup_theme', function () {
    load_theme_textdomain('minhlong', ML_DIR . '/languages');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', array('height' => 120, 'width' => 570, 'flex-width' => true, 'flex-height' => true));
    add_theme_support('html5', array('search-form', 'gallery', 'caption', 'style', 'script'));
    add_theme_support('responsive-embeds');
    add_theme_support('woocommerce', array(
        'thumbnail_image_width' => 500,
        'single_image_width'    => 800,
        'product_grid'          => array('default_columns' => 5, 'default_rows' => 4),
    ));
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    register_nav_menus(array(
        'primary' => 'Menu chính',
        'footer'  => 'Menu chân trang (Chính sách)',
    ));

    add_image_size('ml-card', 480, 320, true);
    add_image_size('ml-hero', 1920, 640, true);
});

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('ml-fonts', 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&subset=vietnamese&display=swap', array(), null);
    // Phiên bản = thời điểm sửa file → trình duyệt nhớ lâu nhưng vẫn lấy bản mới khi có thay đổi
    wp_enqueue_style('ml-style', get_stylesheet_uri(), array('ml-fonts'), (string) filemtime(ML_DIR . '/style.css'));
    wp_enqueue_script('ml-main', ML_URI . '/assets/js/main.js', array(), (string) filemtime(ML_DIR . '/assets/js/main.js'), true);
});

/** Favicon mặc định nếu chưa đặt "Biểu tượng trang" trong Tuỳ biến. */
add_action('wp_head', function () {
    if (!has_site_icon()) {
        echo '<link rel="icon" href="' . esc_url(ML_URI . '/assets/img/favicon-512.png') . '">' . "\n";
    }
}, 5);

add_action('widgets_init', function () {
    register_sidebar(array(
        'name'          => 'Cột bên (Tin tức)',
        'id'            => 'blog-sidebar',
        'before_widget' => '<section class="ml-widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="ml-widget-title">',
        'after_title'   => '</h3>',
    ));
});

/** Tóm tắt bài viết ngắn gọn. */
add_filter('excerpt_length', function () {
    return 28;
});
add_filter('excerpt_more', function () {
    return '…';
});

/** Logo: dùng logo trong Tuỳ biến nếu có, không thì logo đi kèm theme. */
function ml_logo($white = false)
{
    $home = esc_url(home_url('/'));
    $name = esc_attr(get_bloginfo('name'));
    if (!$white && has_custom_logo()) {
        $id  = get_theme_mod('custom_logo');
        $src = wp_get_attachment_image_url($id, 'full');
    } else {
        $src = ML_URI . '/assets/img/' . ($white ? 'logo-white.png' : 'logo.png');
    }
    echo '<a class="ml-logo" href="' . $home . '" rel="home"><img src="' . esc_url($src) . '" alt="' . $name . '" width="285" height="60"></a>';
}

/** Menu dự phòng khi chưa tạo menu trong Giao diện → Menu. */
function ml_fallback_menu()
{
    $items = array(
        'Trang chủ'   => home_url('/'),
        'Dịch vụ IT'  => get_post_type_archive_link('dich-vu'),
        'Sản phẩm'    => function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/'),
        'Tin tức'     => get_permalink(get_option('page_for_posts')) ?: home_url('/'),
        'Liên hệ'     => home_url('/lien-he/'),
    );
    echo '<ul class="ml-menu">';
    foreach ($items as $label => $url) {
        echo '<li><a href="' . esc_url($url) . '">' . esc_html($label) . '</a></li>';
    }
    echo '</ul>';
}
