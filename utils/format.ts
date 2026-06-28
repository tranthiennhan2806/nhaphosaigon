/**
 * Định dạng giá tiền sang đơn vị Tỷ
 * @param price - Giá tiền (VNĐ)
 * @returns Chuỗi định dạng: "X.XX TỶ"
 * @example formatPrice(8500000000) // "8.5 TỶ"
 */
export const formatPrice = (price: number): string => {
    if (!price || price === 0) return "0 TỶ";
    return `${(price / 1000000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} TỶ`;
};

/**
 * Định dạng giá tiền sang đơn vị Tỷ (rút gọn)
 * @param price - Giá tiền (VNĐ)
 * @returns Chuỗi định dạng: "X.X TỶ"
 * @example formatPriceShort(8500000000) // "8.5 TỶ"
 */
export const formatPriceShort = (price: number): string => {
    if (!price || price === 0) return "0 TỶ";
    return `${(price / 1000000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} TỶ`;
};

/**
 * Định dạng số với dấu phân cách hàng nghìn
 * @param num - Số cần định dạng
 * @returns Chuỗi định dạng
 * @example formatNumber(1234567) // "1,234,567"
 */
export const formatNumber = (num: number): string => {
    if (!num && num !== 0) return "0";
    return num.toLocaleString('vi-VN');
};

/**
 * Định dạng số tiền VNĐ
 * @param amount - Số tiền
 * @returns Chuỗi định dạng: "X,XXX,XXX VNĐ"
 * @example formatCurrency(1234567) // "1,234,567 VNĐ"
 */
export const formatCurrency = (amount: number): string => {
    if (!amount && amount !== 0) return "0 VNĐ";
    return `${formatNumber(amount)} VNĐ`;
};

/**
 * Định dạng diện tích với đơn vị m²
 * @param area - Diện tích
 * @returns Chuỗi định dạng: "X m²"
 * @example formatArea(72) // "72 m²"
 */
export const formatArea = (area: number): string => {
    if (!area && area !== 0) return "0 m²";
    return `${area} m²`;
};

/**
 * Định dạng kích thước (ngang x dài)
 * @param width - Chiều ngang
 * @param length - Chiều dài
 * @returns Chuỗi định dạng: "Ngang Xm x Dài Ym"
 * @example formatDimension(4, 20) // "Ngang 4m x Dài 20m"
 */
export const formatDimension = (width: number, length: number): string => {
    if (!width && !length) return "Chưa có thông tin";
    return `Ngang ${width}m x Dài ${length}m`;
};

/**
 * Định dạng tầng
 * @param floors - Số tầng
 * @returns Chuỗi định dạng: "X tầng" hoặc "Trệt" nếu 0 tầng
 * @example formatFloors(4) // "4 tầng"
 */
export const formatFloors = (floors: number): string => {
    if (!floors || floors === 0) return "Trệt";
    return `${floors} tầng`;
};

/**
 * Định dạng phòng ngủ
 * @param bedrooms - Số phòng ngủ
 * @returns Chuỗi định dạng: "X PHÒNG" hoặc "Studio" nếu 0
 * @example formatBedrooms(2) // "2 PHÒNG"
 */
export const formatBedrooms = (bedrooms: number): string => {
    if (!bedrooms || bedrooms === 0) return "Studio";
    return `${bedrooms} PHÒNG`;
};

/**
 * Định dạng toilet
 * @param bathrooms - Số toilet
 * @returns Chuỗi định dạng: "X PHÒNG" hoặc "1" nếu không có
 * @example formatBathrooms(2) // "2 PHÒNG"
 */
export const formatBathrooms = (bathrooms: number): string => {
    if (!bathrooms || bathrooms === 0) return "1";
    return `${bathrooms} PHÒNG`;
};

/**
 * Định dạng giá trên m²
 * @param price - Giá tiền
 * @param area - Diện tích
 * @returns Chuỗi định dạng: "X.X TR/M²"
 * @example formatPricePerM2(8500000000, 72) // "118.1 TR/M²"
 */
export const formatPricePerM2 = (price: number, area: number): string => {
    if (!price || !area) return "0 TR/M²";
    return `~ ${(price / area / 1000000).toFixed(1)} TR/M²`;
};

/**
 * Định dạng số điện thoại Việt Nam
 * @param phone - Số điện thoại
 * @returns Chuỗi định dạng: "0XX XXX XXXX"
 * @example formatPhoneNumber("0901234567") // "090 123 4567"
 */
export const formatPhoneNumber = (phone: string): string => {
    if (!phone) return "";
    // Xóa tất cả khoảng trắng và ký tự đặc biệt
    const cleaned = phone.replace(/\s/g, '').replace(/[^0-9+]/g, '');
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return phone;
};

/**
 * Rút gọn địa chỉ
 * @param address - Địa chỉ đầy đủ
 * @param maxLength - Độ dài tối đa
 * @returns Chuỗi địa chỉ đã rút gọn
 * @example truncateAddress("Số 2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1", 20) // "Số 2 Tôn Đức Thắng..."
 */
export const truncateAddress = (address: string, maxLength: number = 30): string => {
    if (!address) return "";
    if (address.length <= maxLength) return address;
    return address.slice(0, maxLength) + "...";
};

/**
 * Format boolean thành Yes/No
 * @param value - Giá trị boolean
 * @returns "Có" hoặc "Không"
 */
export const formatBoolean = (value: boolean): string => {
    return value ? "Có" : "Không";
};

/**
 * Format boolean thành icon hoặc text
 * @param value - Giá trị boolean
 * @param trueText - Text khi true
 * @param falseText - Text khi false
 * @returns Chuỗi đã format
 */
export const formatBooleanWithText = (value: boolean, trueText: string = "Đã hoàn công", falseText: string = "Chưa hoàn công"): string => {
    return value ? trueText : falseText;
};

/**
 * Tạo slug từ chuỗi
 * @param text - Chuỗi cần tạo slug
 * @returns Slug
 * @example createSlug("Căn hộ Vinhomes") // "can-ho-vinhomes"
 */
export const createSlug = (text: string): string => {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
};

/**
 * Lấy tên viết tắt từ tên
 * @param name - Tên đầy đủ
 * @returns Tên viết tắt (2 ký tự đầu)
 * @example getInitials("Nguyễn Văn Anh") // "NA"
 */
export const getInitials = (name: string): string => {
    if (!name) return "??";
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};