<?php
/**
 * Danh sách bài viết (Tin tức), chuyên mục, tìm kiếm.
 */
get_header();
if (is_search()) {
    $title = 'Kết quả tìm kiếm: ' . get_search_query();
} elseif (is_category() || is_tag()) {
    $title = single_term_title('', false);
} elseif (is_home() && get_option('page_for_posts')) {
    $title = get_the_title(get_option('page_for_posts'));
} else {
    $title = 'Tin tức';
}
?>
<div class="ml-page-head">
  <div class="ml-container">
    <?php ml_breadcrumb(array($title => '')); ?>
    <h1><?php echo esc_html($title); ?></h1>
    <?php if (is_category() && category_description()) : ?><div class="ml-page-desc"><?php echo wp_kses_post(category_description()); ?></div><?php endif; ?>
  </div>
</div>
<div class="ml-container ml-page">
  <?php
  $cats = get_categories(array('hide_empty' => true));
  if (count($cats) > 1 && !is_search()) : ?>
    <nav class="ml-chips" aria-label="Chuyên mục">
      <a href="<?php echo esc_url(get_permalink(get_option('page_for_posts')) ?: home_url('/')); ?>"<?php echo is_home() ? ' class="is-active"' : ''; ?>>Tất cả</a>
      <?php foreach ($cats as $c) : ?>
        <a href="<?php echo esc_url(get_category_link($c)); ?>"<?php echo is_category($c->term_id) ? ' class="is-active"' : ''; ?>><?php echo esc_html($c->name); ?></a>
      <?php endforeach; ?>
    </nav>
  <?php endif; ?>

  <?php if (have_posts()) : ?>
    <div class="ml-post-grid">
      <?php while (have_posts()) : the_post(); get_template_part('template-parts/post-card'); endwhile; ?>
    </div>
    <div class="ml-pagination"><?php the_posts_pagination(array('prev_text' => '‹', 'next_text' => '›', 'mid_size' => 1)); ?></div>
  <?php else : ?>
    <div class="ml-empty"><p>Chưa có nội dung phù hợp.</p><?php get_search_form(); ?></div>
  <?php endif; ?>
</div>
<?php
get_footer();
