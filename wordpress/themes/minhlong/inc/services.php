<?php
/**
 * Loại nội dung "Dịch vụ" (IT Helpdesk, lắp đặt camera...).
 * Đường dẫn: /dich-vu/  và  /dich-vu/ten-dich-vu/
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', function () {
    register_post_type('dich-vu', array(
        'labels'        => array(
            'name'               => 'Dịch vụ',
            'singular_name'      => 'Dịch vụ',
            'add_new'            => 'Thêm dịch vụ',
            'add_new_item'       => 'Thêm dịch vụ mới',
            'edit_item'          => 'Sửa dịch vụ',
            'all_items'          => 'Tất cả dịch vụ',
            'search_items'       => 'Tìm dịch vụ',
            'not_found'          => 'Chưa có dịch vụ nào',
        ),
        'public'        => true,
        'has_archive'   => true,
        'rewrite'       => array('slug' => 'dich-vu'),
        'menu_icon'     => 'dashicons-admin-tools',
        'menu_position' => 6,
        'supports'      => array('title', 'editor', 'excerpt', 'thumbnail', 'page-attributes'),
        'show_in_rest'  => true,
    ));
});

/** Ô "Giá tham khảo" + "Biểu tượng" bên cột phải khi sửa dịch vụ. */
add_action('add_meta_boxes', function () {
    add_meta_box('ml_service_meta', 'Thông tin thêm', function ($post) {
        wp_nonce_field('ml_service_meta', 'ml_service_nonce');
        $price = get_post_meta($post->ID, '_ml_price_from', true);
        $icon  = get_post_meta($post->ID, '_ml_icon', true);
        $icons = array('headset' => 'Hỗ trợ / Helpdesk', 'users' => 'Nhân sự onsite', 'server' => 'Máy chủ / hệ thống', 'network' => 'Mạng / hạ tầng', 'camera' => 'Camera', 'wrench' => 'Sửa chữa / bảo trì', 'monitor' => 'Máy tính', 'shield' => 'Bảo mật');
        echo '<p><label><strong>Giá tham khảo</strong><br><input type="text" name="ml_price_from" value="' . esc_attr($price) . '" placeholder="Từ 1.500.000đ/tháng" style="width:100%"></label></p>';
        echo '<p><label><strong>Biểu tượng</strong><br><select name="ml_icon" style="width:100%">';
        foreach ($icons as $k => $label) {
            echo '<option value="' . esc_attr($k) . '"' . selected($icon, $k, false) . '>' . esc_html($label) . '</option>';
        }
        echo '</select></label></p><p class="description">Thứ tự hiển thị: chỉnh ô "Thứ tự" trong khung Thuộc tính.</p>';
    }, 'dich-vu', 'side');
});

add_action('save_post_dich-vu', function ($post_id) {
    if (!isset($_POST['ml_service_nonce']) || !wp_verify_nonce($_POST['ml_service_nonce'], 'ml_service_meta')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    update_post_meta($post_id, '_ml_price_from', sanitize_text_field(wp_unslash(isset($_POST['ml_price_from']) ? $_POST['ml_price_from'] : '')));
    update_post_meta($post_id, '_ml_icon', sanitize_key(isset($_POST['ml_icon']) ? $_POST['ml_icon'] : 'wrench'));
});

/** Danh sách dịch vụ sắp theo "Thứ tự". */
add_action('pre_get_posts', function ($q) {
    if (!is_admin() && $q->is_main_query() && is_post_type_archive('dich-vu')) {
        $q->set('orderby', array('menu_order' => 'ASC', 'date' => 'DESC'));
        $q->set('posts_per_page', 24);
    }
});

function ml_get_services($limit = 6)
{
    return get_posts(array(
        'post_type'      => 'dich-vu',
        'posts_per_page' => $limit,
        'orderby'        => array('menu_order' => 'ASC', 'date' => 'DESC'),
    ));
}
