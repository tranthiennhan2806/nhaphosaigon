"use client";

import React, { useContext, useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DetailScreen } from '@/components/frontend/DetailScreen';
import { AppContext } from '@/app/Providers';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function PropertyDetailPage({ params }: PageProps) {
    const router = useRouter();
    const { id } = React.use(params);
    const { properties, isLoading: contextLoading, handleSyncData } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);

    // Load dữ liệu nếu chưa có
    useEffect(() => {
        const loadData = async () => {
            // Nếu properties trống hoặc không tìm thấy property với id, fetch lại
            if (properties.length === 0 || !properties.find(p => p.id === id)) {
                await handleSyncData();
            }
            setIsLoading(false);
        };
        
        loadData();
    }, [properties, id, handleSyncData]);

    const navigateTo = (tab: string, id?: string) => {
        if (tab === 'detail' && id) {
            router.push(`/property/${id}`);
        } else if (tab === 'listings') {
            router.push('/listings');
        } else {
            router.push('/');
        }
    };

    const property = useMemo(() => {
        const found = properties.find(p => p.id === id);
        return found || null;
    }, [properties, id]);

    // Đang loading
    if (isLoading || contextLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white mx-auto"></div>
                    <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    // Không tìm thấy property
    if (!property) {
        return (
            <div className="text-center py-12">
                <p className="dark:text-white uppercase tracking-wider text-xs">Không tìm thấy không gian.</p>
                <button
                    onClick={() => navigateTo('listings')}
                    className="text-neutral-500 hover:underline text-xs uppercase mt-4"
                >
                    Trở lại danh sách
                </button>
            </div>
        );
    }

    return (
        <DetailScreen
            property={property}
            navigateTo={navigateTo}
            properties={properties}
        />
    );
}