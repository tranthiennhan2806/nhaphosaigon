"use client";

import React, { useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DetailScreen } from '@/components/frontend/DetailScreen';
import { AppContext } from '@/app/Providers';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function PropertyDetailPage({ params }: PageProps) {
    const router = useRouter();
    const { id } = React.use(params);
    const { properties } = useContext(AppContext);

    // Debug: Log properties để kiểm tra
    console.log('🔍 PropertyDetailPage - properties count:', properties.length);
    console.log('🔍 PropertyDetailPage - looking for id:', id);
    console.log('🔍 PropertyDetailPage - all property IDs:', properties.map(p => p.id));

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
        console.log('🔍 PropertyDetailPage - found property:', found ? found.id : 'NOT FOUND');
        return found || properties[0];
    }, [properties, id]);

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