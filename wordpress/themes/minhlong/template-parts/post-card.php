<?php
/**
 * Thẻ bài viết (danh sách tin tức, trang chủ).
 */
?>
<article <?php post_class('ml-post-card'); ?>>
  <a class="ml-post-thumb" href="<?php the_permalink(); ?>">
    <?php if (has_post_thumbnail()) { the_post_thumbnail('ml-card', array('loading' => 'lazy', 'alt' => '')); } else { echo '<img src="' . esc_url(ml_placeholder_url()) . '" alt="" loading="lazy">'; } ?>
  </a>
  <div class="ml-post-body">
    <p class="ml-post-meta">
      <?php echo esc_html(get_the_date('d/m/Y')); ?>
      <?php $cat = get_the_category(); if ($cat) : ?> · <a href="<?php echo esc_url(get_category_link($cat[0])); ?>"><?php echo esc_html($cat[0]->name); ?></a><?php endif; ?>
    </p>
    <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
    <p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 24)); ?></p>
  </div>
</article>
