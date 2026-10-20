<?php
/**
 * Chi tiết bài viết.
 */
get_header();
while (have_posts()) : the_post();
    $cat = get_the_category();
    $crumbs = array();
    if (get_option('page_for_posts')) {
        $crumbs[get_the_title(get_option('page_for_posts'))] = get_permalink(get_option('page_for_posts'));
    }
    if ($cat) {
        $crumbs[$cat[0]->name] = get_category_link($cat[0]);
    }
    $crumbs[get_the_title()] = '';
?>
<div class="ml-container ml-page ml-article-layout">
  <article class="ml-article">
    <?php ml_breadcrumb($crumbs); ?>
    <h1><?php the_title(); ?></h1>
    <p class="ml-post-meta"><?php echo esc_html(get_the_date('d/m/Y')); ?><?php if ($cat) : ?> · <?php echo esc_html($cat[0]->name); ?><?php endif; ?></p>
    <?php if (has_post_thumbnail()) : ?><figure class="ml-article-cover"><?php the_post_thumbnail('large'); ?></figure><?php endif; ?>
    <div class="ml-content"><?php the_content(); ?></div>
  </article>
  <aside class="ml-article-side">
    <div class="ml-side-box ml-side-cta">
      <p>Cần hỗ trợ kỹ thuật?</p>
      <a href="<?php echo esc_attr(ml_tel(ml_opt('ml_hotline'))); ?>"><?php echo ml_icon('phone', 18); ?><?php echo esc_html(ml_opt('ml_hotline')); ?></a>
    </div>
    <?php
    $related = get_posts(array('posts_per_page' => 5, 'post__not_in' => array(get_the_ID()), 'category__in' => $cat ? array($cat[0]->term_id) : array()));
    if ($related) : ?>
      <div class="ml-side-box"><h3>Bài viết liên quan</h3><ul class="ml-side-posts">
        <?php foreach ($related as $r) : ?>
          <li><a href="<?php echo esc_url(get_permalink($r)); ?>"><?php echo esc_html(get_the_title($r)); ?></a><span><?php echo esc_html(get_the_date('d/m/Y', $r)); ?></span></li>
        <?php endforeach; ?>
      </ul></div>
    <?php endif; ?>
  </aside>
</div>
<?php
endwhile;
get_footer();
