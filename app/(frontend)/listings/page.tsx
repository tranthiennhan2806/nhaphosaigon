"use client";

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../../Providers';
import ListingsScreen from '../../../components/frontend/ListingsScreen';

export default function ListingsPage() {
    const router = useRouter();
    const { properties, filters, setFilters } = useContext(AppContext);

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
        />
    );
}