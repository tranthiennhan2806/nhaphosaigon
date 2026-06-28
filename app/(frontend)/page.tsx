"use client";

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { HomeScreen } from '@/components/frontend/HomeScreen';
import { AppContext } from '@/app/Providers';

export default function HomePage() {
    const router = useRouter();
    const {
        properties,
        setFilters,
        isLoading,
        handleSyncData,
    } = useContext(AppContext);

    const navigateTo = (tab: string, id?: string) => {
        if (tab === 'detail' && id) {
            router.push(`/property/${id}`);
        } else if (tab === 'listings') {
            router.push('/listings');
        } else if (tab === 'admin') {
            router.push('/admin/login');
        } else if (tab === 'settings') {
            router.push('/settings');
        } else {
            router.push('/');
        }
    };

    return (
        <HomeScreen
            properties={properties}
            navigateTo={navigateTo}
            setFilters={setFilters}
            onSync={handleSyncData}
            isLoading={isLoading}
        />
    );
}