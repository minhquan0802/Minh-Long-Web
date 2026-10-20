<?php
/**
 * WooCommerce ở chế độ CATALOGUE: hiện sản phẩm + giá, KHÔNG giỏ hàng / thanh toán.
 * Khách muốn mua → gọi điện / chat Zalo.
 */

if (!defined('ABSPATH')) {
    exit;
}

/* ---------- Tắt mua hàng ---------- */

// Không sản phẩm nào "mua được" → WooCommerce tự ẩn nút thêm giỏ
add_filter('woocommerce_is_purchasable', '__return_false');
add_filter('woocommerce_variation_is_purchasable', '__return_false');

// Bỏ nút giỏ hàng ở danh sách và trang chi tiết
remove_action('woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10);
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30);

// Ai vào thẳng /gio-hang, /thanh-toan → về trang sản phẩm
add_action('template_redirect', function () {
    if ((function_exists('is_cart') && is_cart()) || (function_exists('is_checkout') && is_checkout())) {
        wp_safe_redirect(wc_get_page_permalink('shop'));
        exit;
    }
});

// Không tải script giỏ hàng (nhẹ trang hơn)
add_action('wp_enqueue_scripts', function () {
    wp_dequeue_script('wc-cart-fragments');
}, 99);

/* ---------- Giá ---------- */

// Chưa nhập giá → "Liên hệ"
add_filter('woocommerce_empty_price_html', function () {
    return '<span class="ml-price-contact">Liên hệ</span>';
});

// Đổi ký hiệu tiền: 15.990.000đ (WooCommerce mặc định "₫" đứng sau có khoảng trắng)
add_filter('woocommerce_currency_symbol', function ($symbol, $currency) {
    return $currency === 'VND' ? 'đ' : $symbol;
}, 10, 2);

/** % giảm giá của sản phẩm (0 nếu không giảm). */
function ml_discount_percent($product)
{
    if (!$product || !$product->is_on_sale()) {
        return 0;
    }
    $regular = (float) $product->get_regular_price();
    $sale    = (float) $product->get_sale_price();
    return ($regular > 0 && $sale > 0) ? (int) round((1 - $sale / $regular) * 100) : 0;
}

// Nhãn "Giảm x%" thay cho chữ "Sale!"
add_filter('woocommerce_sale_flash', function ($html, $post, $product) {
    $pct = ml_discount_percent($product);
    return $pct ? '<span class="onsale">-' . $pct . '%</span>' : '';
}, 10, 3);

/* ---------- Trang chi tiết: khối liên hệ thay cho nút mua ---------- */

add_action('woocommerce_single_product_summary', function () {
    $hotline = ml_opt('ml_hotline');
    echo '<div class="ml-buy-box">';
    echo '<a class="ml-btn ml-btn-red ml-btn-lg" href="' . esc_attr(ml_tel($hotline)) . '">' . ml_icon('phone', 20) . '<span><strong>Gọi đặt hàng ' . esc_html($hotline) . '</strong><small>Tư vấn miễn phí, báo giá theo số lượng</small></span></a>';
    echo '<a class="ml-btn ml-btn-zalo ml-btn-lg" href="' . esc_url(ml_zalo_link()) . '" target="_blank" rel="noopener">' . ml_icon('message', 20) . '<span><strong>Chat Zalo</strong><small>Gửi tên sản phẩm để nhận giá tốt</small></span></a>';
    echo '</div>';
    echo '<ul class="ml-policy">';
    echo '<li>' . ml_icon('shield', 18) . 'Hàng chính hãng, đủ hoá đơn VAT</li>';
    echo '<li>' . ml_icon('truck', 18) . 'Giao hàng, lắp đặt tận nơi</li>';
    echo '<li>' . ml_icon('wrench', 18) . 'Bảo hành, hỗ trợ kỹ thuật sau bán</li>';
    echo '</ul>';
}, 30);

// Bỏ "Danh mục: / Từ khoá:" lặt vặt dưới khối giá, chỉ giữ mã SKU
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40);
add_action('woocommerce_single_product_summary', function () {
    global $product;
    $sku    = $product->get_sku();
    $brands = get_the_term_list($product->get_id(), 'product_brand', '', ', ');
    echo '<p class="ml-product-meta">';
    if ($brands && !is_wp_error($brands)) {
        echo '<span>Thương hiệu: ' . wp_kses_post($brands) . '</span>';
    }
    if ($sku) {
        echo '<span>Mã: ' . esc_html($sku) . '</span>';
    }
    echo '<span class="' . ($product->is_in_stock() ? 'ml-in-stock' : 'ml-out-stock') . '">' . ($product->is_in_stock() ? 'Còn hàng' : 'Tạm hết hàng') . '</span>';
    echo '</p>';
}, 6);

// Tab "Thông tin bổ sung" → "Thông số kỹ thuật"
add_filter('woocommerce_product_tabs', function ($tabs) {
    if (isset($tabs['description'])) {
        $tabs['description']['title'] = 'Mô tả sản phẩm';
    }
    if (isset($tabs['additional_information'])) {
        $tabs['additional_information']['title'] = 'Thông số kỹ thuật';
        $tabs['additional_information']['priority'] = 5;
    }
    unset($tabs['reviews']);
    return $tabs;
}, 98);

add_filter('woocommerce_output_related_products_args', function ($args) {
    $args['posts_per_page'] = 5;
    $args['columns'] = 5;
    return $args;
});

/* ---------- Danh sách sản phẩm ---------- */

add_filter('loop_shop_per_page', function () {
    return 20;
});
add_filter('loop_shop_columns', function () {
    return 4;
});

// Bọc nội dung WooCommerce bằng khung của theme
remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);
remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);

// Breadcrumb tiếng Việt, gọn
add_filter('woocommerce_breadcrumb_defaults', function ($d) {
    $d['delimiter']   = ' <span aria-hidden="true">/</span> ';
    $d['wrap_before'] = '<nav class="ml-breadcrumb" aria-label="Đường dẫn">';
    $d['wrap_after']  = '</nav>';
    $d['home']        = 'Trang chủ';
    return $d;
});

/** Cột trái trang danh mục: cây danh mục + thương hiệu. */
function ml_shop_sidebar()
{
    $current = is_product_category() ? get_queried_object_id() : 0;
    $cats = get_terms(array('taxonomy' => 'product_cat', 'hide_empty' => true, 'parent' => 0, 'orderby' => 'menu_order'));
    echo '<aside class="ml-shop-sidebar">';
    echo '<div class="ml-side-box"><h3>Danh mục sản phẩm</h3><ul>';
    foreach ($cats as $cat) {
        if ($cat->slug === 'uncategorized' || $cat->slug === 'chua-phan-loai') {
            continue;
        }
        $children = get_terms(array('taxonomy' => 'product_cat', 'hide_empty' => true, 'parent' => $cat->term_id, 'orderby' => 'menu_order'));
        $active = ($current === $cat->term_id || term_is_ancestor_of($cat->term_id, $current, 'product_cat')) ? ' class="is-active"' : '';
        echo '<li' . $active . '><a href="' . esc_url(get_term_link($cat)) . '">' . esc_html($cat->name) . '</a>';
        if ($children && $active) {
            echo '<ul>';
            foreach ($children as $ch) {
                echo '<li' . ($current === $ch->term_id ? ' class="is-active"' : '') . '><a href="' . esc_url(get_term_link($ch)) . '">' . esc_html($ch->name) . '</a></li>';
            }
            echo '</ul>';
        }
        echo '</li>';
    }
    echo '</ul></div>';

    $brands = get_terms(array('taxonomy' => 'product_brand', 'hide_empty' => true));
    if ($brands && !is_wp_error($brands)) {
        echo '<div class="ml-side-box"><h3>Thương hiệu</h3><ul class="ml-brand-list">';
        foreach ($brands as $b) {
            echo '<li><a href="' . esc_url(get_term_link($b)) . '">' . esc_html($b->name) . ' <span>(' . (int) $b->count . ')</span></a></li>';
        }
        echo '</ul></div>';
    }

    $hotline = ml_opt('ml_hotline');
    echo '<div class="ml-side-box ml-side-cta"><p>Cần tư vấn chọn thiết bị?</p><a href="' . esc_attr(ml_tel($hotline)) . '">' . ml_icon('phone', 18) . esc_html($hotline) . '</a></div>';
    echo '</aside>';
}

/** Danh mục gốc theo thứ tự (dùng cho menu + trang chủ). */
function ml_root_product_cats()
{
    $cats = get_terms(array('taxonomy' => 'product_cat', 'hide_empty' => true, 'parent' => 0, 'orderby' => 'menu_order'));
    return array_values(array_filter(is_array($cats) ? $cats : array(), function ($c) {
        return !in_array($c->slug, array('uncategorized', 'chua-phan-loai'), true);
    }));
}
