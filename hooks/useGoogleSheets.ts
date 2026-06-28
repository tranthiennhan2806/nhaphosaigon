import { useState, useCallback } from 'react';
import { Property, AppConfig } from '@/types';
import {
    fetchFromGoogleSheetsWithServiceAccount,
    updateGoogleSheetsWithServiceAccount,
    fetchFromGoogleSheets
} from '@/utils/googleSheets';
import { MOCK_PROPERTIES } from '@/configs/constants';

export const useGoogleSheets = (config: AppConfig) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
                    config.googlePrivateKey
                );
                console.log(`✅ Đã fetch ${properties.length} properties từ Google Sheets`);
                return properties;
            }

            if (config.googleApiKey) {
                console.log("🔹 Đang fetch dữ liệu từ Google Sheets với API Key...");
                const properties = await fetchFromGoogleSheets(
                    config.spreadsheetId,
                    config.googleApiKey
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
                    properties
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

    const uploadImageToDiscord = useCallback(async (file: File): Promise<{ success: boolean; url: string }> => {
        const webhookUrl = config.discordWebhookUrl || config.discordWebhookUrl2;

        if (!webhookUrl) {
            console.warn("⚠️ Không có Discord Webhook URL, sử dụng fake URL");
            return new Promise((resolve) => {
                const fakeUrl = URL.createObjectURL(file);
                setTimeout(() => {
                    resolve({ success: true, url: fakeUrl });
                }, 500);
            });
        }

        try {
            const formData = new FormData();
            formData.append("files[0]", file);

            const response = await fetch(webhookUrl, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Discord API error: ${response.statusText}`);
            }

            const result = await response.json();
            const imageUrl = result.attachments?.[0]?.url ||
                `https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80&rand=${Date.now()}`;

            return { success: true, url: imageUrl };
        } catch (err) {
            console.error("❌ Lỗi upload ảnh lên Discord:", err);
            // Fallback: trả về URL tạm thời
            return { success: true, url: URL.createObjectURL(file) };
        }
    }, [config.discordWebhookUrl, config.discordWebhookUrl2]);

    return {
        isLoading,
        error,
        fetchProperties,
        syncProperties,
        uploadImageToDiscord
    };
};