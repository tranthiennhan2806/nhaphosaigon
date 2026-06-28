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

        // Các trường mới
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
        alleyEndType: 'khong_xac_dinh'
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
        alleyEndType: 'thong'
    },
    // ... thêm các property khác với đầy đủ thông tin
];