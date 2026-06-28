import { useState, useCallback } from 'react';
import { Property, AppConfig } from '@/types';
import {
    fetchFromGoogleSheetsWithServiceAccount,
    updateGoogleSheetsWithServiceAccount,
    fetchFromGoogleSheets,
    appendToGoogleSheets,
    updateGoogleSheetsRow,
    deleteFromGoogleSheets
} from '@/utils/googleSheets';
import { MOCK_PROPERTIES } from '@/configs/constants';

// Định nghĩa tên sheet
const SHEET_1 = 'bds';

export const useGoogleSheets = (config: AppConfig) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; status: string }>({ current: 0, total: 0, status: '' });

    console.log('🔍 useGoogleSheets - Config:', {
        spreadsheetId: config.spreadsheetId,
        googleClientEmail: config.googleClientEmail,
        hasPrivateKey: !!config.googlePrivateKey,
        discordWebhookUrl: config.discordWebhookUrl,
        discordWebhookUrl2: config.discordWebhookUrl2,
        isUsingMock: config.isUsingMock
    });

    // Hàm lấy tất cả properties từ Google Sheets
    const fetchProperties = useCallback(async (): Promise<Property[]> => {
        setIsLoading(true);
        setError(null);

        try {
            if (!config.spreadsheetId) {
                console.log("🔹 Đang sử dụng dữ liệu mock (không có spreadsheet ID)");
                return MOCK_PROPERTIES;
            }

            if (config.googleClientEmail && config.googlePrivateKey) {
                console.log("🔹 Đang fetch dữ liệu từ Google Sheets với Service Account...");
                const properties = await fetchFromGoogleSheetsWithServiceAccount(
                    config.spreadsheetId,
                    config.googleClientEmail,
                    config.googlePrivateKey,
                    `${SHEET_1}!A2:AJ`
                );
                console.log(`✅ Đã fetch ${properties.length} properties từ Google Sheets`);
                return properties;
            }

            if (config.googleApiKey) {
                console.log("🔹 Đang fetch dữ liệu từ Google Sheets với API Key...");
                const properties = await fetchFromGoogleSheets(
                    config.spreadsheetId,
                    config.googleApiKey,
                    `${SHEET_1}!A2:AJ`
                );
                console.log(`✅ Đã fetch ${properties.length} properties từ Google Sheets`);
                return properties;
            }

            console.log("🔹 Không có phương thức xác thực, sử dụng mock data");
            return MOCK_PROPERTIES;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định khi fetch Google Sheets";
            setError(errorMessage);
            console.error("❌ Lỗi fetch Google Sheets:", err);
            return MOCK_PROPERTIES;
        } finally {
            setIsLoading(false);
        }
    }, [config]);

    // CREATE - Thêm mới property (append vào cuối sheet)
    const createProperty = useCallback(async (property: Property): Promise<Property | null> => {
        setIsLoading(true);
        setError(null);

        try {
            if (!config.spreadsheetId) {
                console.log("🔹 Không thể tạo property (thiếu spreadsheet ID)");
                return null;
            }

            if (config.googleClientEmail && config.googlePrivateKey) {
                console.log("🔹 Đang thêm mới property vào Google Sheets...");
                
                // Append property vào sheet
                const success = await appendToGoogleSheets(
                    config.spreadsheetId,
                    config.googleClientEmail,
                    config.googlePrivateKey,
                    [property],
                    `${SHEET_1}!A:AJ`
                );

                if (success) {
                    console.log('✅ Created property successfully');
                    return property;
                } else {
                    throw new Error('Failed to append to Google Sheets');
                }
            }

            console.log("🔹 Không thể tạo property (thiếu Service Account credentials)");
            return null;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định khi tạo property";
            setError(errorMessage);
            console.error("❌ Lỗi create property:", err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [config]);

    // UPDATE - Cập nhật property (cập nhật theo ID)
    const updateProperty = useCallback(async (property: Property): Promise<Property | null> => {
        setIsLoading(true);
        setError(null);

        try {
            if (!config.spreadsheetId) {
                console.log("🔹 Không thể cập nhật property (thiếu spreadsheet ID)");
                return null;
            }

            if (config.googleClientEmail && config.googlePrivateKey) {
                console.log("🔹 Đang cập nhật property trong Google Sheets...");
                
                // Fetch current properties để tìm row index
                const currentProperties = await fetchProperties();
                const existingIndex = currentProperties.findIndex(p => p.id === property.id);
                
                if (existingIndex === -1) {
                    throw new Error('Property not found');
                }

                // Update property theo row index (row 2 = index 0)
                const success = await updateGoogleSheetsRow(
                    config.spreadsheetId,
                    config.googleClientEmail,
                    config.googlePrivateKey,
                    property,
                    existingIndex + 2,
                    `${SHEET_1}!A:AJ`
                );

                if (success) {
                    console.log('✅ Updated property successfully');
                    return property;
                } else {
                    throw new Error('Failed to update Google Sheets');
                }
            }

            console.log("🔹 Không thể cập nhật property (thiếu Service Account credentials)");
            return null;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định khi cập nhật property";
            setError(errorMessage);
            console.error("❌ Lỗi update property:", err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [config, fetchProperties]);

    // DELETE - Xóa property (xóa theo ID)
    const deleteProperty = useCallback(async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            if (!config.spreadsheetId) {
                console.log("🔹 Không thể xóa property (thiếu spreadsheet ID)");
                return false;
            }

            if (config.googleClientEmail && config.googlePrivateKey) {
                console.log("🔹 Đang xóa property trong Google Sheets...");
                
                // Fetch current properties để tìm row index
                const currentProperties = await fetchProperties();
                const existingIndex = currentProperties.findIndex(p => p.id === id);
                
                if (existingIndex === -1) {
                    throw new Error('Property not found');
                }

                // Xóa row theo index
                const success = await deleteFromGoogleSheets(
                    config.spreadsheetId,
                    config.googleClientEmail,
                    config.googlePrivateKey,
                    existingIndex + 2,
                    `${SHEET_1}!A:AJ`
                );

                if (success) {
                    console.log('✅ Deleted property successfully');
                    return true;
                } else {
                    throw new Error('Failed to delete from Google Sheets');
                }
            }

            console.log("🔹 Không thể xóa property (thiếu Service Account credentials)");
            return false;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định khi xóa property";
            setError(errorMessage);
            console.error("❌ Lỗi delete property:", err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [config, fetchProperties]);

    // SYNC - Đồng bộ toàn bộ dữ liệu (ghi đè)
    const syncProperties = useCallback(async (
        properties: Property[]
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            if (!config.spreadsheetId) {
                console.log("🔹 Không thể sync lên Google Sheets (thiếu spreadsheet ID)");
                return false;
            }

            if (config.googleClientEmail && config.googlePrivateKey) {
                console.log("🔹 Đang sync dữ liệu lên Google Sheets với Service Account...");
                await updateGoogleSheetsWithServiceAccount(
                    config.spreadsheetId,
                    config.googleClientEmail,
                    config.googlePrivateKey,
                    properties,
                    `${SHEET_1}!A:AJ`
                );
                console.log("✅ Đã sync thành công lên Google Sheets");
                return true;
            }

            console.log("🔹 Không thể sync lên Google Sheets (thiếu Service Account credentials)");
            return false;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định khi sync Google Sheets";
            setError(errorMessage);
            console.error("❌ Lỗi sync Google Sheets:", err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [config]);

    // Upload 1 ảnh với retry
    const uploadSingleImage = async (file: File, webhookUrl: string, retryCount: number = 0): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(webhookUrl, {
                method: "POST",
                body: formData
            });

            if (response.status === 429) {
                const errorData = await response.json();
                const retryAfter = errorData.retry_after || 1;
                console.log(`⏳ Rate limited, waiting ${retryAfter}s before retry...`);
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000 + 500));

                if (retryCount < 3) {
                    return uploadSingleImage(file, webhookUrl, retryCount + 1);
                } else {
                    throw new Error(`Rate limit exceeded after ${retryCount} retries`);
                }
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Discord API error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            const imageUrl = result.attachments?.[0]?.url;

            if (!imageUrl) {
                throw new Error('No image URL in Discord response');
            }

            return imageUrl;
        } catch (err) {
            console.error("❌ Lỗi upload ảnh lên Discord:", err);
            throw err;
        }
    };

    // Upload nhiều ảnh tuần tự với progress
    const uploadMultipleImages = useCallback(async (
        files: File[],
        onProgress?: (current: number, total: number) => void
    ): Promise<string[]> => {
        let webhookUrl = config.discordWebhookUrl || config.discordWebhookUrl2;

        if (!webhookUrl) {
            webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || "";
        }

        if (!webhookUrl) {
            console.warn("⚠️ Không có Discord Webhook URL, sử dụng fake URLs");
            return files.map(file => URL.createObjectURL(file));
        }

        const urls: string[] = [];
        const total = files.length;

        for (let i = 0; i < total; i++) {
            const file = files[i];
            console.log(`📤 Uploading image ${i + 1}/${total}...`);

            try {
                const url = await uploadSingleImage(file, webhookUrl);
                urls.push(url);
                console.log(`✅ Uploaded image ${i + 1}/${total}`);

                if (onProgress) {
                    onProgress(i + 1, total);
                }

                if (i < total - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            } catch (err) {
                console.error(`❌ Failed to upload image ${i + 1}:`, err);
                urls.push(URL.createObjectURL(file));
                if (onProgress) {
                    onProgress(i + 1, total);
                }
            }
        }

        return urls;
    }, [config.discordWebhookUrl, config.discordWebhookUrl2]);

    const uploadImageToDiscord = useCallback(async (file: File): Promise<{ success: boolean; url: string }> => {
        let webhookUrl = config.discordWebhookUrl || config.discordWebhookUrl2;

        if (!webhookUrl) {
            webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || "";
        }

        if (!webhookUrl) {
            console.warn("⚠️ Không có Discord Webhook URL, sử dụng fake URL");
            const fakeUrl = URL.createObjectURL(file);
            return { success: true, url: fakeUrl };
        }

        try {
            const url = await uploadSingleImage(file, webhookUrl);
            return { success: true, url };
        } catch (err) {
            console.error("❌ Lỗi upload ảnh lên Discord:", err);
            return { success: true, url: URL.createObjectURL(file) };
        }
    }, [config.discordWebhookUrl, config.discordWebhookUrl2]);

    return {
        isLoading,
        error,
        uploadProgress,
        fetchProperties,
        createProperty,
        updateProperty,
        deleteProperty,
        syncProperties,
        uploadImageToDiscord,
        uploadMultipleImages,
    };
};