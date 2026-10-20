<?php
/**
 * Chân trang + nút liên hệ nổi.
 */
$hotline   = ml_opt('ml_hotline');
$hotline2  = ml_opt('ml_hotline_2');
$map       = ml_opt('ml_map_embed');
$messenger = ml_opt('ml_messenger');
if (!$map && ml_opt('ml_address')) {
    // Chưa dán link nhúng → tự hiện bản đồ theo địa chỉ
    $map = 'https://maps.google.com/maps?q=' . rawurlencode(ml_opt('ml_address')) . '&output=embed';
}
?>
</main>

<footer class="ml-footer">
  <div class="ml-container ml-footer-grid">
    <div class="ml-footer-col ml-footer-about">
      <?php ml_logo(true); ?>
      <p class="ml-footer-company"><?php echo esc_html(ml_opt('ml_company')); ?></p>
      <p><?php echo esc_html(ml_opt('ml_footer_about')); ?></p>
      <ul class="ml-footer-contact">
        <?php if (ml_opt('ml_address')) : ?><li><?php echo ml_icon('map', 17); ?><span><?php echo nl2br(esc_html(ml_opt('ml_address'))); ?></span></li><?php endif; ?>
        <li><?php echo ml_icon('phone', 17); ?><span><a href="<?php echo esc_attr(ml_tel($hotline)); ?>"><?php echo esc_html($hotline); ?></a><?php if ($hotline2) : ?> – <a href="<?php echo esc_attr(ml_tel($hotline2)); ?>"><?php echo esc_html($hotline2); ?></a><?php endif; ?></span></li>
        <?php if (ml_opt('ml_email')) : ?><li><?php echo ml_icon('mail', 17); ?><span><a href="mailto:<?php echo esc_attr(ml_opt('ml_email')); ?>"><?php echo esc_html(ml_opt('ml_email')); ?></a></span></li><?php endif; ?>
        <?php if (ml_opt('ml_hours')) : ?><li><?php echo ml_icon('clock', 17); ?><span><?php echo esc_html(ml_opt('ml_hours')); ?></span></li><?php endif; ?>
      </ul>
    </div>

    <div class="ml-footer-col">
      <h3>Dịch vụ</h3>
      <ul>
        <?php foreach (ml_get_services(7) as $s) : ?>
          <li><a href="<?php echo esc_url(get_permalink($s)); ?>"><?php echo esc_html(get_the_title($s)); ?></a></li>
        <?php endforeach; ?>
      </ul>
    </div>

    <div class="ml-footer-col">
      <h3>Hỗ trợ khách hàng</h3>
      <?php
      wp_nav_menu(array(
          'theme_location' => 'footer',
          'container'      => false,
          'depth'          => 1,
          'fallback_cb'    => '__return_false',
      ));
      ?>
    </div>

    <div class="ml-footer-col">
      <h3>Bản đồ</h3>
      <?php if ($map) : ?>
        <div class="ml-map"><iframe src="<?php echo esc_url($map); ?>" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Bản đồ Minh Long"></iframe></div>
      <?php else : ?>
        <p class="ml-muted">Dán link bản đồ trong Giao diện → Tuỳ biến → Minh Long: Liên hệ.</p>
      <?php endif; ?>
      <?php if (ml_opt('ml_facebook')) : ?>
        <a class="ml-footer-social" href="<?php echo esc_url(ml_opt('ml_facebook')); ?>" target="_blank" rel="noopener"><?php echo ml_icon('facebook', 17); ?>Fanpage Minh Long</a>
      <?php endif; ?>
    </div>
  </div>
  <div class="ml-footer-bottom">
    <div class="ml-container">© <?php echo esc_html(date_i18n('Y')); ?> <?php echo esc_html(ml_opt('ml_company')); ?>. Bảo lưu mọi quyền.</div>
  </div>
</footer>

<div class="ml-float" aria-label="Liên hệ nhanh">
  <a class="ml-float-zalo" href="<?php echo esc_url(ml_zalo_link()); ?>" target="_blank" rel="noopener" aria-label="Chat Zalo">Zalo</a>
  <?php if ($messenger) : ?>
    <a class="ml-float-mess" href="<?php echo esc_url($messenger); ?>" target="_blank" rel="noopener" aria-label="Nhắn tin Messenger"><?php echo ml_icon('message', 22); ?></a>
  <?php endif; ?>
  <a class="ml-float-call" href="<?php echo esc_attr(ml_tel($hotline)); ?>" aria-label="Gọi <?php echo esc_attr($hotline); ?>"><?php echo ml_icon('phone', 22); ?></a>
</div>
<div class="ml-mobile-bar">
  <a class="ml-mobile-call" href="<?php echo esc_attr(ml_tel($hotline)); ?>"><?php echo ml_icon('phone', 18); ?>Gọi ngay</a>
  <a class="ml-mobile-zalo" href="<?php echo esc_url(ml_zalo_link()); ?>" target="_blank" rel="noopener"><?php echo ml_icon('message', 18); ?>Chat Zalo</a>
</div>
<button class="ml-to-top" type="button" aria-label="Lên đầu trang"><?php echo ml_icon('arrow-up', 20); ?></button>

<?php wp_footer(); ?>
</body>
</html>
