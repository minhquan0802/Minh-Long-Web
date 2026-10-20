<?php
/**
 * Thẻ sản phẩm trong danh sách (ghi đè template WooCommerce).
 * Không có nút giỏ hàng — chỉ giá + nút liên hệ.
 *
 * @version 9.4.0
 */

defined('ABSPATH') || exit;

global $product;
if (empty($product) || !$product->is_visible()) {
    return;
}
$link    = get_permalink($product->get_id());
$brands  = get_the_terms($product->get_id(), 'product_brand');
$brand   = ($brands && !is_wp_error($brands)) ? $brands[0]->name : '';
$pct     = ml_discount_percent($product);
?>
<li <?php wc_product_class('ml-product-card', $product); ?>>
  <a class="ml-product-thumb" href="<?php echo esc_url($link); ?>">
    <?php
    if ($product->get_image_id()) {
        echo wp_get_attachment_image($product->get_image_id(), 'woocommerce_thumbnail', false, array('loading' => 'lazy', 'alt' => esc_attr($product->get_name())));
    } else {
        echo '<img src="' . esc_url(ml_placeholder_url()) . '" alt="" loading="lazy">';
    }
    ?>
    <?php if ($pct) : ?><span class="onsale">-<?php echo (int) $pct; ?>%</span><?php endif; ?>
    <?php if (!$product->is_in_stock()) : ?><span class="ml-badge-out">Tạm hết hàng</span><?php endif; ?>
  </a>
  <div class="ml-product-body">
    <?php if ($brand) : ?><span class="ml-product-brand"><?php echo esc_html($brand); ?></span><?php endif; ?>
    <h3 class="ml-product-name"><a href="<?php echo esc_url($link); ?>"><?php echo esc_html($product->get_name()); ?></a></h3>
    <div class="ml-product-price"><?php echo wp_kses_post($product->get_price_html() ?: '<span class="ml-price-contact">Liên hệ</span>'); ?></div>
    <div class="ml-product-actions">
      <a class="ml-mini-btn" href="<?php echo esc_url($link); ?>">Xem chi tiết</a>
      <a class="ml-mini-btn ml-mini-zalo" href="<?php echo esc_url(ml_zalo_link()); ?>" target="_blank" rel="noopener" aria-label="<?php echo esc_attr('Hỏi giá ' . $product->get_name() . ' qua Zalo'); ?>">Zalo</a>
    </div>
  </div>
</li>
