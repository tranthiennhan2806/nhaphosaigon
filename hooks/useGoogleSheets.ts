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

// Định nghĩa tên sheet
const SHEET_1 = 'bds';

// Helper để chuyển đổi URL Discord sang media.discordapp.net
const convertDiscordImageUrl = (url: string): string => {
    if (!url) return url;

    // Nếu là URL của Discord, chuyển sang media.discordapp.net
    if (url.includes('cdn.discordapp.com')) {
        return url.replace('cdn.discordapp.com', 'media.discordapp.net');
    }

    return url;
};

export const useGoogleSheets = (config: AppConfig) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; status: string }>({ current: 0, total: 0, status: '' });

    const fetchProperties = useCallback(async (): Promise<Property[]> => {
        setIsLoading(true);
        setError(null);

        try {
            if (!config.spreadsheetId) {
                throw new Error("Thiếu spreadsheet ID");
            }

            if (config.googleClientEmail && config.googlePrivateKey) {
                const properties = await fetchFromGoogleSheetsWithServiceAccount(
                    config.spreadsheetId,
                    config.googleClientEmail,
                    config.googlePrivateKey,
                    `${SHEET_1}!A1:AK`
                );
                return properties; // Trả về mảng rỗng nếu không có dữ liệu
            }

            if (config.googleApiKey) {
                const properties = await fetchFromGoogleSheets(
                    config.spreadsheetId,
                    config.googleApiKey,
                    `${SHEET_1}!A2:AK`
                );
                return properties; // Trả về mảng rỗng nếu không có dữ liệu
            }

            throw new Error("Không có phương thức xác thực");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định khi fetch Google Sheets";
            setError(errorMessage);
            throw err; // Throw lỗi để component xử lý
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
                throw new Error("Thiếu spreadsheet ID");
            }

            if (config.googleClientEmail && config.googlePrivateKey) {
                // Đảm bảo ID là duy nhất
                const newProperty = {
                    ...property,
                    id: property.id || `prop-${Date.now()}`
                };

                const success = await appendToGoogleSheets(
                    config.spreadsheetId,
                    config.googleClientEmail,
                    config.googlePrivateKey,
                    [newProperty],
                    `${SHEET_1}!A:AK`
                );

                if (success) {
                    return newProperty;
                } else {
                    throw new Error('Failed to append to Google Sheets');
                }
            }

            throw new Error("Không có Service Account credentials");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định khi tạo property";
            setError(errorMessage);
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
                throw new Error("Thiếu spreadsheet ID");
            }

            if (config.googleClientEmail && config.googlePrivateKey) {
                // Fetch current properties để tìm row index
                const currentProperties = await fetchProperties();
                const existingIndex = currentProperties.findIndex(p => p.id === property.id);

                if (existingIndex === -1) {
                    throw new Error(`Property with ID ${property.id} not found`);
                }

                // Giữ nguyên ID khi update
                const updateData = {
                    ...property,
                    id: property.id // Giữ nguyên ID
                };

                const success = await updateGoogleSheetsRow(
                    config.spreadsheetId,
                    config.googleClientEmail,
                    config.googlePrivateKey,
                    updateData,
                    existingIndex + 2,
                    `${SHEET_1}!A:AK`
                );

                if (success) {
                    return updateData;
                } else {
                    throw new Error('Failed to update Google Sheets');
                }
            }

            throw new Error("Không có Service Account credentials");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định khi cập nhật property";
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [config, fetchProperties]);

    // DELETE - Xóa property (xóa theo ID)
    // DELETE - Xóa property (xóa theo ID)
    const deleteProperty = useCallback(async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            if (!config.spreadsheetId) {
                throw new Error("Thiếu spreadsheet ID");
            }

            if (config.googleClientEmail && config.googlePrivateKey) {
                const currentProperties = await fetchProperties();

                // Nếu không tìm thấy property
                const existingIndex = currentProperties.findIndex(p => p.id === id);
                if (existingIndex === -1) {
                    throw new Error(`Property with ID ${id} not found`);
                }

                // Nếu chỉ có 1 property, xóa toàn bộ sheet
                if (currentProperties.length === 1) {
                    console.log('🔹 Xóa property cuối cùng, xóa toàn bộ sheet...');
                    // Clear toàn bộ sheet và để trống
                    await updateGoogleSheetsWithServiceAccount(
                        config.spreadsheetId,
                        config.googleClientEmail,
                        config.googlePrivateKey,
                        [],
                        `${SHEET_1}!A:AK`
                    );
                    console.log('✅ Sheet cleared successfully');
                    return true;
                }

                // Xóa row theo index
                const success = await deleteFromGoogleSheets(
                    config.spreadsheetId,
                    config.googleClientEmail,
                    config.googlePrivateKey,
                    existingIndex + 2,
                    `${SHEET_1}!A:AK`
                );

                if (success) {
                    return true;
                } else {
                    throw new Error('Failed to delete from Google Sheets');
                }
            }

            throw new Error("Không có Service Account credentials");
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
                throw new Error("Thiếu spreadsheet ID");
            }

            if (config.googleClientEmail && config.googlePrivateKey) {
                await updateGoogleSheetsWithServiceAccount(
                    config.spreadsheetId,
                    config.googleClientEmail,
                    config.googlePrivateKey,
                    properties,
                    `${SHEET_1}!A:AK`
                );
                return true;
            }

            throw new Error("Không có Service Account credentials");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định khi sync Google Sheets";
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [config]);

    // Upload 1 ảnh với retry và convert URL
    const uploadSingleImage = async (file: File, webhookUrl: string, retryCount: number = 0): Promise<string> => {
        try {
            // Kiểm tra kích thước file
            if (file.size > 25 * 1024 * 1024) {
                console.warn(`⚠️ File ${file.name} is too large (${file.size} bytes), using fallback`);
                return URL.createObjectURL(file);
            }

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(webhookUrl, {
                method: "POST",
                body: formData
            });

            // Xử lý rate limit
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

            // Xử lý lỗi webhook
            if (response.status === 404) {
                throw new Error('Webhook not found. Please check your Discord webhook URL.');
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Discord API error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            let imageUrl = result.attachments?.[0]?.url;

            if (!imageUrl) {
                throw new Error('No image URL in Discord response');
            }

            // ✅ QUAN TRỌNG: Chuyển đổi URL từ cdn.discordapp.com sang media.discordapp.net
            // để đảm bảo ảnh hiển thị lâu dài hơn
            imageUrl = convertDiscordImageUrl(imageUrl);

            // Thêm cache buster để refresh ảnh
            const cacheBuster = `&t=${Date.now()}`;
            if (imageUrl.includes('?')) {
                imageUrl = imageUrl + cacheBuster;
            } else {
                imageUrl = imageUrl + '?' + cacheBuster.slice(1);
            }

            console.log('✅ Image URL converted to:', imageUrl);
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

        // Nếu không có webhook, dùng URL tạm thời
        if (!webhookUrl) {
            console.warn("⚠️ Không có Discord Webhook URL, sử dụng fake URLs");
            return files.map(file => URL.createObjectURL(file));
        }

        // Kiểm tra webhook có hoạt động không
        try {
            const testResponse = await fetch(webhookUrl, { method: 'HEAD' });
            if (!testResponse.ok) {
                console.warn(`⚠️ Webhook URL không hoạt động (${testResponse.status}), sử dụng fake URLs`);
                return files.map(file => URL.createObjectURL(file));
            }
        } catch (error) {
            console.warn('⚠️ Không thể kiểm tra webhook, sử dụng fake URLs');
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

                // Delay giữa các lần upload để tránh rate limit
                if (i < total - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            } catch (err) {
                console.error(`❌ Failed to upload image ${i + 1}:`, err);
                // Fallback: dùng URL tạm thời
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
            // Fallback: trả về URL tạm thời
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