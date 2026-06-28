import { Property } from '@/types';
import {
    HOUSE_TYPES,
    ALLEY_TYPES,
    FENG_SHUI_ISSUES,
    NEIGHBOR_TYPES,
    ALLEY_END_TYPES
} from '@/configs/constants';

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
        alleyEndType: parseEnum(row[28] || 'khong_xac_dinh', 'khong_xac_dinh' as const, ALLEY_END_TYPES)
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
        prop.alleyEndType
    ]);
};

/**
 * Lấy access token từ Service Account
 */
export const getAccessToken = async (clientEmail: string, privateKey: string): Promise<string> => {
    try {
        // Chuẩn hóa private key
        const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

        // Tạo JWT
        const now = Math.floor(Date.now() / 1000);
        const jwtPayload = {
            iss: clientEmail,
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600,
            iat: now,
        };

        // Mã hóa JWT
        const encodedHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
        const encodedPayload = Buffer.from(JSON.stringify(jwtPayload)).toString('base64url');
        const signatureInput = `${encodedHeader}.${encodedPayload}`;

        // Tạo chữ ký
        const crypto = require('crypto');
        const sign = crypto.createSign('SHA256');
        sign.update(signatureInput);
        const signature = sign.sign(formattedPrivateKey, 'base64url');

        const jwt = `${signatureInput}.${signature}`;

        // Lấy access token
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt,
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
    range: string = "Sheet1!A2:AC"
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

        if (!data.values) {
            throw new Error("Không tìm thấy dữ liệu trong Google Sheets");
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
    range: string = "Sheet1!A:AC"
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
    range: string = "Sheet1!A2:AC"
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

    if (!data.values) {
        throw new Error("Không tìm thấy dữ liệu trong Google Sheets");
    }

    return parseGoogleSheetsData(data.values);
};