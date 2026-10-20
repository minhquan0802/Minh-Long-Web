<?php
/**
 * Trang chủ.
 */
get_header();
$home     = ml_home_data();
$services = ml_get_services(6);
$hotline  = ml_opt('ml_hotline');
?>

<?php /* ---------- Banner ảnh ---------- */ ?>
<?php if ($home['slides']) : ?>
<section class="ml-hero" aria-roledescription="carousel" aria-label="Giới thiệu">
  <div class="ml-hero-track">
    <?php foreach ($home['slides'] as $i => $s) :
        $img = $s['image'] ? wp_get_attachment_image_url($s['image'], 'ml-hero') : ''; ?>
      <div class="ml-hero-slide<?php echo $i === 0 ? ' is-active' : ''; ?>" role="group" aria-roledescription="slide" aria-label="<?php echo esc_attr(($i + 1) . ' / ' . count($home['slides'])); ?>">
        <?php if ($img) : ?><img class="ml-hero-img" src="<?php echo esc_url($img); ?>" alt="" <?php echo $i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'; ?>><?php endif; ?>
        <div class="ml-container ml-hero-content">
          <?php if ($i === 0) : ?><h1><?php echo esc_html($s['title']); ?></h1><?php else : ?><h2><?php echo esc_html($s['title']); ?></h2><?php endif; ?>
          <p><?php echo esc_html($s['text']); ?></p>
          <div class="ml-hero-actions">
            <?php if ($s['btn']) : ?><a class="ml-btn ml-btn-primary" href="<?php echo esc_url(home_url($s['link'])); ?>"><?php echo esc_html($s['btn']); ?></a><?php endif; ?>
            <a class="ml-btn ml-btn-white" href="<?php echo esc_attr(ml_tel($hotline)); ?>"><?php echo ml_icon('phone', 18); ?><?php echo esc_html($hotline); ?></a>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
  <?php if (count($home['slides']) > 1) : ?>
    <div class="ml-hero-dots">
      <?php foreach ($home['slides'] as $i => $s) : ?>
        <button type="button" aria-label="<?php echo esc_attr('Xem banner ' . ($i + 1)); ?>"<?php echo $i === 0 ? ' class="is-active"' : ''; ?>></button>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</section>
<?php endif; ?>

<?php /* ---------- Cam kết ---------- */
$commit_icons = array('headset', 'truck', 'shield', 'tag'); ?>
<section class="ml-commits">
  <div class="ml-container ml-commits-grid">
    <?php foreach ($home['commits'] as $i => $c) : if (!$c[0]) { continue; } ?>
      <div class="ml-commit">
        <span class="ml-commit-icon"><?php echo ml_icon($commit_icons[$i % 4], 26); ?></span>
        <div><strong><?php echo esc_html($c[0]); ?></strong><span><?php echo esc_html($c[1]); ?></span></div>
      </div>
    <?php endforeach; ?>
  </div>
</section>

<?php /* ---------- Dịch vụ ---------- */ ?>
<?php if ($services) : ?>
<section class="ml-section">
  <div class="ml-container">
    <?php ml_section_head('Dịch vụ của Minh Long', get_post_type_archive_link('dich-vu'), 'Tất cả dịch vụ'); ?>
    <div class="ml-services-grid">
      <?php foreach ($services as $s) :
          $icon  = get_post_meta($s->ID, '_ml_icon', true) ?: 'wrench';
          $price = get_post_meta($s->ID, '_ml_price_from', true); ?>
        <article class="ml-service-card">
          <a href="<?php echo esc_url(get_permalink($s)); ?>" class="ml-service-thumb">
            <?php if (has_post_thumbnail($s)) { echo get_the_post_thumbnail($s, 'ml-card', array('loading' => 'lazy', 'alt' => '')); } else { echo '<img src="' . esc_url(ml_placeholder_url()) . '" alt="" loading="lazy">'; } ?>
            <span class="ml-service-icon"><?php echo ml_icon($icon, 22); ?></span>
          </a>
          <div class="ml-service-body">
            <h3><a href="<?php echo esc_url(get_permalink($s)); ?>"><?php echo esc_html(get_the_title($s)); ?></a></h3>
            <p><?php echo esc_html(wp_trim_words(get_the_excerpt($s), 22)); ?></p>
            <div class="ml-service-foot">
              <?php if ($price) : ?><span class="ml-service-price"><?php echo esc_html($price); ?></span><?php endif; ?>
              <a href="<?php echo esc_url(get_permalink($s)); ?>">Chi tiết <?php echo ml_icon('chevron', 15); ?></a>
            </div>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php /* ---------- Giới thiệu + số liệu ---------- */
$about_img = (int) get_theme_mod('ml_about_image', 0); ?>
<section class="ml-section ml-about">
  <div class="ml-container ml-about-grid">
    <div class="ml-about-media">
      <?php if ($about_img) { echo wp_get_attachment_image($about_img, 'large', false, array('loading' => 'lazy')); } ?>
    </div>
    <div class="ml-about-text">
      <h2 class="ml-section-title"><?php echo esc_html(get_theme_mod('ml_about_title', 'Về Minh Long')); ?></h2>
      <?php echo wpautop(wp_kses_post(get_theme_mod('ml_about_text', ml_about_default()))); ?>
      <dl class="ml-stats">
        <?php foreach ($home['stats'] as $st) : if (!$st[0]) { continue; } ?>
          <div><dt><?php echo esc_html($st[0]); ?></dt><dd><?php echo esc_html($st[1]); ?></dd></div>
        <?php endforeach; ?>
      </dl>
      <a class="ml-btn ml-btn-primary" href="<?php echo esc_url(home_url('/gioi-thieu/')); ?>">Tìm hiểu thêm</a>
    </div>
  </div>
</section>

<?php /* ---------- Sản phẩm theo danh mục ---------- */
if (class_exists('WooCommerce')) :
    $slugs = array_filter(array_map('trim', explode(',', (string) get_theme_mod('ml_home_cats', ''))));
    $cats  = array();
    if ($slugs) {
        foreach ($slugs as $slug) {
            $t = get_term_by('slug', $slug, 'product_cat');
            if ($t) { $cats[] = $t; }
        }
    } else {
        $cats = array_slice(ml_root_product_cats(), 0, 4);
    }
    foreach ($cats as $cat) :
        $children = get_terms(array('taxonomy' => 'product_cat', 'hide_empty' => true, 'parent' => $cat->term_id, 'orderby' => 'menu_order'));
        $q = new WP_Query(array(
            'post_type'      => 'product',
            'posts_per_page' => 10,
            'tax_query'      => array(array('taxonomy' => 'product_cat', 'field' => 'term_id', 'terms' => $cat->term_id)),
            'orderby'        => array('menu_order' => 'ASC', 'date' => 'DESC'),
        ));
        if (!$q->have_posts()) { continue; } ?>
<section class="ml-section ml-cat-block">
  <div class="ml-container">
    <div class="ml-cat-head">
      <h2><a href="<?php echo esc_url(get_term_link($cat)); ?>"><?php echo esc_html($cat->name); ?></a></h2>
      <?php if ($children && !is_wp_error($children)) : ?>
        <ul class="ml-cat-tabs">
          <?php foreach (array_slice($children, 0, 5) as $ch) : ?>
            <li><a href="<?php echo esc_url(get_term_link($ch)); ?>"><?php echo esc_html($ch->name); ?></a></li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>
      <a class="ml-section-more" href="<?php echo esc_url(get_term_link($cat)); ?>">Xem tất cả <?php echo ml_icon('chevron', 16); ?></a>
    </div>
    <ul class="products columns-5">
      <?php while ($q->have_posts()) : $q->the_post(); wc_get_template_part('content', 'product'); endwhile; wp_reset_postdata(); ?>
    </ul>
  </div>
</section>
    <?php endforeach;
endif; ?>

<?php /* ---------- Yêu cầu hỗ trợ ---------- */ ?>
<section class="ml-cta">
  <div class="ml-container ml-cta-grid">
    <div>
      <h2>Cần tư vấn giải pháp IT cho doanh nghiệp?</h2>
      <p>Để lại thông tin, kỹ thuật viên Minh Long sẽ gọi lại tư vấn và hẹn lịch khảo sát miễn phí.</p>
      <a class="ml-cta-phone" href="<?php echo esc_attr(ml_tel($hotline)); ?>"><?php echo ml_icon('phone', 22); ?><?php echo esc_html($hotline); ?></a>
    </div>
    <div class="ml-cta-form">
      <?php
      $cf7 = ml_opt('ml_cf7_id');
      if ($cf7 && shortcode_exists('contact-form-7')) {
          echo do_shortcode('[contact-form-7 id="' . esc_attr($cf7) . '"]');
      } else {
          echo '<p>Chưa gắn form. Vào Giao diện → Tuỳ biến → Minh Long: Liên hệ → nhập mã form Contact Form 7.</p>';
      }
      ?>
    </div>
  </div>
</section>

<?php /* ---------- Thương hiệu / đối tác ---------- */
$partner_ids = array_filter(array_map('absint', explode(',', (string) get_theme_mod('ml_partners', ''))));
$logos = array();
if ($partner_ids) {
    foreach ($partner_ids as $id) { $logos[] = array('img' => wp_get_attachment_image_url($id, 'medium'), 'name' => get_the_title($id), 'url' => ''); }
} elseif (taxonomy_exists('product_brand')) {
    foreach (get_terms(array('taxonomy' => 'product_brand', 'hide_empty' => false)) as $b) {
        $tid = (int) get_term_meta($b->term_id, 'thumbnail_id', true);
        if ($tid) { $logos[] = array('img' => wp_get_attachment_image_url($tid, 'medium'), 'name' => $b->name, 'url' => get_term_link($b)); }
    }
}
if ($logos) : ?>
<section class="ml-section ml-partners">
  <div class="ml-container">
    <?php ml_section_head('Thương hiệu phân phối'); ?>
    <ul class="ml-partner-grid">
      <?php foreach ($logos as $l) : ?>
        <li><?php if ($l['url']) : ?><a href="<?php echo esc_url($l['url']); ?>" title="<?php echo esc_attr($l['name']); ?>"><?php endif; ?><img src="<?php echo esc_url($l['img']); ?>" alt="<?php echo esc_attr($l['name']); ?>" loading="lazy"><?php if ($l['url']) : ?></a><?php endif; ?></li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
<?php endif; ?>

<?php /* ---------- Tin tức ---------- */
$news = get_posts(array('posts_per_page' => 4));
if ($news) : ?>
<section class="ml-section ml-news">
  <div class="ml-container">
    <?php ml_section_head('Tin tức & kinh nghiệm', get_permalink(get_option('page_for_posts')) ?: home_url('/')); ?>
    <div class="ml-post-grid">
      <?php foreach ($news as $p) { setup_postdata($GLOBALS['post'] = $p); get_template_part('template-parts/post-card'); } wp_reset_postdata(); ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php get_footer();
