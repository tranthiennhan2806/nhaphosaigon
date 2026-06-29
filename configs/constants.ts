import { Property } from '@/types';

export const TARGET_DISTRICTS: string[] = [
    "Quận 1",
    "Quận 3",
    "Phú Nhuận",
    "Quận 7",
    "Nhà Bè"
];

// Constants cho các trường mới
export const HOUSE_TYPES = [
    { value: 'nha_cap_4', label: 'Nhà cấp 4' },
    { value: 'dat', label: 'Đất' },
    { value: 'nha_mat_tien', label: 'Nhà mặt tiền' },
    { value: 'nha_hem', label: 'Nhà hẻm' },
    { value: 'biet_thu', label: 'Biệt thự' },
    { value: 'chung_cu', label: 'Chung cư' },
    { value: 'nha_pho', label: 'Nhà phố' },
    { value: 'khac', label: 'Khác' }
];

export const ALLEY_TYPES = [
    { value: '1_xe_may', label: '1 xe máy' },
    { value: '2_xe_may', label: '2 xe máy' },
    { value: '1_xe_hoi', label: '1 xe hơi' },
    { value: '2_xe_hoi', label: '2 xe hơi' },
    { value: '1_xe_tai', label: '1 xe tải' },
    { value: '2_xe_tai', label: '2 xe tải' },
    { value: 'khac', label: 'Khác' }
];

export const FENG_SHUI_ISSUES = [
    { value: 'top_hau', label: 'Tóp hậu' },
    { value: 'duong_dam', label: 'Đường đâm' },
    { value: 'nga_ba', label: 'Ngã ba' },
    { value: 'nga_tu', label: 'Ngã tư' },
    { value: 'duong_cut', label: 'Đường cụt' },
    { value: 'gom_chan', label: 'Gồm chân' },
    { value: 'khac', label: 'Khác' },
    { value: 'khong', label: 'Không có' }
];

export const NEIGHBOR_TYPES = [
    { value: 'an_ninh', label: 'An ninh' },
    { value: 'yen_tinh', label: 'Yên tĩnh' },
    { value: 'dong_bo', label: 'Đồng bộ' },
    { value: 'nao_nhiet', label: 'Náo nhiệt' },
    { value: 'van_minh', label: 'Văn minh' },
    { value: 'khac', label: 'Khác' }
];

export const ALLEY_END_TYPES = [
    { value: 'cut', label: 'Hẻm cụt' },
    { value: 'thong', label: 'Hẻm thông' },
    { value: 'khong_xac_dinh', label: 'Không xác định' }
];

export const DIRECTIONS = [
    { value: 'dong', label: 'Đông' },
    { value: 'tay', label: 'Tây' },
    { value: 'nam', label: 'Nam' },
    { value: 'bac', label: 'Bắc' },
    { value: 'tay_bac', label: 'Tây Bắc' },
    { value: 'tay_nam', label: 'Tây Nam' },
    { value: 'dong_bac', label: 'Đông Bắc' },
    { value: 'dong_nam', label: 'Đông Nam' },
    { value: 'khong_xac_dinh', label: 'Không xác định' }
];

// Trạng thái bán
export const SALE_STATUSES = [
    { value: 'dang_ban', label: 'Đang bán' },
    { value: 'da_ban', label: 'Đã bán' }
];

export const MOCK_PROPERTIES: Property[] = [
    {
        id: "prop-1",
        title: "Căn hộ Vinhomes Golden River Bason Quận 1 Tầng Cao",
        description: "Căn hộ ban công Đông Nam mát mẻ view sông Sài Gòn trực diện và cầu Thủ Thiêm. Nội thất bàn giao cao cấp chuẩn Châu Âu từ chủ đầu tư. Vị trí kim cương ngay trung tâm Quận 1 di chuyển thuận tiện.",
        price: 8500000000,
        area: 72,
        address: "Số 2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1",
        district: "Quận 1",
        type: "sale",
        bedrooms: 2,
        bathrooms: 2,
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
        ],
        contactPhone: "0901234567",
        contactName: "Nguyễn Văn Anh",

        // Các trường cũ
        hasPlanningIssue: false,
        hasRoadWidthIssue: false,
        houseType: 'chung_cu',
        googleMapCoordinates: "10.7892,106.7041",
        alleyDepth: 0,
        alleyType: 'khac',
        width: 0,
        length: 0,
        hasConstructionApproval: true,
        hasFullConstructionApproval: true,
        floors: 30,
        hasCashFlow: true,
        hasFengShuiIssue: false,
        fengShuiIssue: 'khong',
        isHardToAccess: false,
        neighborType: 'an_ninh',
        alleyEndType: 'khong_xac_dinh',

        // Các trường bổ sung mới
        saleStatus: 'dang_ban',
        floorNumber: 15,
        direction: 'dong_nam',
        isInExistingResidentialArea: true,
        sensitiveImages: [
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80"
        ],
        hasBuildingPermit: true,
        notes: "Căn hộ góc, view sông đẹp, gần trường học và bệnh viện",
        projectName: "Vinhomes Golden River"
    },
    {
        id: "prop-2",
        title: "Nhà phố cổ điển mặt tiền đường Cao Thắng Quận 3",
        description: "Vị trí đắc địa thích hợp mở văn phòng công ty, spa hoặc showroom trưng bày sản phẩm cao cấp. Sổ hồng hoàn công đầy đủ, giao dịch an toàn.",
        price: 42000000000,
        area: 120,
        address: "Đường Cao Thắng, Phường 3, Quận 3",
        district: "Quận 3",
        type: "sale",
        bedrooms: 4,
        bathrooms: 4,
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
        ],
        contactPhone: "0918888999",
        contactName: "Trần Minh Hoàng",

        hasPlanningIssue: false,
        hasRoadWidthIssue: true,
        houseType: 'nha_mat_tien',
        googleMapCoordinates: "10.7823,106.6958",
        alleyDepth: 0,
        alleyType: 'khac',
        width: 6,
        length: 20,
        hasConstructionApproval: true,
        hasFullConstructionApproval: true,
        floors: 4,
        hasCashFlow: true,
        hasFengShuiIssue: false,
        fengShuiIssue: 'khong',
        isHardToAccess: false,
        neighborType: 'dong_bo',
        alleyEndType: 'thong',

        saleStatus: 'dang_ban',
        floorNumber: 0,
        direction: 'dong',
        isInExistingResidentialArea: true,
        sensitiveImages: [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
        ],
        hasBuildingPermit: true,
        notes: "Mặt tiền đường lớn, thuận tiện kinh doanh đa ngành nghề",
        projectName: ""
    },
    {
        id: "prop-3",
        title: "Siêu phẩm Penthouse Sunrise City Quận 7 View Sông Kênh Tẻ",
        description: "Căn hộ Penthouse thông tầng siêu rộng rãi, sở hữu tầm nhìn 360 độ ôm trọn hoàng hôn thung lũng sông và đô thị Phú Mỹ Hưng. Đầy đủ trang thiết bị bàn giao cao cấp, sổ hồng vĩnh viễn.",
        price: 28000000000,
        area: 320,
        address: "Đường Nguyễn Hữu Thọ, Phường Tân Hưng, Quận 7",
        district: "Quận 7",
        type: "sale",
        bedrooms: 4,
        bathrooms: 5,
        images: [
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
        ],
        contactPhone: "0933344555",
        contactName: "Lê Thị Hồng",

        hasPlanningIssue: false,
        hasRoadWidthIssue: false,
        houseType: 'chung_cu',
        googleMapCoordinates: "10.7284,106.7125",
        alleyDepth: 0,
        alleyType: 'khac',
        width: 0,
        length: 0,
        hasConstructionApproval: true,
        hasFullConstructionApproval: true,
        floors: 35,
        hasCashFlow: true,
        hasFengShuiIssue: false,
        fengShuiIssue: 'khong',
        isHardToAccess: false,
        neighborType: 'yen_tinh',
        alleyEndType: 'khong_xac_dinh',

        saleStatus: 'dang_ban',
        floorNumber: 33,
        direction: 'nam',
        isInExistingResidentialArea: true,
        sensitiveImages: [
            "https://images.unsplash.com/photo-1560185008-b5ca58f9a411?auto=format&fit=crop&w=800&q=80"
        ],
        hasBuildingPermit: true,
        notes: "Penthouse 2 tầng, hồ bơi riêng, view toàn thành phố",
        projectName: "Sunrise City"
    },
    {
        id: "prop-4",
        title: "Căn hộ Studio cao cấp Phan Xích Long Phú Nhuận",
        description: "Nằm trong khu dân trí cao bậc nhất Phú Nhuận, thiết kế tinh gọn phong cách Nhật Bản tối giản. Căn hộ thích hợp mua ở ngay hoặc vận hành khai thác cho thuê dòng tiền cao ổn định.",
        price: 4500000000,
        area: 38,
        address: "Phan Xích Long, Phường 2, Quận Phú Nhuận",
        district: "Phú Nhuận",
        type: "sale",
        bedrooms: 1,
        bathrooms: 1,
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
        ],
        contactPhone: "0909876543",
        contactName: "Anh Tuấn Nguyễn",

        hasPlanningIssue: false,
        hasRoadWidthIssue: false,
        houseType: 'chung_cu',
        googleMapCoordinates: "10.8025,106.6803",
        alleyDepth: 1,
        alleyType: '1_xe_hoi',
        width: 0,
        length: 0,
        hasConstructionApproval: true,
        hasFullConstructionApproval: true,
        floors: 12,
        hasCashFlow: true,
        hasFengShuiIssue: false,
        fengShuiIssue: 'khong',
        isHardToAccess: false,
        neighborType: 'van_minh',
        alleyEndType: 'thong',

        saleStatus: 'dang_ban',
        floorNumber: 5,
        direction: 'tay',
        isInExistingResidentialArea: true,
        sensitiveImages: [
            "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80"
        ],
        hasBuildingPermit: true,
        notes: "Full nội thất cao cấp, thang máy, bảo vệ 24/7",
        projectName: "The Prince Residence"
    },
    {
        id: "prop-5",
        title: "Biệt thự sân vườn ven sông Lavila Nhà Bè thanh bình",
        description: "Compound an ninh tuyệt đối, biệt thự song lập phong cách kiến trúc Pháp hiện đại tinh tế. Có sân vườn rộng trồng rau xanh và sát cạnh công viên bờ sông.",
        price: 16500000000,
        area: 210,
        address: "Đường Nguyễn Hữu Thọ, Phước Kiển, Huyện Nhà Bè",
        district: "Nhà Bè",
        type: "sale",
        bedrooms: 3,
        bathrooms: 4,
        images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
        ],
        contactPhone: "0911223344",
        contactName: "Chị Ngọc Hoa",

        hasPlanningIssue: false,
        hasRoadWidthIssue: false,
        houseType: 'biet_thu',
        googleMapCoordinates: "10.6881,106.7264",
        alleyDepth: 0,
        alleyType: 'khac',
        width: 12,
        length: 18,
        hasConstructionApproval: true,
        hasFullConstructionApproval: true,
        floors: 2,
        hasCashFlow: false,
        hasFengShuiIssue: false,
        fengShuiIssue: 'khong',
        isHardToAccess: false,
        neighborType: 'an_ninh',
        alleyEndType: 'thong',

        saleStatus: 'dang_ban',
        floorNumber: 0,
        direction: 'dong_nam',
        isInExistingResidentialArea: false,
        sensitiveImages: [
            "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
        ],
        hasBuildingPermit: true,
        notes: "Biệt thự view sông, sân vườn 200m², hồ bơi riêng",
        projectName: "Lavila"
    },
    {
        id: "prop-6",
        title: "Nhà phố 3 tầng hẻm xe hơi đường Nguyễn Thị Minh Khai Quận 1",
        description: "Nhà phố xây kiên cố, thiết kế hiện đại, nội thất cao cấp. Vị trí thuận tiện di chuyển đến các quận trung tâm, gần chợ, trường học và bệnh viện.",
        price: 18000000000,
        area: 85,
        address: "Đường Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1",
        district: "Quận 1",
        type: "sale",
        bedrooms: 3,
        bathrooms: 3,
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
        ],
        contactPhone: "0908888999",
        contactName: "Lê Văn Thành",

        hasPlanningIssue: false,
        hasRoadWidthIssue: false,
        houseType: 'nha_pho',
        googleMapCoordinates: "10.7749,106.7017",
        alleyDepth: 2,
        alleyType: '1_xe_hoi',
        width: 5,
        length: 17,
        hasConstructionApproval: true,
        hasFullConstructionApproval: true,
        floors: 3,
        hasCashFlow: true,
        hasFengShuiIssue: false,
        fengShuiIssue: 'khong',
        isHardToAccess: false,
        neighborType: 'dong_bo',
        alleyEndType: 'thong',

        saleStatus: 'dang_ban',
        floorNumber: 0,
        direction: 'nam',
        isInExistingResidentialArea: true,
        sensitiveImages: [
            "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80"
        ],
        hasBuildingPermit: true,
        notes: "Nhà mới xây 3 tầng, có thang máy, hẻm rộng 5m",
        projectName: ""
    },
    {
        id: "prop-7",
        title: "Đất nền dự án KDC Phú Mỹ Hưng Quận 7",
        description: "Lô đất đẹp nằm trong khu dân cư Phú Mỹ Hưng, hạ tầng hoàn chỉnh, gần trường học quốc tế và trung tâm thương mại. Phù hợp xây biệt thự hoặc nhà phố.",
        price: 9500000000,
        area: 150,
        address: "Đường Nguyễn Lương Bằng, Phường Tân Phú, Quận 7",
        district: "Quận 7",
        type: "sale",
        bedrooms: 0,
        bathrooms: 0,
        images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
        ],
        contactPhone: "0977777888",
        contactName: "Phạm Thị Lan",

        hasPlanningIssue: false,
        hasRoadWidthIssue: false,
        houseType: 'dat',
        googleMapCoordinates: "10.7341,106.7285",
        alleyDepth: 0,
        alleyType: 'khac',
        width: 10,
        length: 15,
        hasConstructionApproval: false,
        hasFullConstructionApproval: false,
        floors: 0,
        hasCashFlow: false,
        hasFengShuiIssue: false,
        fengShuiIssue: 'khong',
        isHardToAccess: false,
        neighborType: 'van_minh',
        alleyEndType: 'thong',

        saleStatus: 'dang_ban',
        floorNumber: 0,
        direction: 'dong_nam',
        isInExistingResidentialArea: false,
        sensitiveImages: [
            "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80"
        ],
        hasBuildingPermit: false,
        notes: "Đất sạch, sổ đỏ, xây dựng tự do",
        projectName: "Phú Mỹ Hưng"
    },
    {
        id: "prop-8",
        title: "Nhà cấp 4 hẻm xe máy Phan Văn Trị Phú Nhuận",
        description: "Nhà cấp 4 diện tích lớn, thích hợp đầu tư giữ tiền hoặc xây mới. Vị trí gần chợ, trường học, bệnh viện. Hẻm rộng 2.5m, an ninh tốt.",
        price: 3200000000,
        area: 65,
        address: "Phan Văn Trị, Phường 5, Quận Phú Nhuận",
        district: "Phú Nhuận",
        type: "sale",
        bedrooms: 2,
        bathrooms: 1,
        images: [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
        ],
        contactPhone: "0905555666",
        contactName: "Nguyễn Văn Bình",

        hasPlanningIssue: false,
        hasRoadWidthIssue: false,
        houseType: 'nha_cap_4',
        googleMapCoordinates: "10.7996,106.6794",
        alleyDepth: 1,
        alleyType: '1_xe_may',
        width: 5,
        length: 13,
        hasConstructionApproval: true,
        hasFullConstructionApproval: true,
        floors: 1,
        hasCashFlow: true,
        hasFengShuiIssue: true,
        fengShuiIssue: 'top_hau',
        isHardToAccess: false,
        neighborType: 'yen_tinh',
        alleyEndType: 'cut',

        saleStatus: 'dang_ban',
        floorNumber: 0,
        direction: 'tay_nam',
        isInExistingResidentialArea: true,
        sensitiveImages: [
            "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80"
        ],
        hasBuildingPermit: true,
        notes: "Nhà cấp 4 diện tích lớn, tiện xây mới hoặc cải tạo",
        projectName: ""
    }
];