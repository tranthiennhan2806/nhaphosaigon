import React, { useState, useMemo, useEffect } from 'react';
import { Property } from '@/types';
import {
    ChevronLeft, Phone, MapPin, Bath, Bed, Maximize, Info,
    Building2, Ruler, Home, Navigation, Car, Users, DollarSign,
    CheckCircle, XCircle, AlertCircle, Shield, FileCheck, Eye, EyeOff,
    X, ChevronRight, Send, User, Smartphone, Loader2, Mail, Calendar,
    Clock, BadgeCheck, UserCog
} from 'lucide-react';
import PropertyCard from './PropertyCard';
import { formatPrice } from '@/utils/format';
import {
    HOUSE_TYPES,
    ALLEY_TYPES,
    FENG_SHUI_ISSUES,
    NEIGHBOR_TYPES,
    ALLEY_END_TYPES,
    DIRECTIONS,
    SALE_STATUSES
} from '@/configs/constants';

interface DetailScreenProps {
    property: Property;
    navigateTo: (tab: string, id?: string) => void;
    properties: Property[];
}

// Helper functions
const getHouseTypeLabel = (value: string) => {
    const found = HOUSE_TYPES.find(t => t.value === value);
    return found ? found.label : value;
};

const getAlleyTypeLabel = (value: string) => {
    const found = ALLEY_TYPES.find(t => t.value === value);
    return found ? found.label : value;
};

const getAlleyEndLabel = (value: string) => {
    const found = ALLEY_END_TYPES.find(t => t.value === value);
    return found ? found.label : value;
};

const getDirectionLabel = (value: string) => {
    const found = DIRECTIONS.find(d => d.value === value);
    return found ? found.label : value;
};

const getSaleStatusLabel = (value: string) => {
    const found = SALE_STATUSES.find(s => s.value === value);
    return found ? found.label : value;
};

const getFengShuiLabel = (value: string) => {
    const found = FENG_SHUI_ISSUES.find(f => f.value === value);
    return found ? found.label : value;
};

const getNeighborLabel = (value: string) => {
    const found = NEIGHBOR_TYPES.find(n => n.value === value);
    return found ? found.label : value;
};

export function DetailScreen({ property, navigateTo, properties }: DetailScreenProps) {
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
    const [isVisible, setIsVisible] = useState(true);
    const [showFullInfo, setShowFullInfo] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Form state
    const [consultantName, setConsultantName] = useState('');
    const [consultantPhone, setConsultantPhone] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [sendError, setSendError] = useState('');

    // Tạo mảng ảnh cho lightbox (chỉ admin mới thấy ảnh nhạy cảm)
    const allImages = useMemo(() => {
        const normalImages = property.images || [];

        if (isAdmin) {
            const sensitiveImages = property.sensitiveImages || [];
            return [
                ...normalImages.map(url => ({ url, type: 'normal' as const })),
                ...sensitiveImages.map(url => ({ url, type: 'sensitive' as const }))
            ];
        }

        return normalImages.map(url => ({ url, type: 'normal' as const }));
    }, [property.images, property.sensitiveImages, isAdmin]);

    // Kiểm tra role từ server
    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                if (!token) {
                    setIsAdmin(false);
                    setIsLoading(false);
                    return;
                }

                const response = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const user = await response.json();
                    setIsAdmin(user.role === 'admin' || user.role === 'editor');
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminStatus();
    }, []);

    const suggestions = useMemo(() => {
        return properties
            .filter(p => p.id !== property.id && p.district === property.district)
            .slice(0, 3);
    }, [properties, property]);

    // Lightbox functions
    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        document.body.style.overflow = 'unset';
    };

    const prevImage = () => {
        setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const nextImage = () => {
        setLightboxIndex((prev) => (prev + 1) % allImages.length);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, allImages.length]);

    // Gửi thông tin tư vấn đến Discord
    const sendConsultation = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!consultantName.trim() || !consultantPhone.trim()) {
            setSendError('Vui lòng điền đầy đủ họ tên và số điện thoại');
            return;
        }

        setIsSending(true);
        setSendError('');
        setSendSuccess(false);

        try {
            const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL_2 ||
                process.env.DISCORD_WEBHOOK_URL_2;

            if (!webhookUrl) {
                throw new Error('Không tìm thấy Discord Webhook URL');
            }

            const message = {
                content: `📋 **YÊU CẦU TƯ VẤN BẤT ĐỘNG SẢN**\n\n` +
                    `👤 **Họ tên:** ${consultantName}\n` +
                    `📱 **SĐT:** ${consultantPhone}\n` +
                    `🏠 **BĐS quan tâm:** ${property.title}\n` +
                    `📍 **Địa chỉ:** ${property.address}\n` +
                    `💰 **Giá:** ${formatPrice(property.price)}\n` +
                    `🆔 **Mã số:** ${property.id}\n\n` +
                    `🔗 **Link chi tiết:** ${window.location.href}`
            };

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            if (!response.ok) {
                throw new Error(`Lỗi gửi yêu cầu: ${response.status}`);
            }

            setSendSuccess(true);
            setConsultantName('');
            setConsultantPhone('');

            setTimeout(() => {
                setSendSuccess(false);
            }, 5000);
        } catch (error) {
            console.error('Error sending consultation:', error);
            setSendError(error instanceof Error ? error.message : 'Lỗi gửi yêu cầu. Vui lòng thử lại.');
        } finally {
            setIsSending(false);
        }
    };

    if (!property) {
        return (
            <div className="text-center py-12">
                <p className="dark:text-white uppercase tracking-wider text-xs">Không tìm thấy không gian.</p>
                <button onClick={() => navigateTo('listings')} className="text-neutral-500 hover:underline text-xs uppercase mt-4">Trở lại danh sách</button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white mx-auto"></div>
                    <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                style={{
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="space-y-8"
            >
                <button
                    onClick={() => navigateTo('listings')}
                    className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-3.5 h-3.5" /> QUAY LẠI DANH SÁCH TÌM KIẾM
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* GALLERY */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-3">
                            <div
                                className="relative h-[250px] sm:h-[450px] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-900 overflow-hidden cursor-pointer group"
                                onClick={() => openLightbox(activeImageIndex)}
                            >
                                <img
                                    key={activeImageIndex}
                                    src={allImages[activeImageIndex]?.url || "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80"}
                                    alt={property.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                    <Maximize className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                </div>

                                {isAdmin && allImages[activeImageIndex]?.type === 'sensitive' && (
                                    <span className="absolute top-4 right-4 px-3 py-1 text-[9px] tracking-widest uppercase font-bold z-10 bg-amber-500 text-white">
                                        🔒 NHẠY CẢM
                                    </span>
                                )}

                                <span className={`absolute top-4 left-4 px-3 py-1 text-[9px] tracking-widest uppercase font-bold z-10 ${property.saleStatus === 'da_ban'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                                    }`}>
                                    {getSaleStatusLabel(property.saleStatus)}
                                </span>

                                <span className="absolute bottom-4 right-4 bg-white/80 dark:bg-neutral-950/80 text-neutral-900 dark:text-white px-2.5 py-1 text-[10px] tracking-widest uppercase z-10">
                                    {allImages.length > 1 ? `${activeImageIndex + 1} / ${allImages.length}` : '1 ẢNH'}
                                </span>

                                <span className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 text-[9px] tracking-widest uppercase z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click để xem to
                                </span>
                            </div>

                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative w-20 h-14 overflow-hidden border-2 transition-all flex-shrink-0 ${activeImageIndex === idx ? 'border-neutral-950 dark:border-white' : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                            {isAdmin && img.type === 'sensitive' && (
                                                <span className="absolute bottom-0 left-0 right-0 bg-amber-500/80 text-white text-[6px] text-center py-0.5">
                                                    🔒
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PRICE & BASIC INFO */}
                        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-xl sm:text-2xl font-light tracking-wide dark:text-white">
                                    {property.title}
                                </h1>

                                {/* Địa chỉ - CHỈ ADMIN */}
                                {isAdmin && (
                                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs uppercase tracking-wider">
                                        <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                                        <span>{property.address}</span>
                                    </div>
                                )}

                                {/* Thông tin loại nhà - LUÔN HIỂN THỊ */}
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <Home className="w-3.5 h-3.5 text-neutral-400" />
                                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                        {getHouseTypeLabel(property.houseType)}
                                    </span>
                                    {property.houseType === 'chung_cu' && property.projectName && (
                                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                            • {property.projectName}
                                        </span>
                                    )}
                                    {property.houseType === 'chung_cu' && property.floorNumber > 0 && (
                                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                            • Tầng {property.floorNumber}
                                        </span>
                                    )}
                                    {/* Hướng nhà - CHỈ ADMIN */}
                                    {isAdmin && property.direction && property.direction !== 'khong_xac_dinh' && (
                                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                            • Hướng {getDirectionLabel(property.direction)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 border-t border-b border-neutral-100 dark:border-neutral-900 py-4 text-center">
                                <div>
                                    <span className="text-[10px] tracking-widest text-neutral-400 uppercase block mb-1">MỨC GIÁ</span>
                                    <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base">
                                        {formatPrice(property.price)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] tracking-widest text-neutral-400 uppercase block mb-1">DIỆN TÍCH</span>
                                    <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base">
                                        {property.area} M²
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] tracking-widest text-neutral-400 uppercase block mb-1">GIÁ/M²</span>
                                    <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base">
                                        ~ {(property.price / property.area / 1000000).toFixed(1)} TR
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* DETAILS */}
                        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-3">
                                <h3 className="font-semibold text-xs tracking-widest uppercase dark:text-white">
                                    THÔNG TIN CHI TIẾT
                                </h3>
                                {isAdmin && (
                                    <span className="flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 border border-emerald-200 dark:border-emerald-800">
                                        <Shield className="w-3 h-3" />
                                        ADMIN VIEW
                                    </span>
                                )}
                            </div>

                            {/* Thông tin cơ bản - Non-admin chỉ thấy phòng ngủ và toilet */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Bed className="w-4 h-4 text-neutral-400" />
                                    <div>
                                        <span className="text-[9px] text-neutral-400 block">PHÒNG NGỦ</span>
                                        <span className="font-semibold dark:text-white">{property.bedrooms} PHÒNG</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Bath className="w-4 h-4 text-neutral-400" />
                                    <div>
                                        <span className="text-[9px] text-neutral-400 block">TOILET</span>
                                        <span className="font-semibold dark:text-white">{property.bathrooms} PHÒNG</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-neutral-400" />
                                    <div>
                                        <span className="text-[9px] text-neutral-400 block">SỐ TẦNG</span>
                                        <span className="font-semibold dark:text-white">{property.floors} TẦNG</span>
                                    </div>
                                </div>
                                {/* Mã số - CHỈ ADMIN */}
                                {isAdmin && (
                                    <div className="flex items-center gap-2">
                                        <Info className="w-4 h-4 text-neutral-400" />
                                        <div>
                                            <span className="text-[9px] text-neutral-400 block">MÃ SỐ</span>
                                            <span className="font-mono text-xs font-bold dark:text-white uppercase">{property.id.slice(-6)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Thông tin hẻm - CHỈ ADMIN */}
                            {isAdmin && (property.alleyDepth > 0 || property.alleyType !== 'khac') && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                                    <div className="flex items-center gap-2">
                                        <Navigation className="w-4 h-4 text-neutral-400" />
                                        <div>
                                            <span className="text-[9px] text-neutral-400 block">VỊ TRÍ HẺM</span>
                                            <span className="font-semibold dark:text-white text-xs">
                                                Xẹt {property.alleyDepth}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Car className="w-4 h-4 text-neutral-400" />
                                        <div>
                                            <span className="text-[9px] text-neutral-400 block">LOẠI HẺM</span>
                                            <span className="font-semibold dark:text-white text-xs">
                                                {getAlleyTypeLabel(property.alleyType)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-neutral-400" />
                                        <div>
                                            <span className="text-[9px] text-neutral-400 block">HẺM</span>
                                            <span className={`font-semibold text-xs ${property.alleyEndType === 'cut' ? 'text-amber-600' : 'text-emerald-600'
                                                }`}>
                                                {getAlleyEndLabel(property.alleyEndType)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Kích thước đất - CHỈ ADMIN */}
                            {isAdmin && (property.width > 0 || property.length > 0) && (
                                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900">
                                    <div className="flex items-center gap-2">
                                        <Ruler className="w-4 h-4 text-neutral-400" />
                                        <div>
                                            <span className="text-[9px] text-neutral-400 block">KÍCH THƯỚC ĐẤT</span>
                                            <span className="font-semibold dark:text-white text-xs">
                                                Ngang {property.width}m x Dài {property.length}m
                                                {property.width > 0 && property.length > 0 && (
                                                    <span className="text-neutral-400 font-normal ml-2">
                                                        (Diện tích: {property.width * property.length} m²)
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pháp lý cơ bản - CHỈ ADMIN */}
                            {isAdmin && (
                                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900">
                                    <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">PHÁP LÝ</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <div className="flex items-center gap-2">
                                            {property.hasConstructionApproval ? (
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-rose-600" />
                                            )}
                                            <span className="text-[10px]">
                                                {property.hasConstructionApproval ? 'Đã hoàn công' : 'Chưa hoàn công'}
                                            </span>
                                        </div>
                                        {property.hasBuildingPermit && (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                <span className="text-[10px]">Có GPXD</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {property.isInExistingResidentialArea ? (
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-amber-600" />
                                            )}
                                            <span className="text-[10px]">
                                                {property.isInExistingResidentialArea ? 'KDC hiện hữu' : 'Đất mới'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mô tả - LUÔN HIỂN THỊ */}
                            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900">
                                <p className="text-neutral-500 dark:text-neutral-300 text-xs leading-relaxed whitespace-pre-wrap uppercase tracking-wider">
                                    {property.description}
                                </p>
                            </div>

                            {/* Ghi chú - CHỈ ADMIN */}
                            {isAdmin && property.notes && (
                                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900">
                                    <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">GHI CHÚ</h4>
                                    <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed italic">
                                        {property.notes}
                                    </p>
                                </div>
                            )}

                            {/* THÔNG TIN NHẠY CẢM - CHỈ ADMIN */}
                            {isAdmin && (
                                <div className="pt-4 border-t-2 border-dashed border-amber-400 dark:border-amber-600">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Shield className="w-4 h-4 text-amber-500" />
                                        <h4 className="text-[10px] font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400">
                                            🔒 THÔNG TIN NHẠY CẢM (CHỈ ADMIN)
                                        </h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                                            {property.hasPlanningIssue ? (
                                                <AlertCircle className="w-4 h-4 text-amber-600" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                            )}
                                            <span className="text-[10px]">
                                                {property.hasPlanningIssue ? '⚠️ Dính quy hoạch' : '✅ Không quy hoạch'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                                            {property.hasRoadWidthIssue ? (
                                                <AlertCircle className="w-4 h-4 text-amber-600" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                            )}
                                            <span className="text-[10px]">
                                                {property.hasRoadWidthIssue ? '⚠️ Dính lộ giới' : '✅ Không lộ giới'}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowFullInfo(!showFullInfo)}
                                        className="w-full mt-3 border border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 py-2 text-[10px] tracking-widest uppercase transition-colors text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2"
                                    >
                                        {showFullInfo ? (
                                            <>
                                                <EyeOff className="w-3 h-3" />
                                                ẨN THÔNG TIN CHI TIẾT
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-3 h-3" />
                                                XEM THÊM CHI TIẾT ADMIN
                                            </>
                                        )}
                                    </button>

                                    {showFullInfo && (
                                        <div className="mt-3 p-4 bg-neutral-50 dark:bg-neutral-900/50 border border-amber-200 dark:border-amber-800 space-y-3">
                                            <div>
                                                <h5 className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">PHONG THỦY</h5>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {property.hasFengShuiIssue ? (
                                                        <AlertCircle className="w-4 h-4 text-amber-600" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                    )}
                                                    <span className="text-xs">
                                                        {property.hasFengShuiIssue
                                                            ? `Có lỗi phong thủy: ${getFengShuiLabel(property.fengShuiIssue)}`
                                                            : 'Không có lỗi phong thủy'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">MÔI TRƯỜNG</h5>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Users className="w-4 h-4 text-neutral-400" />
                                                    <span className="text-xs">Hàng xóm: {getNeighborLabel(property.neighborType)}</span>
                                                </div>
                                                {property.hasCashFlow && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <DollarSign className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-xs text-emerald-600">Có dòng tiền</span>
                                                    </div>
                                                )}
                                                {property.isHardToAccess && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <AlertCircle className="w-4 h-4 text-amber-600" />
                                                        <span className="text-xs text-amber-600">Đường vào khó đi</span>
                                                    </div>
                                                )}
                                            </div>

                                            {property.googleMapCoordinates && (
                                                <div>
                                                    <h5 className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">VỊ TRÍ</h5>
                                                    <a
                                                        href={`https://www.google.com/maps?q=${property.googleMapCoordinates}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono"
                                                    >
                                                        📍 {property.googleMapCoordinates}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>

                    {/* CONTACT BAR + FORM TƯ VẤN - CỐ ĐỊNH */}
                    <div className="space-y-6">
                        {/* Contact info */}
                        <div className="border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 text-center space-y-6">
                            <span className="text-[10px] text-neutral-400 block uppercase tracking-[0.2em] font-semibold">TƯ VẤN QUẢN LÝ</span>

                            <div className="w-16 h-16 rounded-none bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center text-lg font-light mx-auto">
                                N
                            </div>

                            <div>
                                <h4 className="font-semibold text-xs tracking-wider uppercase dark:text-white">TRẦN THIỆN NHÂN</h4>
                                <span className="text-[9px] tracking-widest text-neutral-400 block uppercase mt-1">Chuyên Viên Tư Vấn & Quản Lý BĐS Nhà Phố Sài Gòn</span>
                            </div>

                            <div className="space-y-3">
                                <a
                                    href={`tel:${property.contactPhone}`}
                                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-bold py-3 text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
                                >
                                    <Phone className="w-4 h-4" /> 0909941199
                                </a>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(property.contactPhone || "");
                                        alert(`Đã sao chép SĐT: ${property.contactPhone}`);
                                    }}
                                    className="w-full border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:white text-neutral-500 hover:text-neutral-900 dark:hover:text-white py-2 text-xs tracking-widest uppercase transition-all"
                                >
                                    SAO CHÉP LIÊN HỆ
                                </button>
                            </div>
                        </div>

                        {/* 📋 Form nhận tư vấn */}
                        <div className="border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6">
                            <div className="text-center mb-4">
                                <h4 className="text-xs font-semibold tracking-widest uppercase dark:text-white">
                                    📋 NHẬN TƯ VẤN MIỄN PHÍ
                                </h4>
                                <p className="text-[9px] text-neutral-400 mt-1 tracking-wider">
                                    Để lại thông tin, chúng tôi sẽ liên hệ ngay
                                </p>
                            </div>

                            <form onSubmit={sendConsultation} className="space-y-3">
                                <div>
                                    <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase block mb-1">
                                        Họ tên *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Nguyễn Văn A"
                                            value={consultantName}
                                            onChange={(e) => setConsultantName(e.target.value)}
                                            className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase block mb-1">
                                        Số điện thoại *
                                    </label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="0901234567"
                                            value={consultantPhone}
                                            onChange={(e) => setConsultantPhone(e.target.value)}
                                            className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                        />
                                    </div>
                                </div>

                                {sendError && (
                                    <div className="text-rose-600 dark:text-rose-400 text-[9px] tracking-wider">
                                        ⚠️ {sendError}
                                    </div>
                                )}

                                {sendSuccess && (
                                    <div className="text-emerald-600 dark:text-emerald-400 text-[9px] tracking-wider flex items-center gap-1">
                                        ✅ Đã gửi yêu cầu! Chúng tôi sẽ liên hệ sớm.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 py-2.5 text-[10px] tracking-widest uppercase font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            ĐANG GỬI...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-3.5 h-3.5" />
                                            GỬI YÊU CẦU TƯ VẤN
                                        </>
                                    )}
                                </button>

                                <p className="text-[8px] text-neutral-400 text-center tracking-wider">
                                    💡 Thông tin sẽ được gửi đến đội ngũ tư vấn và bảo mật tuyệt đối
                                </p>
                            </form>
                        </div>

                        {/* 🛠️ THÔNG TIN QUẢN LÝ - CHỈ ADMIN */}
                        {isAdmin && (
                            <div className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <UserCog className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    <h4 className="text-[10px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-400">
                                        🛠️ THÔNG TIN QUẢN LÝ (ADMIN)
                                    </h4>
                                </div>

                                <div className="space-y-3">
                                    {/* Thông tin liên hệ chính */}
                                    <div className="border-b border-amber-200/50 dark:border-amber-800/50 pb-3">
                                        <h5 className="text-[9px] font-bold tracking-widest text-amber-600/70 dark:text-amber-400/70 uppercase mb-2">
                                            📞 LIÊN HỆ CHÍNH
                                        </h5>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs">
                                                <User className="w-3.5 h-3.5 text-amber-500" />
                                                <span className="font-semibold dark:text-white">{property.contactName || 'Chưa có'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <Phone className="w-3.5 h-3.5 text-amber-500" />
                                                <span className="font-mono dark:text-white">{property.contactPhone || 'Chưa có'}</span>
                                                {property.contactPhone && (
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(property.contactPhone || "");
                                                            alert(`Đã sao chép SĐT: ${property.contactPhone}`);
                                                        }}
                                                        className="text-[8px] text-amber-600 dark:text-amber-400 hover:underline"
                                                    >
                                                        [Copy]
                                                    </button>
                                                )}
                                            </div>
                                            {property.contactPhone && (
                                                <a
                                                    href={`tel:${property.contactPhone}`}
                                                    className="inline-flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 hover:underline"
                                                >
                                                    <Phone className="w-3 h-3" />
                                                    Gọi ngay
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Thông tin bổ sung */}
                                    <div className="space-y-2">
                                        <h5 className="text-[9px] font-bold tracking-widest text-amber-600/70 dark:text-amber-400/70 uppercase mb-2">
                                            📋 THÔNG TIN BỔ SUNG
                                        </h5>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <BadgeCheck className="w-3 h-3 text-amber-500" />
                                                <span className="text-[10px] dark:text-white">
                                                    {property.saleStatus === 'da_ban' ? '🔴 Đã bán' : '🟢 Đang bán'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3 text-amber-500" />
                                                <span className="text-[10px] dark:text-white font-mono">
                                                    ID: {property.id.slice(-8)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 col-span-2">
                                                <Clock className="w-3 h-3 text-amber-500" />
                                                <span className="text-[10px] dark:text-white">
                                                    Cập nhật: {new Date().toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-2 pt-2 border-t border-amber-200/50 dark:border-amber-800/50">
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(JSON.stringify({
                                                    id: property.id,
                                                    title: property.title,
                                                    contactName: property.contactName,
                                                    contactPhone: property.contactPhone,
                                                    price: property.price,
                                                    address: property.address
                                                }, null, 2));
                                                alert('Đã sao chép thông tin quản lý!');
                                            }}
                                            className="flex-1 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 py-1.5 text-[8px] tracking-widest uppercase transition-colors text-amber-700 dark:text-amber-400"
                                        >
                                            📋 Copy Info
                                        </button>
                                        <button
                                            onClick={() => {
                                                window.open(`mailto:admin@domain.com?subject=Quản lý BĐS: ${property.id}&body=Thông tin BĐS:\n- ID: ${property.id}\n- Tiêu đề: ${property.title}\n- Liên hệ: ${property.contactName} - ${property.contactPhone}`, '_blank');
                                            }}
                                            className="flex-1 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 py-1.5 text-[8px] tracking-widest uppercase transition-colors text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1"
                                        >
                                            <Mail className="w-3 h-3" />
                                            Email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* SUGGESTED */}
                {suggestions.length > 0 && (
                    <section className="space-y-6 pt-12 border-t border-neutral-200 dark:border-neutral-900">
                        <h3 className="font-semibold text-xs tracking-[0.2em] uppercase dark:text-white">KHÔNG GIAN TƯƠNG TỰ CÙNG KHU VỰC</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {suggestions.map(prop => (
                                <PropertyCard key={prop.id} property={prop} navigateTo={navigateTo} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* LIGHTBOX */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-neutral-300 transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-mono">
                        {lightboxIndex + 1} / {allImages.length}
                    </div>

                    {isAdmin && allImages[lightboxIndex]?.type === 'sensitive' && (
                        <div className="absolute top-16 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-[10px] tracking-widest uppercase font-bold rounded">
                            🔒 ẢNH NHẠY CẢM - CHỈ ADMIN
                        </div>
                    )}

                    <div
                        className="relative w-full h-full flex items-center justify-center p-4 sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={allImages[lightboxIndex]?.url || "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80"}
                            alt={`Image ${lightboxIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />

                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-neutral-300 transition-colors p-3 hover:bg-white/10 rounded-full"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-neutral-300 transition-colors p-3 hover:bg-white/10 rounded-full"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        {allImages.length > 1 && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[80vw] px-4">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                                        className={`relative w-12 h-10 overflow-hidden border-2 transition-all flex-shrink-0 ${lightboxIndex === idx ? 'border-white' : 'border-white/30 hover:border-white/60'
                                            }`}
                                    >
                                        <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                        {isAdmin && img.type === 'sensitive' && (
                                            <span className="absolute bottom-0 left-0 right-0 bg-amber-500/80 text-white text-[5px] text-center py-0.5">
                                                🔒
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default DetailScreen;