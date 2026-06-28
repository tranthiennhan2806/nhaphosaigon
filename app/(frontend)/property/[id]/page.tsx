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
    // Unwrap params using React.use()
    const { id } = React.use(params);
    const { properties } = useContext(AppContext);

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
        return properties.find(p => p.id === id) || properties[0];
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