"use client";

import React, { useContext, useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
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

    // Lấy domain từ window.location hoặc dùng domain mặc định
    const getBaseUrl = () => {
        if (typeof window !== 'undefined') {
            return window.location.origin;
        }
        // Fallback cho server-side
        return process.env.NEXT_PUBLIC_BASE_URL || 'https://nhaphosaigon.vercel.app';
    };

    // Load dữ liệu nếu chưa có
    useEffect(() => {
        const loadData = async () => {
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

    // Format price for meta
    const formatPriceForMeta = (price: number) => {
        if (price >= 1000000000) {
            return `${(price / 1000000000).toFixed(1)} tỷ`;
        }
        if (price >= 1000000) {
            return `${(price / 1000000).toFixed(1)} triệu`;
        }
        return `${price.toLocaleString('vi-VN')} VNĐ`;
    };

    // Get meta data
    const getMetaData = () => {
        const baseUrl = getBaseUrl();

        if (!property) {
            return {
                title: 'Nhà Phố Sài Gòn - Bất động sản',
                description: 'Tìm kiếm bất động sản tại Sài Gòn',
                image: `${baseUrl}/og-image.jpg`,
                ogImageUrl: `${baseUrl}/api/og?title=Nhà%20Phố%20Sài%20Gòn`,
                url: `${baseUrl}/property/${id}`,
            };
        }

        // Lấy ảnh đầu tiên của property làm OG Image
        const firstImage = property.images && property.images.length > 0
            ? property.images[0]
            : null;

        // Tạo tiêu đề ngắn gọn (giới hạn 60-70 ký tự)
        const shortTitle = property.title.length > 60
            ? property.title.substring(0, 57) + '...'
            : property.title;

        const title = `${shortTitle} - ${formatPriceForMeta(property.price)}`;
        const description = `${property.title} tại ${property.address}. Diện tích ${property.area}m², ${property.bedrooms} PN, ${property.bathrooms} WC. Giá ${formatPriceForMeta(property.price)}.`;

        // DÙNG ẢNH THẬT CỦA PROPERTY LÀM OG IMAGE
        // Nếu có ảnh thật, dùng ảnh đó, không cần tạo dynamic
        const ogImageUrl = firstImage || `${baseUrl}/api/og?title=${encodeURIComponent(property.title)}&price=${encodeURIComponent(formatPriceForMeta(property.price))}&area=${property.area}`;

        const url = `${baseUrl}/property/${property.id}`;

        return { title, description, image: ogImageUrl, ogImageUrl, url };
    };

    const meta = getMetaData();

    // Đang loading
    if (isLoading || contextLoading) {
        return (
            <>
                <Head>
                    <title>Đang tải... | Nhà Phố Sài Gòn</title>
                    <meta property="og:title" content="Đang tải..." />
                    <meta property="og:image" content={meta.ogImageUrl} />
                </Head>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white mx-auto"></div>
                        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </>
        );
    }

    // Không tìm thấy property
    if (!property) {
        return (
            <>
                <Head>
                    <title>Không tìm thấy | Nhà Phố Sài Gòn</title>
                    <meta name="robots" content="noindex" />
                </Head>
                <div className="text-center py-12">
                    <p className="dark:text-white uppercase tracking-wider text-xs">Không tìm thấy không gian.</p>
                    <button
                        onClick={() => navigateTo('listings')}
                        className="text-neutral-500 hover:underline text-xs uppercase mt-4"
                    >
                        Trở lại danh sách
                    </button>
                </div>
            </>
        );
    }

    // Schema.org structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": property.title,
        "description": property.description,
        "url": meta.url,
        "image": property.images && property.images.length > 0 ? property.images[0] : undefined,
        "price": property.price,
        "priceCurrency": "VND",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": property.district,
            "addressCountry": "VN"
        },
        "floorSize": {
            "@type": "QuantitativeValue",
            "value": property.area,
            "unitCode": "MTK"
        },
        "numberOfRooms": property.bedrooms,
        "numberOfBathroomsTotal": property.bathrooms,
    };

    return (
        <>
            {/* Meta Tags for SEO - ĐẶT Ở ĐẦU TRANG */}
            <Head>
                {/* Title - Quan trọng nhất */}
                <title>{meta.title}</title>
                <meta name="title" content={meta.title} />
                <meta name="description" content={meta.description} />

                {/* Open Graph / Facebook - BẮT BUỘC CHO ZALO/FACEBOOK */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={meta.url} />
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:image" content={meta.ogImageUrl} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content={property.title} />
                <meta property="og:site_name" content="Nhà Phố Sài Gòn" />
                <meta property="og:locale" content="vi_VN" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={meta.url} />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />
                <meta name="twitter:image" content={meta.ogImageUrl} />
                <meta name="twitter:image:alt" content={property.title} />

                {/* Additional SEO */}
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content={`bất động sản, nhà đất, ${property.district}, ${property.title}, bán nhà, mua nhà, ${property.houseType}`} />
                <link rel="canonical" href={meta.url} />

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </Head>

            <DetailScreen
                property={property}
                navigateTo={navigateTo}
                properties={properties}
            />
        </>
    );
}