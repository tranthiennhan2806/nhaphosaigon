export const SHEET_HEADERS = [
    'ID',
    'Tiêu đề',
    'Mô tả',
    'Giá (VNĐ)',
    'Diện tích (m²)',
    'Địa chỉ',
    'Quận/Huyện',
    'Số phòng ngủ',
    'Số toilet',
    'URL ảnh (cách nhau bằng dấu phẩy)',
    'Tên liên hệ',
    'SĐT liên hệ',
    'Dính quy hoạch (true/false)',
    'Dính lộ giới (true/false)',
    'Loại nhà',
    'Tọa độ Google Map',
    'Số xẹt',
    'Loại hẻm',
    'Chiều ngang (m)',
    'Chiều dài (m)',
    'Hoàn công (true/false)',
    'Hoàn công đầy đủ (true/false)',
    'Số tầng',
    'Có dòng tiền (true/false)',
    'Lỗi phong thủy (true/false)',
    'Loại lỗi phong thủy',
    'Đường vào khó đi (true/false)',
    'Loại hàng xóm',
    'Hẻm cụt/thông',
    // Các trường bổ sung mới
    'Trạng thái bán (dang_ban/da_ban)',
    'Tầng số (chung cư)',
    'Hướng nhà',
    'Khu dân cư hiện hữu (true/false)',
    'Hình nhạy cảm (cách nhau bằng dấu phẩy)',
    'Giấy phép xây dựng (true/false)',
    'Ghi chú'
];

export const SHEET_HEADERS_MAP = {
    'ID': 'id',
    'Tiêu đề': 'title',
    'Mô tả': 'description',
    'Giá (VNĐ)': 'price',
    'Diện tích (m²)': 'area',
    'Địa chỉ': 'address',
    'Quận/Huyện': 'district',
    'Số phòng ngủ': 'bedrooms',
    'Số toilet': 'bathrooms',
    'URL ảnh (cách nhau bằng dấu phẩy)': 'images',
    'Tên liên hệ': 'contactName',
    'SĐT liên hệ': 'contactPhone',
    'Dính quy hoạch (true/false)': 'hasPlanningIssue',
    'Dính lộ giới (true/false)': 'hasRoadWidthIssue',
    'Loại nhà': 'houseType',
    'Tọa độ Google Map': 'googleMapCoordinates',
    'Số xẹt': 'alleyDepth',
    'Loại hẻm': 'alleyType',
    'Chiều ngang (m)': 'width',
    'Chiều dài (m)': 'length',
    'Hoàn công (true/false)': 'hasConstructionApproval',
    'Hoàn công đầy đủ (true/false)': 'hasFullConstructionApproval',
    'Số tầng': 'floors',
    'Có dòng tiền (true/false)': 'hasCashFlow',
    'Lỗi phong thủy (true/false)': 'hasFengShuiIssue',
    'Loại lỗi phong thủy': 'fengShuiIssue',
    'Đường vào khó đi (true/false)': 'isHardToAccess',
    'Loại hàng xóm': 'neighborType',
    'Hẻm cụt/thông': 'alleyEndType',
    // Các trường bổ sung mới
    'Trạng thái bán (dang_ban/da_ban)': 'saleStatus',
    'Tầng số (chung cư)': 'floorNumber',
    'Hướng nhà': 'direction',
    'Khu dân cư hiện hữu (true/false)': 'isInExistingResidentialArea',
    'Hình nhạy cảm (cách nhau bằng dấu phẩy)': 'sensitiveImages',
    'Giấy phép xây dựng (true/false)': 'hasBuildingPermit',
    'Ghi chú': 'notes'
};

// Hướng dẫn các giá trị cho các trường enum
export const ENUM_GUIDE = {
    houseType: {
        'nha_cap_4': 'Nhà cấp 4',
        'dat': 'Đất',
        'nha_mat_tien': 'Nhà mặt tiền',
        'nha_hem': 'Nhà hẻm',
        'biet_thu': 'Biệt thự',
        'chung_cu': 'Chung cư',
        'nha_pho': 'Nhà phố',
        'khac': 'Khác'
    },
    alleyType: {
        '1_xe_may': '1 xe máy',
        '2_xe_may': '2 xe máy',
        '1_xe_hoi': '1 xe hơi',
        '2_xe_hoi': '2 xe hơi',
        '1_xe_tai': '1 xe tải',
        '2_xe_tai': '2 xe tải',
        'khac': 'Khác'
    },
    fengShuiIssue: {
        'top_hau': 'Tóp hậu',
        'duong_dam': 'Đường đâm',
        'nga_ba': 'Ngã ba',
        'nga_tu': 'Ngã tư',
        'duong_cut': 'Đường cụt',
        'gom_chan': 'Gồm chân',
        'khac': 'Khác',
        'khong': 'Không có'
    },
    neighborType: {
        'an_ninh': 'An ninh',
        'yen_tinh': 'Yên tĩnh',
        'dong_bo': 'Đồng bộ',
        'nao_nhiet': 'Náo nhiệt',
        'van_minh': 'Văn minh',
        'khac': 'Khác'
    },
    alleyEndType: {
        'cut': 'Hẻm cụt',
        'thong': 'Hẻm thông',
        'khong_xac_dinh': 'Không xác định'
    },
    // Các hướng dẫn mới
    saleStatus: {
        'dang_ban': 'Đang bán',
        'da_ban': 'Đã bán'
    },
    direction: {
        'dong': 'Đông',
        'tay': 'Tây',
        'nam': 'Nam',
        'bac': 'Bắc',
        'tay_bac': 'Tây Bắc',
        'tay_nam': 'Tây Nam',
        'dong_bac': 'Đông Bắc',
        'dong_nam': 'Đông Nam',
        'khong_xac_dinh': 'Không xác định'
    }
};

// Hướng dẫn chi tiết cho từng trường
export const FIELD_GUIDE = {
    saleStatus: {
        description: 'Trạng thái bán của bất động sản',
        values: ['dang_ban (Đang bán)', 'da_ban (Đã bán)'],
        default: 'dang_ban'
    },
    floorNumber: {
        description: 'Số tầng của căn hộ (chỉ áp dụng cho chung cư)',
        example: '15 (tầng 15), 0 (nhà đất không có tầng)'
    },
    direction: {
        description: 'Hướng nhà (theo phong thủy)',
        values: ['dong (Đông)', 'tay (Tây)', 'nam (Nam)', 'bac (Bắc)',
            'tay_bac (Tây Bắc)', 'tay_nam (Tây Nam)',
            'dong_bac (Đông Bắc)', 'dong_nam (Đông Nam)',
            'khong_xac_dinh (Không xác định)'],
        default: 'khong_xac_dinh'
    },
    isInExistingResidentialArea: {
        description: 'Bất động sản có nằm trong khu dân cư hiện hữu không',
        values: ['true (Có)', 'false (Không)'],
        default: 'false'
    },
    sensitiveImages: {
        description: 'Hình nhạy cảm (hình sổ, hình mặt tiền có bảng địa chỉ, v.v.)',
        note: 'Các URL ảnh cách nhau bằng dấu phẩy (, )',
        example: 'https://example.com/so-hong.jpg, https://example.com/mat-tien.jpg'
    },
    hasBuildingPermit: {
        description: 'Bất động sản có giấy phép xây dựng không',
        values: ['true (Có)', 'false (Không)'],
        default: 'false'
    },
    notes: {
        description: 'Ghi chú thêm về bất động sản',
        note: 'Có thể bao gồm thông tin về vị trí, tiện ích, lưu ý đặc biệt, v.v.'
    }
};