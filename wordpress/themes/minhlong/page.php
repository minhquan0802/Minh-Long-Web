<?php
/**
 * Trang tĩnh (Giới thiệu, Liên hệ, Chính sách...).
 */
get_header();
while (have_posts()) : the_post(); ?>
<div class="ml-page-head">
  <div class="ml-container">
    <?php ml_breadcrumb(array(get_the_title() => '')); ?>
    <h1><?php the_title(); ?></h1>
  </div>
</div>
<div class="ml-container ml-page">
  <div class="ml-content ml-content-page"><?php the_content(); ?></div>
</div>
<?php endwhile;
get_footer();
