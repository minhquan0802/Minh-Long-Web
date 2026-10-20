<?php
/**
 * Chi tiết dịch vụ.
 */
get_header();
$hotline = ml_opt('ml_hotline');
while (have_posts()) : the_post();
    $price = get_post_meta(get_the_ID(), '_ml_price_from', true); ?>
<div class="ml-page-head">
  <div class="ml-container">
    <?php ml_breadcrumb(array('Dịch vụ' => get_post_type_archive_link('dich-vu'), get_the_title() => '')); ?>
    <h1><?php the_title(); ?></h1>
    <?php if (has_excerpt()) : ?><p class="ml-page-desc"><?php echo esc_html(get_the_excerpt()); ?></p><?php endif; ?>
  </div>
</div>
<div class="ml-container ml-page ml-article-layout">
  <article class="ml-article">
    <?php if (has_post_thumbnail()) : ?><figure class="ml-article-cover"><?php the_post_thumbnail('large'); ?></figure><?php endif; ?>
    <div class="ml-content"><?php the_content(); ?></div>
  </article>
  <aside class="ml-article-side">
    <div class="ml-side-box ml-service-box">
      <h3>Đăng ký dịch vụ</h3>
      <?php if ($price) : ?><p class="ml-service-price-lg">Giá tham khảo: <strong><?php echo esc_html($price); ?></strong></p><?php endif; ?>
      <a class="ml-btn ml-btn-red ml-btn-block" href="<?php echo esc_attr(ml_tel($hotline)); ?>"><?php echo ml_icon('phone', 18); ?>Gọi <?php echo esc_html($hotline); ?></a>
      <a class="ml-btn ml-btn-zalo ml-btn-block" href="<?php echo esc_url(ml_zalo_link()); ?>" target="_blank" rel="noopener"><?php echo ml_icon('message', 18); ?>Nhắn Zalo</a>
      <p class="ml-muted">Khảo sát và báo giá miễn phí trong khu vực nội thành.</p>
    </div>
    <div class="ml-side-box"><h3>Dịch vụ khác</h3><ul class="ml-side-posts">
      <?php foreach (ml_get_services(8) as $s) : if ($s->ID === get_the_ID()) { continue; } ?>
        <li><a href="<?php echo esc_url(get_permalink($s)); ?>"><?php echo esc_html(get_the_title($s)); ?></a></li>
      <?php endforeach; ?>
    </ul></div>
  </aside>
</div>
<?php endwhile;
get_footer();
