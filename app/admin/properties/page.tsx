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

    const { fetchProperties, uploadImageToDiscord } = useGoogleSheets(config);

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

    return (
        <AdminProperties
            properties={properties}
            setProperties={setProperties}
            isLoading={isLoading}
            onRefresh={loadProperties}
            uploadImageToDiscord={uploadImageToDiscord}
        />
    );
}