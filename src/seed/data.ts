/**
 * Dữ liệu mẫu cho website Minh Long.
 * Giá, thông số mang tính minh hoạ — chỉnh lại trong admin trước khi chạy thật.
 */

export type SeedCategory = {
  name: string
  slug: string
  icon: string
  description: string
  children?: { name: string; slug: string; icon: string }[]
}

export const categories: SeedCategory[] = [
  {
    name: 'Laptop',
    slug: 'laptop',
    icon: 'laptop',
    description: 'Laptop văn phòng, doanh nhân và gaming chính hãng, bảo hành tại Minh Long.',
    children: [
      { name: 'Laptop văn phòng', slug: 'laptop-van-phong', icon: 'laptop' },
      { name: 'Laptop gaming', slug: 'laptop-gaming', icon: 'gamepad-2' },
    ],
  },
  {
    name: 'Máy tính để bàn',
    slug: 'may-tinh-de-ban',
    icon: 'pc-case',
    description: 'Máy bộ đồng bộ và PC lắp ráp theo nhu cầu văn phòng, đồ hoạ.',
  },
  {
    name: 'Màn hình',
    slug: 'man-hinh',
    icon: 'monitor',
    description: 'Màn hình văn phòng, đồ hoạ, gaming từ 22 đến 34 inch.',
  },
  {
    name: 'Camera an ninh',
    slug: 'camera-an-ninh',
    icon: 'cctv',
    description: 'Camera IP, camera Wifi, đầu ghi hình cho gia đình và doanh nghiệp.',
    children: [
      { name: 'Camera IP & Wifi', slug: 'camera-ip-wifi', icon: 'cctv' },
      { name: 'Đầu ghi hình', slug: 'dau-ghi-hinh', icon: 'hard-drive' },
    ],
  },
  {
    name: 'Thiết bị mạng',
    slug: 'thiet-bi-mang',
    icon: 'router',
    description: 'Router, bộ phát Wifi Mesh, switch cho văn phòng và gia đình.',
    children: [
      { name: 'Router & Wifi', slug: 'router-wifi', icon: 'wifi' },
      { name: 'Switch', slug: 'switch', icon: 'network' },
    ],
  },
  {
    name: 'Máy in & Mực in',
    slug: 'may-in-muc-in',
    icon: 'printer',
    description: 'Máy in laser, máy in màu, mực in chính hãng và tương thích.',
  },
  {
    name: 'Máy chủ & NAS',
    slug: 'may-chu-nas',
    icon: 'server',
    description: 'Máy chủ, thiết bị lưu trữ NAS cho doanh nghiệp vừa và nhỏ.',
  },
  {
    name: 'Linh kiện & Phụ kiện',
    slug: 'linh-kien-phu-kien',
    icon: 'cpu',
    description: 'RAM, SSD, bàn phím, chuột, tai nghe và phụ kiện máy tính.',
  },
  {
    name: 'Phần mềm bản quyền',
    slug: 'phan-mem-ban-quyen',
    icon: 'key-round',
    description: 'Windows, Microsoft 365, phần mềm diệt virus bản quyền.',
  },
]

export const brands = [
  'Dell',
  'HP',
  'Lenovo',
  'ASUS',
  'Hikvision',
  'Dahua',
  'TP-Link',
  'Ruijie',
  'Synology',
  'Canon',
  'Brother',
  'Microsoft',
  'Kingston',
  'Logitech',
]

export type SeedProduct = {
  name: string
  category: string
  brand: string
  icon: string
  price?: number
  sale?: number
  sku: string
  short: string
  warranty: string
  specs: [string, string][]
  featured?: boolean
  stock?: 'in_stock' | 'out_of_stock' | 'preorder'
}

export const products: SeedProduct[] = [
  // Laptop văn phòng
  {
    name: 'Laptop Dell Latitude 3540 i5-1335U 8GB 512GB',
    category: 'laptop-van-phong',
    brand: 'Dell',
    icon: 'laptop',
    price: 17490000,
    sale: 15990000,
    sku: 'DL-LAT3540-I5',
    short: 'Laptop doanh nghiệp bền bỉ, bàn phím chống tràn, pin dùng trọn ngày làm việc.',
    warranty: '12 tháng',
    specs: [
      ['CPU', 'Intel Core i5-1335U'],
      ['RAM', '8GB DDR4 3200MHz'],
      ['Ổ cứng', 'SSD 512GB NVMe'],
      ['Màn hình', '15.6" Full HD'],
      ['Hệ điều hành', 'Windows 11 Home'],
    ],
    featured: true,
  },
  {
    name: 'Laptop HP ProBook 450 G10 i5-1340P 16GB 512GB',
    category: 'laptop-van-phong',
    brand: 'HP',
    icon: 'laptop',
    price: 21990000,
    sku: 'HP-PB450G10',
    short: 'Vỏ nhôm, bảo mật vân tay, phù hợp kế toán và nhân viên văn phòng.',
    warranty: '12 tháng',
    specs: [
      ['CPU', 'Intel Core i5-1340P'],
      ['RAM', '16GB DDR4'],
      ['Ổ cứng', 'SSD 512GB'],
      ['Màn hình', '15.6" Full HD IPS'],
    ],
  },
  {
    name: 'Laptop Lenovo ThinkPad E14 Gen 5 Ryzen 5 7530U',
    category: 'laptop-van-phong',
    brand: 'Lenovo',
    icon: 'laptop',
    price: 18990000,
    sale: 17490000,
    sku: 'LN-TPE14G5',
    short: 'Bàn phím ThinkPad gõ êm, nhẹ 1,4kg, nhiều cổng kết nối.',
    warranty: '12 tháng',
    specs: [
      ['CPU', 'AMD Ryzen 5 7530U'],
      ['RAM', '16GB DDR4'],
      ['Ổ cứng', 'SSD 512GB'],
      ['Màn hình', '14" WUXGA'],
    ],
    featured: true,
  },
  {
    name: 'Laptop ASUS Vivobook 15 OLED i5-13500H',
    category: 'laptop-van-phong',
    brand: 'ASUS',
    icon: 'laptop',
    price: 16990000,
    sku: 'AS-VB15OLED',
    short: 'Màn hình OLED màu chuẩn, mỏng nhẹ cho sinh viên và dân văn phòng.',
    warranty: '24 tháng',
    specs: [
      ['CPU', 'Intel Core i5-13500H'],
      ['RAM', '16GB'],
      ['Ổ cứng', 'SSD 512GB'],
      ['Màn hình', '15.6" OLED Full HD'],
    ],
  },
  // Laptop gaming
  {
    name: 'Laptop ASUS TUF Gaming F15 i7-13620H RTX 4060',
    category: 'laptop-gaming',
    brand: 'ASUS',
    icon: 'gamepad-2',
    price: 32990000,
    sale: 28990000,
    sku: 'AS-TUFF15-4060',
    short: 'Card RTX 4060, màn 144Hz, tản nhiệt kép — chơi game và dựng video mượt.',
    warranty: '24 tháng',
    specs: [
      ['CPU', 'Intel Core i7-13620H'],
      ['VGA', 'NVIDIA RTX 4060 8GB'],
      ['RAM', '16GB DDR5'],
      ['Màn hình', '15.6" FHD 144Hz'],
    ],
    featured: true,
  },
  {
    name: 'Laptop Lenovo LOQ 15IAX9 i5-12450HX RTX 3050',
    category: 'laptop-gaming',
    brand: 'Lenovo',
    icon: 'gamepad-2',
    price: 21490000,
    sku: 'LN-LOQ15',
    short: 'Laptop gaming giá dễ tiếp cận, nâng cấp RAM/SSD thuận tiện.',
    warranty: '24 tháng',
    specs: [
      ['CPU', 'Intel Core i5-12450HX'],
      ['VGA', 'RTX 3050 6GB'],
      ['RAM', '12GB DDR5'],
      ['Màn hình', '15.6" FHD 144Hz'],
    ],
  },
  // Máy tính để bàn
  {
    name: 'Máy bộ Dell OptiPlex 7010 SFF i5-13500',
    category: 'may-tinh-de-ban',
    brand: 'Dell',
    icon: 'pc-case',
    price: 16490000,
    sku: 'DL-OPT7010',
    short: 'Thùng máy nhỏ gọn, chạy êm, lý tưởng cho quầy giao dịch và văn phòng.',
    warranty: '36 tháng',
    specs: [
      ['CPU', 'Intel Core i5-13500'],
      ['RAM', '8GB DDR4'],
      ['Ổ cứng', 'SSD 256GB'],
      ['Kiểu dáng', 'Small Form Factor'],
    ],
    featured: true,
  },
  {
    name: 'PC Minh Long Office i3-12100 / 8GB / SSD 256GB',
    category: 'may-tinh-de-ban',
    brand: 'Kingston',
    icon: 'pc-case',
    price: 8290000,
    sale: 7690000,
    sku: 'ML-PC-OFFICE',
    short: 'Cấu hình lắp sẵn cho văn phòng: Word, Excel, phần mềm kế toán chạy nhanh.',
    warranty: '36 tháng',
    specs: [
      ['CPU', 'Intel Core i3-12100'],
      ['RAM', '8GB DDR4 Kingston'],
      ['Ổ cứng', 'SSD 256GB'],
      ['Nguồn', '450W'],
    ],
  },
  // Màn hình
  {
    name: 'Màn hình Dell P2423H 24" IPS Full HD',
    category: 'man-hinh',
    brand: 'Dell',
    icon: 'monitor',
    price: 4790000,
    sale: 4290000,
    sku: 'DL-P2423H',
    short: 'Chân đế xoay dọc, chống chói, phù hợp làm việc nhiều giờ liền.',
    warranty: '36 tháng',
    specs: [
      ['Kích thước', '23.8 inch'],
      ['Tấm nền', 'IPS'],
      ['Độ phân giải', '1920 × 1080'],
      ['Cổng', 'HDMI, DisplayPort, VGA, USB'],
    ],
    featured: true,
  },
  {
    name: 'Màn hình HP M27f 27" IPS 75Hz',
    category: 'man-hinh',
    brand: 'HP',
    icon: 'monitor',
    price: 4390000,
    sku: 'HP-M27F',
    short: 'Viền mỏng ba cạnh, thiết kế mỏng 6,5mm.',
    warranty: '36 tháng',
    specs: [
      ['Kích thước', '27 inch'],
      ['Tấm nền', 'IPS'],
      ['Tần số quét', '75Hz'],
    ],
  },
  {
    name: 'Màn hình ASUS ProArt PA279CV 27" 4K',
    category: 'man-hinh',
    brand: 'ASUS',
    icon: 'monitor',
    sku: 'AS-PA279CV',
    short: 'Màn hình đồ hoạ 4K, 100% sRGB, hiệu chuẩn màu sẵn từ nhà máy.',
    warranty: '36 tháng',
    specs: [
      ['Kích thước', '27 inch'],
      ['Độ phân giải', '3840 × 2160'],
      ['Màu', '100% sRGB, ΔE < 2'],
    ],
  },
  // Camera
  {
    name: 'Camera IP Hikvision DS-2CD1043G2-LIU 4MP',
    category: 'camera-ip-wifi',
    brand: 'Hikvision',
    icon: 'cctv',
    price: 1590000,
    sale: 1290000,
    sku: 'HK-2CD1043G2',
    short: 'Camera thân trụ 4MP, có mic, đèn hồng ngoại và đèn trợ sáng có màu ban đêm.',
    warranty: '24 tháng',
    specs: [
      ['Độ phân giải', '4MP'],
      ['Tầm nhìn đêm', '30m'],
      ['Chuẩn', 'IP67, PoE'],
    ],
    featured: true,
  },
  {
    name: 'Camera Wifi Dahua Hero C1 2MP xoay 360°',
    category: 'camera-ip-wifi',
    brand: 'Dahua',
    icon: 'cctv',
    price: 690000,
    sku: 'DH-HEROC1',
    short: 'Camera trong nhà, đàm thoại hai chiều, xem qua điện thoại.',
    warranty: '24 tháng',
    specs: [
      ['Độ phân giải', '2MP Full HD'],
      ['Góc quay', '355° ngang, 90° dọc'],
      ['Lưu trữ', 'Thẻ nhớ tối đa 256GB'],
    ],
  },
  {
    name: 'Camera IP Dahua IPC-HFW1430DT1-STW 4MP Wifi',
    category: 'camera-ip-wifi',
    brand: 'Dahua',
    icon: 'cctv',
    price: 1450000,
    sku: 'DH-HFW1430',
    short: 'Camera ngoài trời kết nối Wifi, chống nước, phát hiện người.',
    warranty: '24 tháng',
    specs: [
      ['Độ phân giải', '4MP'],
      ['Kết nối', 'Wifi / LAN'],
      ['Chuẩn', 'IP67'],
    ],
    stock: 'preorder',
  },
  {
    name: 'Đầu ghi hình Hikvision DS-7608NXI-K1 8 kênh',
    category: 'dau-ghi-hinh',
    brand: 'Hikvision',
    icon: 'hard-drive',
    price: 3290000,
    sku: 'HK-7608NXI',
    short: 'Đầu ghi IP 8 kênh, hỗ trợ AcuSense lọc báo động giả.',
    warranty: '24 tháng',
    specs: [
      ['Số kênh', '8 kênh IP'],
      ['Ổ cứng', '1 SATA, tối đa 10TB'],
      ['Ngõ ra', 'HDMI 4K, VGA'],
    ],
  },
  // Mạng
  {
    name: 'Bộ phát Wifi Mesh TP-Link Deco X50 (3 pack)',
    category: 'router-wifi',
    brand: 'TP-Link',
    icon: 'wifi',
    price: 6490000,
    sale: 5790000,
    sku: 'TP-DECOX50-3',
    short: 'Wifi 6 phủ sóng nhà 3–4 tầng, một tên Wifi duy nhất, chuyển vùng liền mạch.',
    warranty: '24 tháng',
    specs: [
      ['Chuẩn', 'Wifi 6 AX3000'],
      ['Phủ sóng', '~600 m²'],
      ['Số thiết bị', '150+'],
    ],
    featured: true,
  },
  {
    name: 'Router Wifi Ruijie Reyee RG-EW1800GX PRO',
    category: 'router-wifi',
    brand: 'Ruijie',
    icon: 'router',
    price: 1290000,
    sku: 'RJ-EW1800GX',
    short: 'Router Wifi 6 quản lý qua app, phù hợp quán cà phê, văn phòng nhỏ.',
    warranty: '36 tháng',
    specs: [
      ['Chuẩn', 'Wifi 6 AX1800'],
      ['Cổng', '4 × Gigabit'],
    ],
  },
  {
    name: 'Switch TP-Link TL-SG1016D 16 cổng Gigabit',
    category: 'switch',
    brand: 'TP-Link',
    icon: 'network',
    price: 1590000,
    sku: 'TP-SG1016D',
    short: 'Switch không quản lý, vỏ kim loại, gắn tủ rack 19".',
    warranty: '24 tháng',
    specs: [
      ['Số cổng', '16 × Gigabit'],
      ['Băng thông', '32 Gbps'],
    ],
  },
  {
    name: 'Switch PoE Ruijie RG-ES110GDS-P 10 cổng',
    category: 'switch',
    brand: 'Ruijie',
    icon: 'network',
    price: 2190000,
    sale: 1890000,
    sku: 'RJ-ES110GDS',
    short: 'Cấp nguồn PoE cho camera và bộ phát Wifi, đỡ phải kéo dây điện.',
    warranty: '36 tháng',
    specs: [
      ['Số cổng', '8 PoE + 2 Uplink'],
      ['Công suất PoE', '110W'],
    ],
  },
  // Máy in
  {
    name: 'Máy in laser Canon LBP 2900',
    category: 'may-in-muc-in',
    brand: 'Canon',
    icon: 'printer',
    price: 3690000,
    sku: 'CN-LBP2900',
    short: 'Máy in đen trắng quen thuộc của văn phòng, bền, mực rẻ.',
    warranty: '12 tháng',
    specs: [
      ['Loại', 'Laser trắng đen'],
      ['Tốc độ', '12 trang/phút'],
      ['Khổ giấy', 'A4'],
    ],
    featured: true,
  },
  {
    name: 'Máy in Brother HL-L2366DW in 2 mặt, Wifi',
    category: 'may-in-muc-in',
    brand: 'Brother',
    icon: 'printer',
    price: 4290000,
    sale: 3890000,
    sku: 'BR-L2366DW',
    short: 'In hai mặt tự động, in từ điện thoại qua Wifi.',
    warranty: '24 tháng',
    specs: [
      ['Loại', 'Laser trắng đen'],
      ['Tốc độ', '30 trang/phút'],
      ['Kết nối', 'USB, Wifi'],
    ],
  },
  {
    name: 'Hộp mực Canon 303 (dùng cho LBP 2900)',
    category: 'may-in-muc-in',
    brand: 'Canon',
    icon: 'printer',
    price: 1450000,
    sku: 'CN-CART303',
    short: 'Mực chính hãng, in khoảng 2.000 trang.',
    warranty: 'Đổi mới nếu lỗi',
    specs: [['Số trang', '~2.000 trang (5% phủ)']],
  },
  // Máy chủ & NAS
  {
    name: 'NAS Synology DS224+ 2 khay',
    category: 'may-chu-nas',
    brand: 'Synology',
    icon: 'database',
    price: 9990000,
    sku: 'SY-DS224P',
    short: 'Lưu trữ tập trung, sao lưu máy tính và điện thoại tự động cho văn phòng.',
    warranty: '24 tháng',
    specs: [
      ['Số khay', '2 × 3.5"'],
      ['CPU', 'Intel Celeron J4125'],
      ['RAM', '2GB (tối đa 6GB)'],
    ],
    featured: true,
  },
  {
    name: 'Máy chủ Dell PowerEdge T150 Xeon E-2314',
    category: 'may-chu-nas',
    brand: 'Dell',
    icon: 'server',
    sku: 'DL-T150',
    short: 'Máy chủ dạng tháp cho phần mềm kế toán, file server, quản lý bán hàng.',
    warranty: '36 tháng',
    specs: [
      ['CPU', 'Intel Xeon E-2314'],
      ['RAM', '16GB ECC'],
      ['Ổ cứng', '2 × 1TB'],
    ],
  },
  // Linh kiện
  {
    name: 'RAM Kingston Fury Beast 16GB DDR4 3200MHz',
    category: 'linh-kien-phu-kien',
    brand: 'Kingston',
    icon: 'memory-stick',
    price: 1090000,
    sale: 950000,
    sku: 'KS-FURY16',
    short: 'Nâng cấp RAM cho máy chạy nhiều tab, phần mềm nặng.',
    warranty: '36 tháng',
    specs: [
      ['Dung lượng', '16GB'],
      ['Bus', '3200MHz'],
    ],
  },
  {
    name: 'SSD Kingston NV2 500GB NVMe PCIe 4.0',
    category: 'linh-kien-phu-kien',
    brand: 'Kingston',
    icon: 'hard-drive',
    price: 990000,
    sku: 'KS-NV2-500',
    short: 'Thay SSD giúp máy cũ khởi động dưới 15 giây.',
    warranty: '36 tháng',
    specs: [
      ['Dung lượng', '500GB'],
      ['Tốc độ đọc', '3.500 MB/s'],
    ],
  },
  {
    name: 'Bộ bàn phím chuột không dây Logitech MK295',
    category: 'linh-kien-phu-kien',
    brand: 'Logitech',
    icon: 'keyboard',
    price: 499000,
    sku: 'LG-MK295',
    short: 'Phím gõ êm giảm 90% tiếng ồn, pin dùng đến 3 năm.',
    warranty: '12 tháng',
    specs: [['Kết nối', 'USB Receiver 2.4GHz']],
  },
  {
    name: 'Tai nghe Logitech H390 USB',
    category: 'linh-kien-phu-kien',
    brand: 'Logitech',
    icon: 'headset',
    price: 690000,
    sku: 'LG-H390',
    short: 'Tai nghe họp online, mic khử ồn, đệm tai êm.',
    warranty: '24 tháng',
    specs: [['Kết nối', 'USB-A']],
    stock: 'out_of_stock',
  },
  // Phần mềm
  {
    name: 'Windows 11 Pro bản quyền (FPP)',
    category: 'phan-mem-ban-quyen',
    brand: 'Microsoft',
    icon: 'key-round',
    price: 5490000,
    sale: 4990000,
    sku: 'MS-WIN11PRO',
    short: 'Bản quyền vĩnh viễn, chuyển được sang máy khác. Hỗ trợ cài đặt miễn phí.',
    warranty: 'Vĩnh viễn',
    specs: [
      ['Phiên bản', 'Windows 11 Pro'],
      ['Hình thức', 'Hộp FPP / USB'],
    ],
  },
  {
    name: 'Microsoft 365 Business Standard (1 năm)',
    category: 'phan-mem-ban-quyen',
    brand: 'Microsoft',
    icon: 'cloud',
    price: 3300000,
    sku: 'MS-365BS',
    short: 'Word, Excel, Outlook, Teams cùng 1TB OneDrive cho mỗi người dùng.',
    warranty: '12 tháng',
    specs: [
      ['Số thiết bị', '5 PC/Mac + 5 tablet + 5 điện thoại'],
      ['Lưu trữ', '1TB OneDrive'],
    ],
  },
]

export const services = [
  {
    title: 'Sửa laptop, thay màn hình, bàn phím, pin',
    icon: 'laptop',
    lucide: 'laptop',
    priceFrom: 'Từ 150.000đ',
    summary:
      'Kiểm tra miễn phí, báo giá trước khi sửa. Linh kiện thay thế có bảo hành, phần lớn lỗi xử lý trong ngày.',
    highlights: [
      'Kiểm tra lỗi miễn phí',
      'Sửa lấy liền với lỗi phổ biến',
      'Bảo hành linh kiện 3–12 tháng',
    ],
  },
  {
    title: 'Bảo trì máy tính định kỳ cho doanh nghiệp',
    icon: 'wrench',
    lucide: 'wrench',
    priceFrom: 'Từ 1.500.000đ/tháng',
    summary:
      'Kỹ thuật viên đến tận văn phòng vệ sinh máy, cập nhật phần mềm, sao lưu dữ liệu và xử lý sự cố phát sinh.',
    highlights: [
      'Hợp đồng theo tháng hoặc năm',
      'Hỗ trợ từ xa trong giờ làm việc',
      'Báo cáo tình trạng thiết bị',
    ],
  },
  {
    title: 'Cứu dữ liệu ổ cứng, USB, thẻ nhớ',
    icon: 'hard-drive',
    lucide: 'hard-drive',
    priceFrom: 'Báo giá sau kiểm tra',
    summary:
      'Khôi phục dữ liệu do xoá nhầm, format, ổ cứng hỏng cơ. Cam kết bảo mật, không lấy được dữ liệu không tính phí.',
    highlights: ['Bảo mật dữ liệu khách hàng', 'Không thành công không tính phí'],
  },
  {
    title: 'Lắp đặt camera an ninh trọn gói',
    icon: 'camera',
    lucide: 'cctv',
    priceFrom: 'Từ 2.990.000đ/bộ',
    summary:
      'Khảo sát miễn phí, tư vấn vị trí lắp đặt, đi dây gọn gàng và hướng dẫn xem camera trên điện thoại.',
    highlights: [
      'Khảo sát tận nơi miễn phí',
      'Đi dây âm tường, nẹp gọn',
      'Bảo hành thiết bị đến 24 tháng',
    ],
  },
  {
    title: 'Thi công mạng LAN, Wifi văn phòng',
    icon: 'wifi',
    lucide: 'wifi',
    priceFrom: 'Báo giá theo mặt bằng',
    summary:
      'Thiết kế hệ thống mạng, đi dây, lắp tủ rack, cấu hình Wifi phủ sóng đều cho văn phòng, nhà hàng, khách sạn.',
    highlights: ['Đo kiểm sóng Wifi sau thi công', 'Tách mạng khách và mạng nội bộ'],
  },
  {
    title: 'Sửa máy in, nạp mực tận nơi',
    icon: 'printer',
    lucide: 'printer',
    priceFrom: 'Từ 80.000đ',
    summary:
      'Xử lý kẹt giấy, in mờ, lỗi driver. Nạp mực và thay linh kiện máy in laser, máy photocopy.',
    highlights: ['Có mặt trong 2 giờ nội thành', 'Mực in chất lượng cao'],
  },
  {
    title: 'Cài đặt máy chủ, NAS, sao lưu dữ liệu',
    icon: 'server',
    lucide: 'server',
    priceFrom: 'Báo giá theo dự án',
    summary:
      'Triển khai file server, NAS, phân quyền thư mục theo phòng ban và thiết lập sao lưu tự động lên đám mây.',
    highlights: ['Phân quyền theo phòng ban', 'Sao lưu tự động hằng ngày'],
  },
  {
    title: 'Cài Windows, phần mềm, diệt virus',
    icon: 'code',
    lucide: 'shield-check',
    priceFrom: 'Từ 100.000đ',
    summary:
      'Cài đặt hệ điều hành, phần mềm văn phòng, kế toán; diệt virus và tối ưu máy chạy chậm.',
    highlights: ['Giữ nguyên dữ liệu khi cài lại', 'Hỗ trợ cài đặt từ xa'],
  },
]

type SeedPost = {
  title: string
  type: 'tin-tuc' | 'ho-tro' | 'khuyen-mai' | 'giai-phap' | 'tuyen-dung'
  icon: string
  excerpt: string
  body: (string | { h2: string } | { ul: string[] })[]
  daysAgo: number
  featured?: boolean
}

export const posts: SeedPost[] = [
  {
    title: 'Ưu đãi mùa tựu trường: giảm đến 15% laptop văn phòng',
    type: 'khuyen-mai',
    icon: 'badge-percent',
    excerpt:
      'Áp dụng cho học sinh, sinh viên và giáo viên khi mua laptop tại cửa hàng hoặc đặt online.',
    body: [
      'Từ nay đến hết tháng, Minh Long giảm giá đến 15% cho các dòng laptop văn phòng và tặng kèm balo, chuột không dây.',
      { h2: 'Điều kiện áp dụng' },
      {
        ul: [
          'Xuất trình thẻ học sinh, sinh viên hoặc giáo viên',
          'Áp dụng cả khi đặt hàng online',
          'Không cộng dồn với chương trình khác',
        ],
      },
      'Liên hệ hotline để được tư vấn cấu hình phù hợp với ngành học.',
    ],
    daysAgo: 2,
    featured: true,
  },
  {
    title: 'Lắp camera trọn gói cho gia đình — tặng thẻ nhớ 64GB',
    type: 'khuyen-mai',
    icon: 'cctv',
    excerpt: 'Mỗi bộ camera lắp đặt trọn gói được tặng thẻ nhớ và miễn phí công khảo sát.',
    body: [
      'Chương trình áp dụng cho các gói lắp đặt từ 2 camera trở lên trong khu vực nội thành.',
      {
        ul: [
          'Tặng thẻ nhớ 64GB cho mỗi camera',
          'Miễn phí khảo sát và tư vấn',
          'Bảo hành 24 tháng',
        ],
      },
    ],
    daysAgo: 6,
  },
  {
    title: 'Cách khắc phục lỗi máy in báo "Printer Offline" trên Windows 11',
    type: 'ho-tro',
    icon: 'printer',
    excerpt:
      'Năm bước kiểm tra nhanh trước khi gọi kỹ thuật, áp dụng cho máy in USB lẫn máy in mạng.',
    body: [
      'Lỗi Printer Offline thường do máy in đổi địa chỉ IP, dịch vụ in bị dừng hoặc driver lỗi.',
      { h2: '1. Kiểm tra kết nối' },
      'Đảm bảo máy in đã bật, cáp USB hoặc mạng cắm chắc chắn. Với máy in Wifi, in thử trang cấu hình để xem địa chỉ IP hiện tại.',
      { h2: '2. Khởi động lại dịch vụ Print Spooler' },
      'Nhấn Windows + R, gõ services.msc, tìm Print Spooler, chuột phải chọn Restart.',
      { h2: '3. Tắt chế độ "Use Printer Offline"' },
      'Vào Settings > Bluetooth & devices > Printers & scanners, chọn máy in, mở hàng đợi và bỏ chọn Use Printer Offline.',
      'Nếu vẫn chưa được, hãy gọi Minh Long để được hỗ trợ từ xa miễn phí.',
    ],
    daysAgo: 4,
  },
  {
    title: 'Máy tính chạy chậm: 6 việc nên làm trước khi nâng cấp',
    type: 'ho-tro',
    icon: 'cpu',
    excerpt:
      'Dọn khởi động, kiểm tra ổ cứng, quét virus… nhiều trường hợp không cần tốn tiền nâng cấp.',
    body: [
      'Trước khi mua thêm RAM hay thay máy mới, hãy thử các bước sau:',
      {
        ul: [
          'Tắt bớt ứng dụng khởi động cùng Windows',
          'Kiểm tra dung lượng ổ C còn trống trên 20%',
          'Quét virus bằng Windows Security',
          'Kiểm tra sức khoẻ ổ cứng',
          'Cập nhật driver và Windows',
          'Vệ sinh quạt tản nhiệt',
        ],
      },
      'Nếu máy vẫn dùng ổ cứng HDD, thay SSD là nâng cấp đáng tiền nhất.',
    ],
    daysAgo: 9,
  },
  {
    title: 'Hướng dẫn xem camera Hikvision trên điện thoại bằng Hik-Connect',
    type: 'ho-tro',
    icon: 'smartphone',
    excerpt: 'Thêm thiết bị bằng mã QR, chia sẻ quyền xem cho người thân chỉ trong vài phút.',
    body: [
      'Tải ứng dụng Hik-Connect trên App Store hoặc Google Play, đăng ký tài khoản bằng số điện thoại.',
      { h2: 'Thêm thiết bị' },
      'Bấm dấu + ở góc phải, quét mã QR dán trên đầu ghi hoặc camera, nhập mã xác minh in trên tem.',
      { h2: 'Chia sẻ cho người thân' },
      'Vào thiết bị > Chia sẻ, nhập tài khoản người nhận và chọn quyền xem.',
    ],
    daysAgo: 15,
  },
  {
    title: 'Wifi 7 có gì mới và có nên nâng cấp ngay?',
    type: 'tin-tuc',
    icon: 'wifi',
    excerpt: 'Tốc độ cao hơn, độ trễ thấp hơn, nhưng thiết bị hỗ trợ vẫn còn ít.',
    body: [
      'Wifi 7 (802.11be) hỗ trợ băng thông kênh 320MHz và kết nối đa liên kết (MLO), giúp tốc độ lý thuyết tăng gấp nhiều lần Wifi 6.',
      'Với gia đình và văn phòng nhỏ, Wifi 6 vẫn đáp ứng tốt. Nên cân nhắc Wifi 7 khi xây mới hệ thống hoặc có nhiều thiết bị hỗ trợ.',
    ],
    daysAgo: 3,
    featured: true,
  },
  {
    title: 'Windows 10 đã hết hỗ trợ: doanh nghiệp cần làm gì?',
    type: 'tin-tuc',
    icon: 'shield-check',
    excerpt: 'Máy không còn nhận bản vá bảo mật. Lộ trình nâng cấp Windows 11 cho văn phòng.',
    body: [
      'Microsoft đã ngừng cập nhật bảo mật miễn phí cho Windows 10. Máy tính tiếp tục dùng sẽ dễ bị tấn công hơn.',
      { h2: 'Lộ trình đề xuất' },
      {
        ul: [
          'Kiểm kê máy đủ điều kiện lên Windows 11',
          'Sao lưu dữ liệu trước khi nâng cấp',
          'Thay thế máy quá cũ theo từng đợt',
        ],
      },
    ],
    daysAgo: 12,
  },
  {
    title: 'Giải pháp lưu trữ tập trung bằng NAS cho văn phòng 10–50 người',
    type: 'giai-phap',
    icon: 'database',
    excerpt:
      'Một thiết bị thay cho ổ cứng di động rời rạc: chia sẻ file, phân quyền, sao lưu tự động.',
    body: [
      'Dữ liệu nằm rải rác trên từng máy dễ thất lạc và khó kiểm soát. NAS giúp gom về một nơi, phân quyền theo phòng ban.',
      {
        ul: [
          'Chia sẻ thư mục theo phòng ban',
          'Sao lưu máy tính nhân viên hằng ngày',
          'Đồng bộ lên đám mây chống mất dữ liệu',
        ],
      },
    ],
    daysAgo: 20,
  },
  {
    title: 'Tuyển kỹ thuật viên phần cứng — làm việc tại TP.HCM',
    type: 'tuyen-dung',
    icon: 'wrench',
    excerpt:
      'Sửa chữa laptop, lắp đặt camera, hỗ trợ khách hàng doanh nghiệp. Thu nhập theo năng lực.',
    body: [
      { h2: 'Mô tả công việc' },
      {
        ul: [
          'Chẩn đoán và sửa chữa laptop, PC',
          'Lắp đặt camera, mạng tại công trình',
          'Hỗ trợ khách hàng qua điện thoại',
        ],
      },
      { h2: 'Yêu cầu' },
      { ul: ['Có kinh nghiệm phần cứng là lợi thế', 'Có xe máy, chịu khó học hỏi'] },
      'Gửi CV qua email hoặc liên hệ trực tiếp hotline.',
    ],
    daysAgo: 7,
  },
]

export const pages = [
  {
    title: 'Giới thiệu',
    slug: 'gioi-thieu',
    isPolicy: false,
    body: [
      'Minh Long cung cấp thiết bị công nghệ và dịch vụ kỹ thuật cho gia đình, cửa hàng và doanh nghiệp.',
      { h2: 'Chúng tôi làm gì' },
      {
        ul: [
          'Phân phối laptop, máy tính, camera, thiết bị mạng chính hãng',
          'Sửa chữa, bảo trì máy tính và máy in',
          'Thi công hệ thống camera, mạng LAN, Wifi',
        ],
      },
      { h2: 'Cam kết' },
      'Báo giá rõ ràng trước khi làm, sản phẩm chính hãng có hoá đơn, hỗ trợ kỹ thuật sau bán hàng.',
    ],
  },
  {
    title: 'Chính sách bảo hành',
    slug: 'chinh-sach-bao-hanh',
    isPolicy: true,
    body: [
      'Sản phẩm được bảo hành theo thời gian ghi trên phiếu bảo hành hoặc tem của nhà sản xuất.',
      { h2: 'Điều kiện bảo hành' },
      {
        ul: [
          'Còn thời hạn bảo hành, tem không rách',
          'Lỗi do nhà sản xuất',
          'Không bị va đập, vào nước, cháy nổ',
        ],
      },
      'Khách mang sản phẩm đến cửa hàng hoặc liên hệ hotline để được nhận tận nơi.',
    ],
  },
  {
    title: 'Chính sách vận chuyển',
    slug: 'chinh-sach-van-chuyen',
    isPolicy: true,
    body: [
      'Giao hàng miễn phí nội thành với đơn từ 1.000.000đ. Đơn ngoại tỉnh gửi qua đơn vị vận chuyển, phí theo bảng giá của hãng vận chuyển.',
      'Thời gian giao dự kiến: nội thành trong ngày, ngoại tỉnh 2–4 ngày làm việc.',
    ],
  },
  {
    title: 'Chính sách đổi trả',
    slug: 'chinh-sach-doi-tra',
    isPolicy: true,
    body: [
      'Đổi mới trong 7 ngày nếu sản phẩm lỗi do nhà sản xuất, còn đủ hộp và phụ kiện.',
      'Không áp dụng đổi trả với phần mềm đã kích hoạt và sản phẩm đặt hàng theo yêu cầu.',
    ],
  },
  {
    title: 'Hướng dẫn thanh toán',
    slug: 'huong-dan-thanh-toan',
    isPolicy: true,
    body: [
      {
        ul: [
          'Tiền mặt khi nhận hàng (COD)',
          'Chuyển khoản ngân hàng',
          'Thanh toán online qua VNPAY (thẻ ATM, Visa, QR)',
        ],
      },
      'Doanh nghiệp cần hoá đơn VAT vui lòng ghi thông tin xuất hoá đơn khi đặt hàng.',
    ],
  },
  {
    title: 'Chính sách bảo mật',
    slug: 'chinh-sach-bao-mat',
    isPolicy: true,
    body: [
      'Thông tin khách hàng chỉ dùng để xử lý đơn hàng, giao hàng và chăm sóc sau bán. Chúng tôi không chia sẻ cho bên thứ ba ngoài đơn vị vận chuyển.',
    ],
  },
]
