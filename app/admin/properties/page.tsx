"use client";

import React, { useState, useEffect } from 'react';
import { AdminProperties } from '@/components/admin/AdminProperties';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { Property } from '@/types';
import { MOCK_PROPERTIES } from '@/configs/constants';

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const config = {
        spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID || "",
        googleApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
        googleClientEmail: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL || "",
        googlePrivateKey: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY || "",
        discordWebhookUrl: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || "",
        discordWebhookUrl2: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL_2 || "",
        isUsingMock: true
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
        try {
            const data = await fetchProperties();
            setProperties(data);
        } catch (error) {
            console.error('Error loading properties:', error);
            setProperties(MOCK_PROPERTIES);
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
            } else {
                console.error('❌ Failed to sync to Google Sheets');
            }
            return success;
        } catch (error) {
            console.error('❌ Error syncing to Google Sheets:', error);
            return false;
        }
    };

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