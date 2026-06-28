"use client";

import { AdminSettings } from '@/components/admin/AdminSettings';
import React, { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
    const [config, setConfig] = useState({
        spreadsheetId: '',
        googleClientEmail: '',
        googlePrivateKey: '',
        discordWebhookUrl: '',
        discordWebhookUrl2: '',
    });

    useEffect(() => {
        // Load config from localStorage
        const savedConfig = localStorage.getItem('realestate_config');
        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig);
                setConfig(parsed);
            } catch (e) { }
        }
    }, []);

    const handleSave = (newConfig: typeof config) => {
        setConfig(newConfig);
        localStorage.setItem('realestate_config', JSON.stringify(newConfig));
    };

    return <AdminSettings config={config} onSave={handleSave} />;
}