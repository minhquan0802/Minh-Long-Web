<?php
/**
 * Đầu trang: thanh thông tin, logo + tìm kiếm + hotline, menu chính.
 */
$hotline = ml_opt('ml_hotline');
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="ml-skip" href="#main">Bỏ qua đến nội dung</a>

<div class="ml-topbar">
  <div class="ml-container ml-topbar-inner">
    <div class="ml-topbar-left">
      <?php if (ml_opt('ml_email')) : ?>
        <a href="mailto:<?php echo esc_attr(ml_opt('ml_email')); ?>"><?php echo ml_icon('mail', 15); ?><?php echo esc_html(ml_opt('ml_email')); ?></a>
      <?php endif; ?>
      <?php if (ml_opt('ml_hours')) : ?>
        <span class="ml-hide-sm"><?php echo ml_icon('clock', 15); ?><?php echo esc_html(ml_opt('ml_hours')); ?></span>
      <?php endif; ?>
    </div>
    <div class="ml-topbar-right">
      <a href="<?php echo esc_url(ml_zalo_link()); ?>" target="_blank" rel="noopener" class="ml-hide-sm">Zalo: <?php echo esc_html(ml_opt('ml_zalo')); ?></a>
      <a href="<?php echo esc_attr(ml_tel($hotline)); ?>"><?php echo ml_icon('phone', 15); ?>Hotline: <strong><?php echo esc_html($hotline); ?></strong></a>
    </div>
  </div>
</div>

<header class="ml-header">
  <div class="ml-container ml-header-inner">
    <button class="ml-menu-toggle" type="button" aria-controls="ml-nav" aria-expanded="false" aria-label="Mở menu">
      <?php echo ml_icon('menu', 24); ?>
    </button>
    <?php ml_logo(); ?>

    <form class="ml-search" role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>">
      <label class="screen-reader-text" for="ml-s">Tìm sản phẩm</label>
      <input id="ml-s" type="search" name="s" value="<?php echo esc_attr(get_search_query()); ?>" placeholder="Tìm camera, đầu ghi, thiết bị mạng…">
      <?php if (class_exists('WooCommerce')) : ?><input type="hidden" name="post_type" value="product"><?php endif; ?>
      <button type="submit" aria-label="Tìm"><?php echo ml_icon('search', 20); ?></button>
    </form>

    <a class="ml-header-hotline" href="<?php echo esc_attr(ml_tel($hotline)); ?>">
      <span class="ml-hotline-icon"><?php echo ml_icon('phone', 20); ?></span>
      <span class="ml-hotline-text"><small>Hotline 24/7</small><strong><?php echo esc_html($hotline); ?></strong></span>
    </a>
  </div>
</header>

<nav id="ml-nav" class="ml-nav" aria-label="Menu chính">
  <div class="ml-container ml-nav-inner">
    <?php if (class_exists('WooCommerce')) :
        $roots = ml_root_product_cats(); ?>
      <div class="ml-cat-menu">
        <button type="button" class="ml-cat-toggle" aria-expanded="false"><?php echo ml_icon('menu', 18); ?>Danh mục sản phẩm</button>
        <ul class="ml-cat-dropdown">
          <?php foreach ($roots as $cat) :
              $children = get_terms(array('taxonomy' => 'product_cat', 'hide_empty' => true, 'parent' => $cat->term_id, 'orderby' => 'menu_order')); ?>
            <li class="<?php echo $children ? 'has-children' : ''; ?>">
              <a href="<?php echo esc_url(get_term_link($cat)); ?>"><?php echo esc_html($cat->name); ?><?php if ($children) { echo ml_icon('chevron', 14); } ?></a>
              <?php if ($children) : ?>
                <ul class="ml-cat-sub">
                  <?php foreach ($children as $ch) : ?>
                    <li><a href="<?php echo esc_url(get_term_link($ch)); ?>"><?php echo esc_html($ch->name); ?></a></li>
                  <?php endforeach; ?>
                </ul>
              <?php endif; ?>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>
    <?php endif; ?>
    <?php
    wp_nav_menu(array(
        'theme_location' => 'primary',
        'container'      => false,
        'menu_class'     => 'ml-menu',
        'fallback_cb'    => 'ml_fallback_menu',
        'depth'          => 2,
    ));
    ?>
  </div>
</nav>

<main id="main" class="ml-main">
