<?php
/**
 * Theme Minh Long — website giới thiệu & catalogue (không bán hàng online).
 * Tương thích PHP 7.4 (hosting cPanel của Minh Long).
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ML_VERSION', '1.0.0');
define('ML_DIR', get_template_directory());
define('ML_URI', get_template_directory_uri());

require ML_DIR . '/inc/helpers.php';
require ML_DIR . '/inc/setup.php';
require ML_DIR . '/inc/customizer.php';
require ML_DIR . '/inc/services.php';

if (class_exists('WooCommerce')) {
    require ML_DIR . '/inc/woocommerce.php';
}
