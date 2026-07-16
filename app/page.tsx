"use client";

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { HomeScreen } from '@/components/frontend/HomeScreen';
import { AppContext } from './Providers';
import Head from 'next/head';

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
    <>
      <Head>
        <title>Nhà Phố Sài Gòn - Bất động sản uy tín tại Sài Gòn</title>
        <meta name="description" content="Nhà Phố Sài Gòn - Chuyên mua bán bất động sản tại khu vực Sài Gòn. Căn hộ, nhà phố, biệt thự với giá tốt nhất." />
        <meta property="og:title" content="Nhà Phố Sài Gòn - Bất động sản uy tín tại Sài Gòn" />
        <meta property="og:description" content="Nhà Phố Sài Gòn - Chuyên mua bán bất động sản tại khu vực Sài Gòn." />
        <meta property="og:image" content="https://nhaphosaigon.com/og-image.jpg" />
      </Head>
      <HomeScreen
        properties={properties}
        navigateTo={navigateTo}
        setFilters={setFilters}
        onSync={handleSyncData}
        isLoading={isLoading}
      />
    </>

  );
}