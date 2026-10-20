<?php
/**
 * Danh sách dịch vụ: /dich-vu/
 */
get_header();
?>
<div class="ml-page-head">
  <div class="ml-container">
    <?php ml_breadcrumb(array('Dịch vụ' => '')); ?>
    <h1>Dịch vụ IT cho doanh nghiệp</h1>
    <p class="ml-page-desc">Từ hỗ trợ kỹ thuật hằng ngày đến thi công hạ tầng mạng, camera – Minh Long khảo sát, báo giá rõ ràng trước khi triển khai.</p>
  </div>
</div>
<div class="ml-container ml-page">
  <div class="ml-services-grid">
    <?php while (have_posts()) : the_post();
        $icon  = get_post_meta(get_the_ID(), '_ml_icon', true) ?: 'wrench';
        $price = get_post_meta(get_the_ID(), '_ml_price_from', true); ?>
      <article class="ml-service-card">
        <a href="<?php the_permalink(); ?>" class="ml-service-thumb">
          <?php if (has_post_thumbnail()) { the_post_thumbnail('ml-card', array('loading' => 'lazy', 'alt' => '')); } else { echo '<img src="' . esc_url(ml_placeholder_url()) . '" alt="">'; } ?>
          <span class="ml-service-icon"><?php echo ml_icon($icon, 22); ?></span>
        </a>
        <div class="ml-service-body">
          <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
          <p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 26)); ?></p>
          <div class="ml-service-foot">
            <?php if ($price) : ?><span class="ml-service-price"><?php echo esc_html($price); ?></span><?php endif; ?>
            <a href="<?php the_permalink(); ?>">Chi tiết <?php echo ml_icon('chevron', 15); ?></a>
          </div>
        </div>
      </article>
    <?php endwhile; ?>
  </div>
</div>
<?php
get_footer();
