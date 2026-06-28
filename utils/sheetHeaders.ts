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
    'Hẻm cụt/thông'
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
    'Hẻm cụt/thông': 'alleyEndType'
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
    }
};