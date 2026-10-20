<?php
/**
 * Nhập nội dung mẫu cho website Minh Long (WordPress + WooCommerce).
 * Chạy:  docker compose run --rm cli wp eval-file /import/import.php
 * Chạy lại nhiều lần được: mục nào đã có (theo slug / SKU) thì cập nhật, không tạo trùng.
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

$DIR    = '/import';
$seed   = json_decode(file_get_contents($DIR . '/seed.json'), true);
$images = json_decode(file_get_contents($DIR . '/images.json'), true);

function ml_log($msg)
{
    WP_CLI::log($msg);
}

/** Đưa ảnh vào Thư viện (mỗi file chỉ nhập 1 lần). */
function ml_import_image($file, $title)
{
    $map = get_option('ml_import_media', array());
    if (isset($map[$file]) && get_post($map[$file])) {
        return (int) $map[$file];
    }
    $src = '/import/img/' . $file;
    if (!file_exists($src)) {
        ml_log("  ! thiếu ảnh $file");
        return 0;
    }
    $tmp = wp_tempnam($file);
    copy($src, $tmp);
    $id = media_handle_sideload(array('name' => $file, 'tmp_name' => $tmp), 0, $title);
    if (is_wp_error($id)) {
        ml_log('  ! lỗi ảnh ' . $file . ': ' . $id->get_error_message());
        return 0;
    }
    update_post_meta($id, '_wp_attachment_image_alt', $title);
    $map[$file] = $id;
    update_option('ml_import_media', $map, false);
    return (int) $id;
}

/** Tạo / cập nhật term. */
function ml_term($taxonomy, $name, $slug, $parent = 0, $order = 0, $description = '')
{
    $t = get_term_by('slug', $slug, $taxonomy);
    if ($t) {
        wp_update_term($t->term_id, $taxonomy, array('name' => $name, 'parent' => $parent, 'description' => $description));
        $id = $t->term_id;
    } else {
        $r  = wp_insert_term($name, $taxonomy, array('slug' => $slug, 'parent' => $parent, 'description' => $description));
        $id = is_wp_error($r) ? 0 : $r['term_id'];
    }
    if ($id && $taxonomy === 'product_cat') {
        update_term_meta($id, 'order', $order);
    }
    return (int) $id;
}

/** Tạo / cập nhật bài theo slug. */
function ml_upsert_post($type, $slug, $data)
{
    $existing = get_page_by_path($slug, OBJECT, $type);
    $data = array_merge(array('post_type' => $type, 'post_name' => $slug, 'post_status' => 'publish'), $data);
    if ($existing) {
        $data['ID'] = $existing->ID;
        return (int) wp_update_post($data);
    }
    return (int) wp_insert_post($data);
}

/** Nội dung dạng mảng (chuỗi / {h2} / {ul}) → HTML. */
function ml_blocks_html($blocks)
{
    $html = '';
    foreach ($blocks as $b) {
        if (is_string($b)) {
            $html .= '<p>' . esc_html($b) . "</p>\n";
        } elseif (isset($b['h2'])) {
            $html .= '<h2>' . esc_html($b['h2']) . "</h2>\n";
        } elseif (isset($b['ul'])) {
            $html .= "<ul>\n";
            foreach ($b['ul'] as $li) {
                $html .= '<li>' . esc_html($li) . "</li>\n";
            }
            $html .= "</ul>\n";
        }
    }
    return $html;
}

/* =====================================================================
   1. Danh mục sản phẩm (theo mảng kinh doanh của Minh Long)
   ===================================================================== */
ml_log('== Danh mục sản phẩm');
$cat_tree = array(
    array('camera-quan-sat', 'Camera quan sát', 'Camera IP, camera Wifi trong nhà – ngoài trời chính hãng Hikvision, Dahua. Lắp đặt trọn gói tận nơi.', array(
        array('camera-hikvision', 'Camera Hikvision'),
        array('camera-dahua', 'Camera Dahua'),
    )),
    array('dau-ghi-hinh', 'Đầu ghi hình', 'Đầu ghi hình IP, HD-TVI nhiều kênh, hỗ trợ xem từ xa qua điện thoại.', array()),
    array('thiet-bi-mang', 'Thiết bị mạng', 'Bộ phát Wifi, Wifi Mesh, switch PoE cho văn phòng, nhà xưởng, gia đình.', array(
        array('thiet-bi-wifi', 'Thiết bị Wifi'),
        array('switch-chia-mang', 'Switch chia mạng'),
    )),
    array('man-hinh', 'Màn hình', 'Màn hình văn phòng, đồ hoạ Dell, HP, ASUS chính hãng.', array()),
    array('may-tinh-laptop', 'Máy tính – Laptop', 'Laptop, máy tính để bàn cho doanh nghiệp, cấu hình theo nhu cầu.', array(
        array('laptop', 'Laptop'),
        array('may-tinh-de-ban', 'Máy tính để bàn'),
    )),
    array('may-in-muc-in', 'Máy in – Mực in', 'Máy in laser văn phòng, mực in chính hãng, nạp mực tận nơi.', array()),
    array('luu-tru-may-chu', 'Lưu trữ – Máy chủ', 'NAS Synology, máy chủ Dell PowerEdge cho doanh nghiệp vừa và nhỏ.', array()),
    array('linh-kien-phu-kien', 'Linh kiện – Phụ kiện', 'RAM, SSD, bàn phím, chuột, tai nghe.', array()),
    array('phan-mem-ban-quyen', 'Phần mềm bản quyền', 'Windows, Microsoft 365 bản quyền, hỗ trợ cài đặt.', array()),
);
$cat_ids = array();
foreach ($cat_tree as $i => $c) {
    $pid = ml_term('product_cat', $c[1], $c[0], 0, $i + 1, $c[2]);
    $cat_ids[$c[0]] = $pid;
    foreach ($c[3] as $j => $ch) {
        $cat_ids[$ch[0]] = ml_term('product_cat', $ch[1], $ch[0], $pid, $j + 1);
    }
}
// Danh mục mặc định "Chưa phân loại" → ẩn khỏi menu bằng cách để trống
ml_log('  ' . count($cat_ids) . ' danh mục');

$sku_cat = array(
    'HK-2CD1043G2' => 'camera-hikvision', 'DH-HEROC1' => 'camera-dahua', 'DH-HFW1430' => 'camera-dahua',
    'HK-7608NXI' => 'dau-ghi-hinh',
    'TP-DECOX50-3' => 'thiet-bi-wifi', 'RJ-EW1800GX' => 'thiet-bi-wifi',
    'TP-SG1016D' => 'switch-chia-mang', 'RJ-ES110GDS' => 'switch-chia-mang',
    'DL-P2423H' => 'man-hinh', 'HP-M27F' => 'man-hinh', 'AS-PA279CV' => 'man-hinh',
    'DL-LAT3540-I5' => 'laptop', 'HP-PB450G10' => 'laptop', 'LN-TPE14G5' => 'laptop', 'AS-VB15OLED' => 'laptop', 'AS-TUFF15-4060' => 'laptop', 'LN-LOQ15' => 'laptop',
    'DL-OPT7010' => 'may-tinh-de-ban', 'ML-PC-OFFICE' => 'may-tinh-de-ban',
    'CN-LBP2900' => 'may-in-muc-in', 'BR-L2366DW' => 'may-in-muc-in', 'CN-CART303' => 'may-in-muc-in',
    'SY-DS224P' => 'luu-tru-may-chu', 'DL-T150' => 'luu-tru-may-chu',
    'KS-FURY16' => 'linh-kien-phu-kien', 'KS-NV2-500' => 'linh-kien-phu-kien', 'LG-MK295' => 'linh-kien-phu-kien', 'LG-H390' => 'linh-kien-phu-kien',
    'MS-WIN11PRO' => 'phan-mem-ban-quyen', 'MS-365BS' => 'phan-mem-ban-quyen',
);
$name_fix = array('DL-P2423H' => 'Màn hình Dell P2423 24" IPS');

/* =====================================================================
   2. Thương hiệu + logo
   ===================================================================== */
ml_log('== Thương hiệu');
$brand_ids = array();
foreach ($images['logos'] as $name => $file) {
    $tid = ml_term('product_brand', $name, sanitize_title($name));
    $brand_ids[$name] = $tid;
    $img = ml_import_image($file, 'Logo ' . $name);
    if ($tid && $img) {
        update_term_meta($tid, 'thumbnail_id', $img);
    }
}
ml_log('  ' . count($brand_ids) . ' thương hiệu');

/* =====================================================================
   3. Sản phẩm
   ===================================================================== */
ml_log('== Sản phẩm');
foreach ($seed['products'] as $i => $p) {
    $sku  = $p['sku'];
    $name = isset($name_fix[$sku]) ? $name_fix[$sku] : $p['name'];
    $pid  = wc_get_product_id_by_sku($sku);
    $product = $pid ? wc_get_product($pid) : new WC_Product_Simple();
    $product->set_name($name);
    $product->set_slug(sanitize_title(remove_accents($name)));
    $product->set_sku($sku);
    $product->set_status('publish');
    $product->set_catalog_visibility('visible');
    $product->set_regular_price(isset($p['price']) ? (string) $p['price'] : '');
    $product->set_sale_price(isset($p['sale']) ? (string) $p['sale'] : '');
    $product->set_short_description('<p>' . esc_html($p['short']) . '</p>');
    $desc  = '<p>' . esc_html($p['short']) . "</p>\n<h2>Điểm nổi bật</h2>\n<ul>\n";
    foreach ($p['specs'] as $s) {
        $desc .= '<li>' . esc_html($s[0] . ': ' . $s[1]) . "</li>\n";
    }
    $desc .= "</ul>\n<p>Sản phẩm chính hãng, đầy đủ hoá đơn VAT. Minh Long hỗ trợ tư vấn cấu hình, giao hàng và lắp đặt tận nơi.</p>";
    $product->set_description($desc);
    $product->set_stock_status(isset($p['stock']) && $p['stock'] === 'out_of_stock' ? 'outofstock' : 'instock');
    $product->set_featured(!empty($p['featured']));
    $product->set_menu_order($i);
    $product->set_category_ids(array($cat_ids[$sku_cat[$sku]]));

    // Thông số kỹ thuật → bảng "Thông số kỹ thuật"
    $attrs = array();
    $rows  = array_merge($p['specs'], array(array('Bảo hành', $p['warranty'])));
    foreach ($rows as $k => $s) {
        $a = new WC_Product_Attribute();
        $a->set_id(0);
        $a->set_name($s[0]);
        $a->set_options(array($s[1]));
        $a->set_position($k);
        $a->set_visible(true);
        $a->set_variation(false);
        $attrs[] = $a;
    }
    $product->set_attributes($attrs);

    // Ảnh
    $files = isset($images['products'][$sku]) ? $images['products'][$sku] : array();
    $ids = array();
    foreach ($files as $f) {
        $img = ml_import_image($f, $name);
        if ($img) {
            $ids[] = $img;
        }
    }
    if ($ids) {
        $product->set_image_id(array_shift($ids));
        $product->set_gallery_image_ids($ids);
    }
    $id = $product->save();
    if (isset($brand_ids[$p['brand']])) {
        wp_set_object_terms($id, array((int) $brand_ids[$p['brand']]), 'product_brand');
    }
}
ml_log('  ' . count($seed['products']) . ' sản phẩm');

// Ảnh đại diện danh mục = ảnh sản phẩm đầu tiên trong danh mục
foreach ($cat_ids as $slug => $tid) {
    $q = wc_get_products(array('limit' => 1, 'category' => array($slug), 'orderby' => 'menu_order', 'order' => 'ASC', 'return' => 'objects'));
    if ($q && $q[0]->get_image_id()) {
        update_term_meta($tid, 'thumbnail_id', $q[0]->get_image_id());
    }
}

/* =====================================================================
   4. Dịch vụ (định hướng doanh nghiệp)
   ===================================================================== */
ml_log('== Dịch vụ');
$services = array(
    array('it-helpdesk', 'IT Helpdesk – hỗ trợ kỹ thuật từ xa', 'headset', 'Từ 1.500.000đ/tháng', 'dich-vu-16.webp',
        'Đội ngũ kỹ thuật tiếp nhận và xử lý sự cố máy tính, phần mềm, email, mạng cho nhân viên qua điện thoại, Zalo và điều khiển từ xa.',
        array('Tiếp nhận yêu cầu qua hotline, Zalo, email', 'Xử lý từ xa phần lớn sự cố trong 30 phút', 'Báo cáo tình trạng hệ thống hằng tháng', 'Gói theo số lượng máy, không phát sinh chi phí')),
    array('it-onsite', 'IT Onsite – kỹ thuật viên tại doanh nghiệp', 'users', 'Báo giá theo nhu cầu', 'dich-vu-10.webp',
        'Cử kỹ thuật viên làm việc trực tiếp tại văn phòng theo lịch cố định hoặc toàn thời gian, thay thế bộ phận IT nội bộ với chi phí hợp lý.',
        array('Kỹ thuật viên có kinh nghiệm, được đào tạo bài bản', 'Linh hoạt: theo buổi, theo tuần hoặc toàn thời gian', 'Có người thay thế khi nghỉ phép', 'Quản lý tài sản CNTT, phần mềm bản quyền')),
    array('bao-tri-may-tinh-may-in', 'Bảo trì máy tính, máy in định kỳ', 'wrench', 'Từ 80.000đ/máy', 'dich-vu-14.webp',
        'Vệ sinh, kiểm tra phần cứng, cập nhật phần mềm và sao lưu dữ liệu định kỳ giúp hệ thống chạy ổn định, hạn chế hỏng hóc đột xuất.',
        array('Lịch bảo trì hằng tháng hoặc hằng quý', 'Vệ sinh, tra keo tản nhiệt, kiểm tra ổ cứng', 'Nạp mực, thay linh kiện máy in tận nơi', 'Lập biên bản tình trạng từng thiết bị')),
    array('thi-cong-mang-lan-wifi', 'Thi công mạng LAN, Wifi, cáp quang', 'network', 'Báo giá theo mặt bằng', 'dich-vu-13.webp',
        'Khảo sát, thiết kế và thi công hệ thống mạng cho văn phòng, nhà xưởng, khách sạn: đi dây, lắp tủ rack, cấu hình Wifi phủ sóng đều.',
        array('Khảo sát mặt bằng miễn phí', 'Đi dây âm tường, đánh số đầu dây, test từng điểm', 'Tách mạng khách và mạng nội bộ', 'Bàn giao sơ đồ mạng, bảo hành thi công')),
    array('lap-dat-camera-quan-sat', 'Lắp đặt camera quan sát trọn gói', 'camera', 'Từ 2.990.000đ/bộ', 'dich-vu-12.webp',
        'Tư vấn vị trí, cung cấp camera Hikvision, Dahua chính hãng, đi dây gọn gàng và cài đặt xem trên điện thoại cho gia đình, cửa hàng, doanh nghiệp.',
        array('Khảo sát, tư vấn vị trí lắp đặt miễn phí', 'Camera chính hãng, bảo hành đến 24 tháng', 'Cài đặt xem từ xa trên điện thoại', 'Hỗ trợ kỹ thuật sau lắp đặt')),
    array('tich-hop-he-thong-may-chu', 'Tích hợp hệ thống, máy chủ, NAS', 'server', 'Báo giá theo dự án', 'dich-vu-15.webp',
        'Triển khai máy chủ, NAS lưu trữ tập trung, phân quyền thư mục theo phòng ban và thiết lập sao lưu tự động cho doanh nghiệp.',
        array('Tư vấn cấu hình phù hợp ngân sách', 'Phân quyền dữ liệu theo phòng ban', 'Sao lưu tự động, chống mất dữ liệu', 'Giám sát, bảo trì hệ thống định kỳ')),
    array('sua-laptop-cuu-du-lieu', 'Sửa chữa laptop, cứu dữ liệu', 'monitor', 'Từ 150.000đ', 'dich-vu-9.webp',
        'Kiểm tra miễn phí, báo giá trước khi sửa: thay màn hình, bàn phím, pin, sửa mainboard; khôi phục dữ liệu ổ cứng, USB, thẻ nhớ.',
        array('Kiểm tra lỗi miễn phí', 'Linh kiện thay thế có bảo hành', 'Cứu dữ liệu – không thành công không tính phí', 'Bảo mật tuyệt đối dữ liệu khách hàng')),
);
foreach ($services as $i => $s) {
    $content = '<p>' . esc_html($s[5]) . "</p>\n<h2>Minh Long cam kết</h2>\n<ul>\n";
    foreach ($s[6] as $li) {
        $content .= '<li>' . esc_html($li) . "</li>\n";
    }
    $content .= "</ul>\n<h2>Quy trình làm việc</h2>\n<ol>\n<li>Tiếp nhận yêu cầu qua hotline, Zalo hoặc form liên hệ</li>\n<li>Khảo sát, báo giá rõ ràng trước khi triển khai</li>\n<li>Thực hiện, nghiệm thu và bàn giao</li>\n<li>Bảo hành, hỗ trợ kỹ thuật lâu dài</li>\n</ol>";
    $id = ml_upsert_post('dich-vu', $s[0], array('post_title' => $s[1], 'post_content' => $content, 'post_excerpt' => $s[5], 'menu_order' => $i));
    update_post_meta($id, '_ml_icon', $s[2]);
    update_post_meta($id, '_ml_price_from', $s[3]);
    $img = ml_import_image($s[4], $s[1]);
    if ($img) {
        set_post_thumbnail($id, $img);
    }
}
ml_log('  ' . count($services) . ' dịch vụ');

/* =====================================================================
   5. Tin tức
   ===================================================================== */
ml_log('== Tin tức');
$post_cats = array(
    'tin-tuc'    => ml_term('category', 'Tin công nghệ', 'tin-cong-nghe'),
    'ho-tro'     => ml_term('category', 'Hướng dẫn kỹ thuật', 'huong-dan-ky-thuat'),
    'khuyen-mai' => ml_term('category', 'Khuyến mãi', 'khuyen-mai'),
    'giai-phap'  => ml_term('category', 'Giải pháp', 'giai-phap'),
    'tuyen-dung' => ml_term('category', 'Tuyển dụng', 'tuyen-dung'),
);
foreach ($seed['posts'] as $p) {
    $slug = sanitize_title(remove_accents($p['title']));
    $id = ml_upsert_post('post', $slug, array(
        'post_title'    => $p['title'],
        'post_content'  => ml_blocks_html($p['body']),
        'post_excerpt'  => $p['excerpt'],
        'post_date'     => date('Y-m-d H:i:s', time() - $p['daysAgo'] * DAY_IN_SECONDS),
        'post_category' => array($post_cats[$p['type']]),
    ));
    $match = null;
    foreach ($images['posts'] as $oldslug => $file) {
        if (strpos($slug, substr($oldslug, 0, 30)) === 0 || $oldslug === $slug) {
            $match = $file;
        }
    }
    if ($match && ($img = ml_import_image($match, $p['title']))) {
        set_post_thumbnail($id, $img);
    }
}
$id = ml_upsert_post('post', 'tuyen-nhan-vien-kinh-doanh-nhan-viec-ngay', array(
    'post_title'    => 'Tuyển nhân viên kinh doanh – nhận việc ngay',
    'post_content'  => ml_blocks_html(array(
        array('h2' => 'Mô tả công việc'),
        array('ul' => array('Tư vấn giải pháp camera, mạng, dịch vụ IT cho khách hàng doanh nghiệp', 'Chăm sóc khách hàng cũ, tìm kiếm khách hàng mới', 'Phối hợp với bộ phận kỹ thuật lên báo giá')),
        array('h2' => 'Quyền lợi'),
        array('ul' => array('Lương cứng + hoa hồng theo doanh số', 'Được đào tạo kiến thức sản phẩm, kỹ năng bán hàng', 'Môi trường trẻ, cơ hội thăng tiến')),
        'Ứng viên quan tâm vui lòng gửi CV qua email hoặc liên hệ hotline.',
    )),
    'post_excerpt'  => 'Minh Long tuyển nhân viên kinh doanh mảng giải pháp camera, mạng và dịch vụ IT. Lương cứng + hoa hồng, nhận việc ngay.',
    'post_date'     => date('Y-m-d H:i:s', time() - 1 * DAY_IN_SECONDS),
    'post_category' => array($post_cats['tuyen-dung']),
));
if ($img = ml_import_image('bai-viet-9.webp', 'Tuyển dụng Minh Long')) {
    set_post_thumbnail($id, $img);
}
// Xoá bài/trang mẫu của WordPress
foreach (array('hello-world' => 'post', 'sample-page' => 'page') as $slug => $type) {
    $p = get_page_by_path($slug, OBJECT, $type);
    if ($p) {
        wp_delete_post($p->ID, true);
    }
}
wp_update_term(1, 'category', array('name' => 'Tin tức', 'slug' => 'tin-tuc'));
ml_log('  ' . (count($seed['posts']) + 1) . ' bài viết');

/* =====================================================================
   6. Form liên hệ (Contact Form 7)
   ===================================================================== */
ml_log('== Form liên hệ');
$form_id = (int) get_option('ml_cf7_form_id');
$contact_form = $form_id ? WPCF7_ContactForm::get_instance($form_id) : null;
if (!$contact_form) {
    $contact_form = WPCF7_ContactForm::get_template(array('title' => 'Yêu cầu tư vấn'));
}
$contact_form->set_title('Yêu cầu tư vấn');
$contact_form->set_properties(array(
    'form' => '<div class="ml-form-row"><p><label>Họ tên *[text* your-name autocomplete:name placeholder "Nguyễn Văn A"]</label></p><p><label>Số điện thoại *[tel* your-phone autocomplete:tel placeholder "0909 xxx xxx"]</label></p></div>
<p><label>Bạn cần hỗ trợ gì? [select your-need "Dịch vụ IT cho doanh nghiệp" "Lắp đặt camera" "Thi công mạng, Wifi" "Báo giá thiết bị" "Sửa chữa, bảo trì" "Khác"]</label></p>
<p><label>Nội dung [textarea your-message placeholder "Mô tả ngắn nhu cầu, địa chỉ khảo sát (nếu có)"]</label></p>
<p>[submit "Gửi yêu cầu tư vấn"]</p>',
    'mail' => array(
        'subject'            => '[Minh Long] Yêu cầu tư vấn từ [your-name] – [your-phone]',
        'sender'             => '[_site_title] <wordpress@[_site_domain]>',
        'body'               => "Họ tên: [your-name]\nSố điện thoại: [your-phone]\nNhu cầu: [your-need]\n\n[your-message]\n\n--\nGửi từ form trên [_site_url]",
        'recipient'          => '[_site_admin_email]',
        'additional_headers' => '',
        'attachments'        => '',
        'use_html'           => 0,
        'exclude_blank'      => 0,
    ),
    'messages' => array_merge(wpcf7_messages() ? array_map(function ($m) { return $m['default']; }, wpcf7_messages()) : array(), array(
        'mail_sent_ok'     => 'Đã gửi yêu cầu. Minh Long sẽ gọi lại cho bạn trong giờ làm việc.',
        'validation_error' => 'Vui lòng kiểm tra lại các ô được đánh dấu.',
        'invalid_required' => 'Vui lòng điền ô này.',
        'invalid_tel'      => 'Số điện thoại chưa đúng.',
        'mail_sent_ng'     => 'Chưa gửi được. Vui lòng gọi hotline để được hỗ trợ ngay.',
    )),
    // Máy local không gửi được email → chỉ lưu vào Flamingo. Lên host thật: xoá dòng này.
    'additional_settings' => "skip_mail: on
flamingo_subject: \"[your-need] – [your-name] – [your-phone]\"
flamingo_name: \"[your-name]\"",
));
$contact_form->save();
$form_id = $contact_form->id();
update_option('ml_cf7_form_id', $form_id);
set_theme_mod('ml_cf7_id', (string) $form_id);
ml_log('  form #' . $form_id);

/* =====================================================================
   7. Trang tĩnh
   ===================================================================== */
ml_log('== Trang');
$cf7 = '[contact-form-7 id="' . $form_id . '" title="Yêu cầu tư vấn"]';
$pages = array(
    'trang-chu' => array('Trang chủ', ''),
    'tin-tuc-page' => array('Tin tức', ''),
    'gioi-thieu' => array('Giới thiệu', ml_blocks_html(array(
        'Minh Long là đơn vị cung cấp dịch vụ công nghệ thông tin cho doanh nghiệp tại TP. Hồ Chí Minh: IT Helpdesk, IT Onsite (thuê ngoài), tích hợp hệ thống và thi công hạ tầng CNTT.',
        array('h2' => 'Lĩnh vực hoạt động'),
        array('ul' => array('Dịch vụ IT Helpdesk, IT Onsite cho văn phòng, nhà xưởng', 'Thi công mạng LAN, Wifi, cáp quang, tủ rack', 'Lắp đặt camera quan sát, máy chấm công, kiểm soát ra vào', 'Cung cấp thiết bị: camera, thiết bị mạng, máy tính, máy in, máy chủ, NAS', 'Bảo trì, sửa chữa máy tính, máy in định kỳ')),
        array('h2' => 'Vì sao chọn Minh Long'),
        array('ul' => array('Hỗ trợ 24/7, phản hồi nhanh', 'Kỹ thuật viên đến tận nơi trong nội thành', 'Thiết bị chính hãng, đầy đủ hoá đơn VAT', 'Khảo sát, báo giá minh bạch trước khi triển khai')),
    ))),
    'lien-he' => array('Liên hệ', "<p>Liên hệ Minh Long để được tư vấn giải pháp, báo giá thiết bị và hẹn lịch khảo sát miễn phí.</p>\n<h2>Gửi yêu cầu tư vấn</h2>\n" . $cf7),
    'bang-gia-dich-vu' => array('Bảng giá dịch vụ lắp đặt tận nơi', "<p>Bảng giá tham khảo dịch vụ lắp đặt tại TP. Hồ Chí Minh. Giá thực tế phụ thuộc mặt bằng và số lượng – vui lòng liên hệ để được khảo sát, báo giá chính xác.</p>\n<table>\n<thead><tr><th>Hạng mục</th><th>Đơn vị</th><th>Giá tham khảo</th></tr></thead>\n<tbody>\n<tr><td>Lắp đặt camera (đã gồm cấu hình xem trên điện thoại)</td><td>Mắt</td><td>200.000đ</td></tr>\n<tr><td>Thi công dây mạng / dây camera (nẹp nổi)</td><td>Mét</td><td>12.000đ</td></tr>\n<tr><td>Bấm đầu mạng, test điểm mạng</td><td>Điểm</td><td>50.000đ</td></tr>\n<tr><td>Lắp đặt, cấu hình bộ phát Wifi / Mesh</td><td>Thiết bị</td><td>150.000đ</td></tr>\n<tr><td>Cài đặt máy tính (Windows, Office, phần mềm cơ bản)</td><td>Máy</td><td>150.000đ</td></tr>\n<tr><td>Vệ sinh, bảo trì máy tính tại chỗ</td><td>Máy</td><td>120.000đ</td></tr>\n<tr><td>Nạp mực máy in laser</td><td>Hộp</td><td>Từ 80.000đ</td></tr>\n</tbody>\n</table>\n<p>Khảo sát miễn phí trong nội thành. Giá chưa gồm VAT.</p>"),
);
foreach ($seed['pages'] as $p) {
    if ($p['slug'] === 'gioi-thieu' || $p['slug'] === 'huong-dan-thanh-toan') {
        continue;
    }
    $title = $p['slug'] === 'chinh-sach-van-chuyen' ? 'Chính sách giao hàng & lắp đặt' : $p['title'];
    $pages[$p['slug']] = array($title, ml_blocks_html($p['body']));
}
$page_ids = array();
foreach ($pages as $slug => $pg) {
    $real_slug = $slug === 'tin-tuc-page' ? 'tin-tuc-va-kinh-nghiem' : $slug;
    $page_ids[$slug] = ml_upsert_post('page', $real_slug, array('post_title' => $pg[0], 'post_content' => $pg[1]));
}
update_option('show_on_front', 'page');
update_option('page_on_front', $page_ids['trang-chu']);
update_option('page_for_posts', $page_ids['tin-tuc-page']);
ml_log('  ' . count($pages) . ' trang');

/* =====================================================================
   8. Menu
   ===================================================================== */
ml_log('== Menu');
function ml_menu($name, $location)
{
    $menu = wp_get_nav_menu_object($name);
    $id = $menu ? $menu->term_id : wp_create_nav_menu($name);
    foreach (wp_get_nav_menu_items($id) ?: array() as $item) {
        wp_delete_post($item->ID, true);
    }
    $locations = get_theme_mod('nav_menu_locations', array());
    $locations[$location] = $id;
    set_theme_mod('nav_menu_locations', $locations);
    return $id;
}
function ml_menu_item($menu, $title, $args, $parent = 0)
{
    return wp_update_nav_menu_item($menu, 0, array_merge(array('menu-item-title' => $title, 'menu-item-status' => 'publish', 'menu-item-parent-id' => $parent), $args));
}
$m = ml_menu('Menu chính', 'primary');
ml_menu_item($m, 'Trang chủ', array('menu-item-type' => 'custom', 'menu-item-url' => home_url('/')));
ml_menu_item($m, 'Giới thiệu', array('menu-item-type' => 'post_type', 'menu-item-object' => 'page', 'menu-item-object-id' => $page_ids['gioi-thieu']));
$svc = ml_menu_item($m, 'Dịch vụ IT', array('menu-item-type' => 'post_type_archive', 'menu-item-object' => 'dich-vu'));
foreach (ml_get_services(10) as $s) {
    ml_menu_item($m, get_the_title($s), array('menu-item-type' => 'post_type', 'menu-item-object' => 'dich-vu', 'menu-item-object-id' => $s->ID), $svc);
}
ml_menu_item($m, 'Sản phẩm', array('menu-item-type' => 'post_type', 'menu-item-object' => 'page', 'menu-item-object-id' => wc_get_page_id('shop')));
ml_menu_item($m, 'Bảng giá', array('menu-item-type' => 'post_type', 'menu-item-object' => 'page', 'menu-item-object-id' => $page_ids['bang-gia-dich-vu']));
ml_menu_item($m, 'Tin tức', array('menu-item-type' => 'post_type', 'menu-item-object' => 'page', 'menu-item-object-id' => $page_ids['tin-tuc-page']));
ml_menu_item($m, 'Tuyển dụng', array('menu-item-type' => 'taxonomy', 'menu-item-object' => 'category', 'menu-item-object-id' => $post_cats['tuyen-dung']));
ml_menu_item($m, 'Liên hệ', array('menu-item-type' => 'post_type', 'menu-item-object' => 'page', 'menu-item-object-id' => $page_ids['lien-he']));

$f = ml_menu('Chân trang', 'footer');
foreach (array('chinh-sach-bao-hanh', 'chinh-sach-van-chuyen', 'chinh-sach-doi-tra', 'chinh-sach-bao-mat', 'bang-gia-dich-vu', 'lien-he') as $slug) {
    if (!empty($page_ids[$slug])) {
        ml_menu_item($f, get_the_title($page_ids[$slug]), array('menu-item-type' => 'post_type', 'menu-item-object' => 'page', 'menu-item-object-id' => $page_ids[$slug]));
    }
}

/* =====================================================================
   9. Tuỳ biến trang chủ: ảnh banner, ảnh giới thiệu, khối sản phẩm
   ===================================================================== */
ml_log('== Trang chủ');
set_theme_mod('ml_slide1_image', ml_import_image('dich-vu-15.webp', 'Phòng máy chủ doanh nghiệp'));
set_theme_mod('ml_slide2_image', ml_import_image('dich-vu-13.webp', 'Thi công tủ mạng'));
set_theme_mod('ml_slide3_image', ml_import_image('dich-vu-12.webp', 'Lắp đặt camera'));
set_theme_mod('ml_about_image', ml_import_image('dich-vu-10.webp', 'Kỹ thuật viên Minh Long'));
set_theme_mod('ml_home_cats', 'camera-quan-sat, thiet-bi-mang, man-hinh, may-tinh-laptop');

flush_rewrite_rules();
WP_CLI::success('Đã nhập xong nội dung mẫu cho Minh Long.');
