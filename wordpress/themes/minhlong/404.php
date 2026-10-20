<?php
/**
 * Không tìm thấy trang.
 */
get_header();
?>
<div class="ml-container ml-page ml-404">
  <p class="ml-404-code">404</p>
  <h1>Không tìm thấy trang bạn cần</h1>
  <p>Đường dẫn có thể đã thay đổi. Bạn thử tìm sản phẩm hoặc liên hệ hotline để được hỗ trợ.</p>
  <?php get_search_form(); ?>
  <p><a class="ml-btn ml-btn-primary" href="<?php echo esc_url(home_url('/')); ?>">Về trang chủ</a></p>
</div>
<?php
get_footer();
