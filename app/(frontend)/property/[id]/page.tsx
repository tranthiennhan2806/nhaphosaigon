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
        if (!property) {
            return {
                title: 'Nhà Phố Sài Gòn - Bất động sản',
                description: 'Tìm kiếm bất động sản tại Sài Gòn',
                image: 'https://nhaphosaigon.com/og-image.jpg',
                ogImageUrl: 'https://nhaphosaigon.com/api/og?title=Nhà%20Phố%20Sài%20Gòn',
                url: 'https://nhaphosaigon.com/property/' + id,
            };
        }

        const title = `${property.title} - ${formatPriceForMeta(property.price)} | Nhà Phố Sài Gòn`;
        const description = `${property.title} tại ${property.address}. Diện tích ${property.area}m², ${property.bedrooms} phòng ngủ, ${property.bathrooms} toilet. Giá ${formatPriceForMeta(property.price)}.`;
        
        // Tạo OG Image URL động
        const ogImageUrl = `https://nhaphosaigon.com/api/og?title=${encodeURIComponent(property.title)}&price=${encodeURIComponent(formatPriceForMeta(property.price))}&area=${property.area}`;
        
        // Fallback image nếu không có ảnh
        const image = property.images && property.images.length > 0 
            ? property.images[0] 
            : 'https://nhaphosaigon.com/og-image.jpg';
            
        const url = `https://nhaphosaigon.com/property/${property.id}`;

        return { title, description, image, ogImageUrl, url };
    };

    const meta = getMetaData();

    // Đang loading
    if (isLoading || contextLoading) {
        return (
            <>
                <Head>
                    <title>Đang tải... | Nhà Phố Sài Gòn</title>
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

    // Schema.org structured data for real estate
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": property.title,
        "description": property.description,
        "url": `https://nhaphosaigon.com/property/${property.id}`,
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
        "amenityFeature": [
            ...(property.hasConstructionApproval ? [{
                "@type": "LocationFeatureSpecification",
                "name": "Đã hoàn công",
                "value": true
            }] : []),
            ...(property.hasBuildingPermit ? [{
                "@type": "LocationFeatureSpecification",
                "name": "Có giấy phép xây dựng",
                "value": true
            }] : [])
        ]
    };

    return (
        <>
            {/* Meta Tags for SEO */}
            <Head>
                {/* Primary Meta Tags */}
                <title>{meta.title}</title>
                <meta name="title" content={meta.title} />
                <meta name="description" content={meta.description} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={meta.url} />
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                
                {/* SỬ DỤNG OG IMAGE URL ĐỘNG */}
                <meta property="og:image" content={meta.ogImageUrl} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content={property.title} />
                <meta property="og:site_name" content="Nhà Phố Sài Gòn" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={meta.url} />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />
                
                {/* SỬ DỤNG TWITTER IMAGE ĐỘNG */}
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