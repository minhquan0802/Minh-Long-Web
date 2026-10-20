<?php
/**
 * Khung chung cho các trang WooCommerce (cửa hàng, danh mục, chi tiết sản phẩm).
 */
get_header();
?>
<div class="ml-container ml-page">
  <?php woocommerce_breadcrumb(); ?>
  <?php if (is_product()) : ?>
    <?php woocommerce_content(); ?>
  <?php else : ?>
    <div class="ml-shop-layout">
      <?php ml_shop_sidebar(); ?>
      <div class="ml-shop-main">
        <?php woocommerce_content(); ?>
      </div>
    </div>
  <?php endif; ?>
</div>
<?php
get_footer();
