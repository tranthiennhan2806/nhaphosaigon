"use client";

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../../Providers';
import ListingsScreen from '../../../components/frontend/ListingsScreen';

export default function ListingsPage() {
    const router = useRouter();
    const { properties, filters, setFilters, handleSyncData, isLoading: contextLoading } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);

    // Load dữ liệu từ Google Sheets khi vào trang
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Gọi sync data từ Google Sheets
                await handleSyncData();
            } catch (error) {
                console.error('❌ Error loading listings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData();
    }, []);

    const navigateTo = (tab: string, id?: string) => {
        if (tab === 'detail' && id) {
            router.push(`/property/${id}`);
        } else if (tab === 'home') {
            router.push('/');
        } else {
            router.push('/listings');
        }
    };


    return (
        <ListingsScreen
            properties={properties}
            filters={filters}
            setFilters={setFilters}
            navigateTo={navigateTo}
            isLoading={isLoading || contextLoading}
        />
    );
}