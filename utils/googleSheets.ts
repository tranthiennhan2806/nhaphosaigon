import { Property } from '@/types';
import {
    HOUSE_TYPES,
    ALLEY_TYPES,
    FENG_SHUI_ISSUES,
    NEIGHBOR_TYPES,
    ALLEY_END_TYPES,
    DIRECTIONS,
    SALE_STATUSES
} from '@/configs/constants';
import { SignJWT, importPKCS8 } from 'jose';

// Helper để parse boolean từ string
const parseBoolean = (value: string): boolean => {
    if (!value) return false;
    return value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes' || value.toLowerCase() === 'có';
};

// Helper để parse các enum
const parseEnum = <T>(value: string, defaultValue: T, validValues: readonly { value: string }[]): T => {
    if (!value) return defaultValue;
    const found = validValues.find(v => v.value === value);
    return found ? value as T : defaultValue;
};

// Helper để parse direction
const parseDirection = (value: string): string => {
    const validDirections = DIRECTIONS.map(d => d.value);
    return validDirections.includes(value) ? value : 'khong_xac_dinh';
};

// Helper để parse sale status
const parseSaleStatus = (value: string): string => {
    const validStatuses = SALE_STATUSES.map(s => s.value);
    return validStatuses.includes(value) ? value : 'dang_ban';
};

export const parseGoogleSheetsData = (rows: string[][]): Property[] => {
    if (!rows || rows.length === 0) return [];

    return rows.map((row: string[], index: number) => ({
        id: row[0] || `sheet-${index}`,
        title: row[1] || "Không tên",
        description: row[2] || "",
        price: Number(row[3]) || 0,
        area: Number(row[4]) || 0,
        address: row[5] || "",
        district: row[6] || "Quận 1",
        type: 'sale' as const,
        bedrooms: Number(row[7]) || 1,
        bathrooms: Number(row[8]) || 1,
        images: row[9] ? row[9].split(',').map((img: string) => img.trim()) : [],
        contactName: row[10] || "Chính chủ",
        contactPhone: row[11] || "",
        hasPlanningIssue: parseBoolean(row[12] || 'false'),
        hasRoadWidthIssue: parseBoolean(row[13] || 'false'),
        houseType: parseEnum(row[14] || 'nha_pho', 'nha_pho' as const, HOUSE_TYPES),
        googleMapCoordinates: row[15] || "",
        alleyDepth: Number(row[16]) || 0,
        alleyType: parseEnum(row[17] || 'khac', 'khac' as const, ALLEY_TYPES),
        width: Number(row[18]) || 0,
        length: Number(row[19]) || 0,
        hasConstructionApproval: parseBoolean(row[20] || 'false'),
        hasFullConstructionApproval: parseBoolean(row[21] || 'false'),
        floors: Number(row[22]) || 0,
        hasCashFlow: parseBoolean(row[23] || 'false'),
        hasFengShuiIssue: parseBoolean(row[24] || 'false'),
        fengShuiIssue: parseEnum(row[25] || 'khong', 'khong' as const, FENG_SHUI_ISSUES),
        isHardToAccess: parseBoolean(row[26] || 'false'),
        neighborType: parseEnum(row[27] || 'khac', 'khac' as const, NEIGHBOR_TYPES),
        alleyEndType: parseEnum(row[28] || 'khong_xac_dinh', 'khong_xac_dinh' as const, ALLEY_END_TYPES),

        // Các trường bổ sung mới (29-35)
        saleStatus: parseSaleStatus(row[29] || 'dang_ban') as any,
        floorNumber: Number(row[30]) || 0,
        direction: parseDirection(row[31] || 'khong_xac_dinh') as any,
        isInExistingResidentialArea: parseBoolean(row[32] || 'false'),
        sensitiveImages: row[33] ? row[33].split(',').map((img: string) => img.trim()).filter(Boolean) : [],
        hasBuildingPermit: parseBoolean(row[34] || 'false'),
        notes: row[35] || '',
        projectName: row[36] || ''
    }));
};

export const convertToGoogleSheetsFormat = (properties: Property[]): string[][] => {
    return properties.map(prop => [
        prop.id,
        prop.title,
        prop.description,
        prop.price.toString(),
        prop.area.toString(),
        prop.address,
        prop.district,
        prop.bedrooms.toString(),
        prop.bathrooms.toString(),
        prop.images.join(','),
        prop.contactName,
        prop.contactPhone,
        prop.hasPlanningIssue.toString(),
        prop.hasRoadWidthIssue.toString(),
        prop.houseType,
        prop.googleMapCoordinates,
        prop.alleyDepth.toString(),
        prop.alleyType,
        prop.width.toString(),
        prop.length.toString(),
        prop.hasConstructionApproval.toString(),
        prop.hasFullConstructionApproval.toString(),
        prop.floors.toString(),
        prop.hasCashFlow.toString(),
        prop.hasFengShuiIssue.toString(),
        prop.fengShuiIssue,
        prop.isHardToAccess.toString(),
        prop.neighborType,
        prop.alleyEndType,

        // Các trường bổ sung mới (29-35)
        prop.saleStatus,
        prop.floorNumber.toString(),
        prop.direction,
        prop.isInExistingResidentialArea.toString(),
        prop.sensitiveImages.join(','),
        prop.hasBuildingPermit.toString(),
        prop.notes,
        prop.projectName
    ]);
};

// Định nghĩa tên sheet - sửa thành tên sheet thực tế của bạn
const SHEET_NAME = 'bds'; // Hoặc 'Sheet1' nếu bạn chưa đổi tên

/**
 * Lấy access token từ Service Account sử dụng jose
 */
export const getAccessToken = async (clientEmail: string, privateKey: string): Promise<string> => {
    try {
        // Chuẩn hóa private key
        const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

        // Tạo JWT payload
        const now = Math.floor(Date.now() / 1000);
        
        // Import private key
        const privateKeyObj = await importPKCS8(formattedPrivateKey, 'RS256');

        // Tạo JWT token
        const token = await new SignJWT({
            iss: clientEmail,
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600,
            iat: now,
        })
        .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .setIssuer(clientEmail)
        .setAudience('https://oauth2.googleapis.com/token')
        .sign(privateKeyObj);

        // Lấy access token
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: token,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to get access token: ${error}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
};

/**
 * Fetch dữ liệu từ Google Sheets sử dụng Service Account
 */
export const fetchFromGoogleSheetsWithServiceAccount = async (
    spreadsheetId: string,
    clientEmail: string,
    privateKey: string,
    range: string = `${SHEET_NAME}!A2:AJ`
): Promise<Property[]> => {
    try {
        const accessToken = await getAccessToken(clientEmail, privateKey);

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Lỗi Google Sheets API: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();

        // Nếu không có dữ liệu, trả về mảng rỗng thay vì throw error
        if (!data.values || data.values.length === 0) {
            console.log("🔹 Không tìm thấy dữ liệu trong Google Sheets, trả về mảng rỗng");
            return [];
        }

        return parseGoogleSheetsData(data.values);
    } catch (error) {
        console.error('Error fetching from Google Sheets:', error);
        throw error;
    }
};

/**
 * Update dữ liệu lên Google Sheets sử dụng Service Account
 */
export const updateGoogleSheetsWithServiceAccount = async (
    spreadsheetId: string,
    clientEmail: string,
    privateKey: string,
    properties: Property[],
    range: string = `${SHEET_NAME}!A:AJ`
): Promise<boolean> => {
    try {
        const accessToken = await getAccessToken(clientEmail, privateKey);
        const rows = convertToGoogleSheetsFormat(properties);

        // Clear existing data
        const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:clear`;
        await fetch(clearUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        // Append new data
        const payload = {
            range: range,
            majorDimension: "ROWS",
            values: rows,
        };

        const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`;

        const response = await fetch(updateUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Lỗi khi cập nhật Google Sheets: ${error.error?.message || response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error('Error updating Google Sheets:', error);
        throw error;
    }
};

// Giữ các hàm cũ cho tương thích ngược (sử dụng API Key)
export const fetchFromGoogleSheets = async (
    spreadsheetId: string,
    apiKey: string,
    range: string = `${SHEET_NAME}!A2:AJ`
): Promise<Property[]> => {
    if (!spreadsheetId || !apiKey) {
        throw new Error("Thiếu thông tin kết nối Google Sheets");
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Lỗi Google Sheets API: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Nếu không có dữ liệu, trả về mảng rỗng thay vì throw error
    if (!data.values || data.values.length === 0) {
        console.log("🔹 Không tìm thấy dữ liệu trong Google Sheets, trả về mảng rỗng");
        return [];
    }

    return parseGoogleSheetsData(data.values);
};

/**
 * Append dữ liệu vào cuối Google Sheets
 */
export const appendToGoogleSheets = async (
    spreadsheetId: string,
    clientEmail: string,
    privateKey: string,
    properties: Property[],
    range: string = `${SHEET_NAME}!A:AJ`
): Promise<boolean> => {
    try {
        const accessToken = await getAccessToken(clientEmail, privateKey);
        const rows = convertToGoogleSheetsFormat(properties);

        const payload = {
            range: range,
            majorDimension: "ROWS",
            values: rows,
        };

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Lỗi khi append Google Sheets: ${error.error?.message || response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error('Error appending to Google Sheets:', error);
        throw error;
    }
};

/**
 * Cập nhật 1 row trong Google Sheets theo index
 */
export const updateGoogleSheetsRow = async (
    spreadsheetId: string,
    clientEmail: string,
    privateKey: string,
    property: Property,
    rowIndex: number,
    range: string = `${SHEET_NAME}!A:AJ`
): Promise<boolean> => {
    try {
        const accessToken = await getAccessToken(clientEmail, privateKey);
        const rows = convertToGoogleSheetsFormat([property]);

        const updateRange = `${SHEET_NAME}!A${rowIndex}:AJ${rowIndex}`;
        const payload = {
            range: updateRange,
            majorDimension: "ROWS",
            values: rows,
        };

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${updateRange}?valueInputOption=RAW`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Lỗi khi cập nhật row Google Sheets: ${error.error?.message || response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error('Error updating row in Google Sheets:', error);
        throw error;
    }
};

/**
 * Xóa 1 row trong Google Sheets theo index
 */
export const deleteFromGoogleSheets = async (
    spreadsheetId: string,
    clientEmail: string,
    privateKey: string,
    rowIndex: number,
    range: string = `${SHEET_NAME}!A:AJ`
): Promise<boolean> => {
    try {
        const accessToken = await getAccessToken(clientEmail, privateKey);

        // Xóa nội dung row
        const deleteRange = `${SHEET_NAME}!A${rowIndex}:AJ${rowIndex}`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${deleteRange}:clear`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Lỗi khi xóa row Google Sheets: ${error.error?.message || response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error('Error deleting row from Google Sheets:', error);
        throw error;
    }
};