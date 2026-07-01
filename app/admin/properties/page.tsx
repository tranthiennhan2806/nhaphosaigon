"use client";

import React, { useState, useEffect } from 'react';
import { AdminProperties } from '@/components/admin/AdminProperties';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { Property, AppConfig } from '@/types';

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load config từ environment variables
    const config: AppConfig = {
        spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID || "",
        googleApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
        googleClientEmail: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL || "",
        googlePrivateKey: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY || "",
        discordWebhookUrl: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || "",
        discordWebhookUrl2: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL_2 || "",
        isUsingMock: false
    };

    // Lấy tất cả functions từ hook
    const {
        fetchProperties,
        uploadImageToDiscord,
        uploadMultipleImages,
        createProperty,
        updateProperty,
        deleteProperty,
        syncProperties
    } = useGoogleSheets(config);

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchProperties();
            // Chỉ set dữ liệu thực từ Google Sheets, không dùng mock
            setProperties(data || []);
            console.log(`✅ Loaded ${data?.length || 0} properties from Google Sheets`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
            setError(errorMessage);
            console.error('❌ Error loading properties:', error);
            // Không set mock data, giữ properties là mảng rỗng
            setProperties([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm sync lên Google Sheets
    const handleSyncToGoogleSheet = async (props: Property[]): Promise<boolean> => {
        try {
            const success = await syncProperties(props);
            if (success) {
                console.log('✅ Synced to Google Sheets successfully');
                // Sau khi sync thành công, refresh lại dữ liệu
                await loadProperties();
            } else {
                console.error('❌ Failed to sync to Google Sheets');
            }
            return success;
        } catch (error) {
            console.error('❌ Error syncing to Google Sheets:', error);
            return false;
        }
    };

    // Nếu có lỗi, hiển thị thông báo
    if (error) {
        return (
            <div className="p-6">
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 p-6 rounded-lg">
                    <h3 className="text-rose-600 dark:text-rose-400 font-semibold text-sm uppercase tracking-wider">
                        ❌ Lỗi kết nối Google Sheets
                    </h3>
                    <p className="text-rose-600 dark:text-rose-400 text-sm mt-2">
                        {error}
                    </p>
                    <button
                        onClick={loadProperties}
                        className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs uppercase tracking-wider rounded transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AdminProperties
            properties={properties}
            setProperties={setProperties}
            isLoading={isLoading}
            onRefresh={loadProperties}
            uploadImageToDiscord={uploadImageToDiscord}
            uploadMultipleImages={uploadMultipleImages}
            onCreateProperty={createProperty}
            onUpdateProperty={updateProperty}
            onDeleteProperty={deleteProperty}
            syncToGoogleSheet={handleSyncToGoogleSheet}
        />
    );
}