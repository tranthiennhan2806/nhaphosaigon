// Loại nhà
export type HouseType = 'nha_cap_4' | 'dat' | 'nha_mat_tien' | 'nha_hem' | 'biet_thu' | 'chung_cu' | 'nha_pho' | 'khac';

// Loại hẻm
export type AlleyType = '1_xe_may' | '2_xe_may' | '1_xe_hoi' | '2_xe_hoi' | '1_xe_tai' | '2_xe_tai' | 'khac';

// Loại lỗi phong thủy
export type FengShuiIssue = 'top_hau' | 'duong_dam' | 'nga_ba' | 'nga_tu' | 'duong_cut' | 'gom_chan' | 'khac' | 'khong';

// Loại hàng xóm
export type NeighborType = 'an_ninh' | 'yen_tinh' | 'dong_bo' | 'nao_nhiet' | 'van_minh' | 'khac';

// Loại hẻm cụt/thông
export type AlleyEndType = 'cut' | 'thong' | 'khong_xac_dinh';

// Loại hướng
export type Direction = 'dong' | 'tay' | 'nam' | 'bac' | 'tay_bac' | 'tay_nam' | 'dong_bac' | 'dong_nam' | 'khong_xac_dinh';

// Trạng thái bán
export type SaleStatus = 'dang_ban' | 'da_ban';

export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    area: number;
    address: string;
    district: string;
    type: 'sale';
    bedrooms: number;
    bathrooms: number;
    images: string[];
    contactName: string;
    contactPhone: string;

    // Các trường mới
    hasPlanningIssue: boolean;              // Có dính quy hoạch không
    hasRoadWidthIssue: boolean;             // Có dính lộ giới không
    houseType: HouseType;                   // Loại nhà
    googleMapCoordinates: string;           // Tọa độ Google Map (lat,lng)
    alleyDepth: number;                     // Nhà mấy xẹt (số)
    alleyType: AlleyType;                   // Hẻm gì
    width: number;                          // Ngang (mét)
    length: number;                         // Dài (mét)
    hasConstructionApproval: boolean;       // Hoàn công chưa
    hasFullConstructionApproval: boolean;   // Hoàn công đầy đủ không
    floors: number;                         // Mấy tầng
    hasCashFlow: boolean;                   // Có dòng tiền không
    hasFengShuiIssue: boolean;              // Có dính lỗi phong thủy không
    fengShuiIssue: FengShuiIssue;           // Lỗi phong thủy gì
    isHardToAccess: boolean;                // Đường vào khó đi không
    neighborType: NeighborType;             // Hàng xóm
    alleyEndType: AlleyEndType;             // Hẻm cụt hay hẻm thông

    // Các trường bổ sung mới
    saleStatus: SaleStatus;                 // Đã bán/Đang bán
    floorNumber: number;                    // Tầng thứ mấy (nếu là chung cư)
    direction: Direction;                   // Hướng nhà
    isInExistingResidentialArea: boolean;   // Có nằm trong khu dân cư hiện hữu không
    sensitiveImages: string[];              // Hình nhạy cảm (hình sổ, mặt tiền có bảng địa chỉ,...)
    hasBuildingPermit: boolean;             // Có giấy phép xây dựng không
    notes: string;                          // Ghi chú nếu có
    projectName: string;                    // Tên dự án (nếu là chung cư)
}

export interface GoogleSheetsConfig {
    spreadsheetId: string;
    clientEmail: string;
    privateKey: string;
    discordWebhookUrl: string;
    discordWebhookUrl2?: string;
    isUsingMock: boolean;
}

export interface AppConfig {
    spreadsheetId: string;
    googleApiKey?: string; // Giữ lại để tương thích ngược
    googleClientEmail: string;
    googlePrivateKey: string;
    discordWebhookUrl: string;
    discordWebhookUrl2?: string;
    isUsingMock: boolean;
}

export interface FilterState {
    search: string;
    type: string;
    minPrice: string;
    maxPrice: string;
    minArea: string;
    maxArea: string;
    location: string;

    // Các filter mới
    houseType?: string;
    minFloors?: string;
    maxFloors?: string;
    hasPlanningIssue?: boolean;
    hasRoadWidthIssue?: boolean;
    hasConstructionApproval?: boolean;
    hasCashFlow?: boolean;
    alleyType?: string;
    minWidth?: string;
    maxWidth?: string;

    // Các filter bổ sung
    saleStatus?: string;                    // Lọc theo trạng thái bán
    direction?: string;                     // Lọc theo hướng
    hasBuildingPermit?: boolean;            // Lọc theo giấy phép xây dựng
    isInExistingResidentialArea?: boolean;  // Lọc theo khu dân cư hiện hữu
    minFloor?: string;                      // Lọc theo tầng tối thiểu
    maxFloor?: string;                      // Lọc theo tầng tối đa
    projectName?: string;                   // Lọc theo tên dự án
}

export interface ToastState {
    message: string;
    type: string;
}

export interface GoogleSheetsRow {
    id: string;
    title: string;
    description: string;
    price: string;
    area: string;
    address: string;
    district: string;
    bedrooms: string;
    bathrooms: string;
    images: string;
    contactName: string;
    contactPhone: string;

    // Các trường cũ
    hasPlanningIssue: string;
    hasRoadWidthIssue: string;
    houseType: string;
    googleMapCoordinates: string;
    alleyDepth: string;
    alleyType: string;
    width: string;
    length: string;
    hasConstructionApproval: string;
    hasFullConstructionApproval: string;
    floors: string;
    hasCashFlow: string;
    hasFengShuiIssue: string;
    fengShuiIssue: string;
    isHardToAccess: string;
    neighborType: string;
    alleyEndType: string;

    // Các trường bổ sung mới
    saleStatus: string;                    // Đã bán/Đang bán
    floorNumber: string;                   // Tầng thứ mấy
    direction: string;                     // Hướng
    isInExistingResidentialArea: string;   // Khu dân cư hiện hữu
    sensitiveImages: string;               // Hình nhạy cảm (cách nhau bằng dấu phẩy)
    hasBuildingPermit: string;             // Giấy phép xây dựng
    notes: string;                         // Ghi chú
    projectName: string;                   // Tên dự án
}