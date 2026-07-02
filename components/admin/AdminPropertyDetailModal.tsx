import React, { useState, useEffect } from 'react';
import { Property } from '@/types';
import { 
    X, MapPin, Bed, Bath, Maximize, Phone,
    Home, Building2, Ruler, Navigation, Car, 
    Users, DollarSign, AlertCircle, FileCheck,
    CheckCircle, XCircle, Shield, Eye, EyeOff,
    ChevronLeft, ChevronRight
} from 'lucide-react';
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

interface AdminPropertyDetailModalProps {
    property: Property | null;
    isOpen: boolean;
    onClose: () => void;
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

export function AdminPropertyDetailModal({ property, isOpen, onClose }: AdminPropertyDetailModalProps) {
    // ✅ Tất cả Hooks phải được gọi ở đây, TRƯỚC bất kỳ return nào
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showSensitiveImages, setShowSensitiveImages] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomIndex, setZoomIndex] = useState(0);

    // ✅ useEffect cũng phải được gọi ở top-level
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isZoomed) return;
            if (e.key === 'Escape') closeZoom();
            if (e.key === 'ArrowLeft') prevZoomImage();
            if (e.key === 'ArrowRight') nextZoomImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isZoomed]);

    // ✅ Kiểm tra điều kiện SAU khi đã gọi tất cả Hooks
    if (!property || !isOpen) return null;

    // Tạo mảng ảnh sau khi đã kiểm tra property tồn tại
    const allImages = [
        ...property.images.map(url => ({ url, type: 'normal' as const })),
        ...(showSensitiveImages ? property.sensitiveImages.map(url => ({ url, type: 'sensitive' as const })) : [])
    ];

    // Các hàm xử lý
    const nextImage = () => {
        setActiveImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const toggleSensitiveImages = () => {
        setShowSensitiveImages(!showSensitiveImages);
        setActiveImageIndex(0);
    };

    // Zoom functions
    const openZoom = (index: number) => {
        setZoomIndex(index);
        setIsZoomed(true);
        document.body.style.overflow = 'hidden';
    };

    const closeZoom = () => {
        setIsZoomed(false);
        document.body.style.overflow = 'unset';
    };

    const nextZoomImage = () => {
        setZoomIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevZoomImage = () => {
        setZoomIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white dark:bg-neutral-950 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 dark:border-neutral-900"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-neutral-950/90 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Image Gallery */}
                    <div className="relative h-80 bg-neutral-100 dark:bg-neutral-900 group">
                        <img
                            src={allImages[activeImageIndex]?.url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"}
                            alt={property.title}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => openZoom(activeImageIndex)}
                        />

                        {/* Overlay với icon phóng to */}
                        <div 
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center cursor-pointer"
                            onClick={() => openZoom(activeImageIndex)}
                        >
                            <div className="bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <Maximize className="w-6 h-6" />
                            </div>
                        </div>

                        {allImages.length > 1 && (
                            <>
                                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 text-xs rounded-full">
                                    {activeImageIndex + 1} / {allImages.length}
                                </span>

                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-neutral-950/80 p-2 rounded-full hover:bg-white dark:hover:bg-neutral-950 transition-colors"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-neutral-950/80 p-2 rounded-full hover:bg-white dark:hover:bg-neutral-950 transition-colors"
                                >
                                    ›
                                </button>
                            </>
                        )}

                        {allImages[activeImageIndex]?.type === 'sensitive' && (
                            <span className="absolute top-4 right-4 px-3 py-1 text-[9px] tracking-widest uppercase font-bold z-10 bg-amber-500 text-white">
                                🔒 NHẠY CẢM
                            </span>
                        )}

                        <span className="absolute top-4 left-4 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[9px] font-bold tracking-widest uppercase px-3 py-1 z-10">
                            {getSaleStatusLabel(property.saleStatus)}
                        </span>

                        {/* Nút phóng to */}
                        <span className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 text-[9px] tracking-widest uppercase rounded opacity-0 group-hover:opacity-100 transition-all duration-300">
                            Click để phóng to
                        </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Title & Price */}
                        <div>
                            <h3 className="text-xl font-semibold dark:text-white">
                                {property.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    {formatPrice(property.price)}
                                </span>
                                <span className="text-sm text-neutral-400">• {property.area} m²</span>
                                <span className={`text-xs font-medium px-2 py-0.5 ${
                                    property.saleStatus === 'da_ban' 
                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400' 
                                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                                }`}>
                                    {getSaleStatusLabel(property.saleStatus)}
                                </span>
                            </div>
                        </div>

                        {/* Address & Location */}
                        <div className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{property.address}</span>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-neutral-100 dark:border-neutral-900">
                            <div className="text-center">
                                <Bed className="w-5 h-5 mx-auto text-neutral-400" />
                                <p className="text-sm font-semibold mt-1 dark:text-white">{property.bedrooms} Phòng ngủ</p>
                            </div>
                            <div className="text-center">
                                <Bath className="w-5 h-5 mx-auto text-neutral-400" />
                                <p className="text-sm font-semibold mt-1 dark:text-white">{property.bathrooms} Toilet</p>
                            </div>
                            <div className="text-center">
                                <Maximize className="w-5 h-5 mx-auto text-neutral-400" />
                                <p className="text-sm font-semibold mt-1 dark:text-white">{property.area} m²</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-2">
                                Mô tả
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {property.description}
                            </p>
                        </div>

                        {/* Thông tin chi tiết - Grid 2 cột */}
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-900">
                            <div>
                                <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">
                                    🏠 Thông tin cơ bản
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-400">Mã số</span>
                                        <span className="font-mono dark:text-white">{property.id}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-400">Loại nhà</span>
                                        <span className="font-medium dark:text-white">{getHouseTypeLabel(property.houseType)}</span>
                                    </div>
                                    {property.projectName && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-500 dark:text-neutral-400">Dự án</span>
                                            <span className="font-medium dark:text-white">{property.projectName}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-400">Hướng</span>
                                        <span className="font-medium dark:text-white">{getDirectionLabel(property.direction)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-400">Số tầng</span>
                                        <span className="font-medium dark:text-white">{property.floors} tầng</span>
                                    </div>
                                    {property.houseType === 'chung_cu' && property.floorNumber > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-500 dark:text-neutral-400">Tầng số</span>
                                            <span className="font-medium dark:text-white">Tầng {property.floorNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">
                                    📐 Kích thước
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-400">Ngang</span>
                                        <span className="font-medium dark:text-white">{property.width || 0} m</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-400">Dài</span>
                                        <span className="font-medium dark:text-white">{property.length || 0} m</span>
                                    </div>
                                    {property.width > 0 && property.length > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-500 dark:text-neutral-400">Diện tích đất</span>
                                            <span className="font-medium dark:text-white">{property.width * property.length} m²</span>
                                        </div>
                                    )}
                                </div>

                                <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-4 mb-3">
                                    🚗 Thông tin hẻm
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-400">Số xẹt</span>
                                        <span className="font-medium dark:text-white">{property.alleyDepth}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-400">Loại hẻm</span>
                                        <span className="font-medium dark:text-white">{getAlleyTypeLabel(property.alleyType)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-400">Hẻm</span>
                                        <span className={`font-medium ${property.alleyEndType === 'cut' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                            {getAlleyEndLabel(property.alleyEndType)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-400">Đường vào</span>
                                        <span className={`font-medium ${property.isHardToAccess ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            {property.isHardToAccess ? 'Khó đi' : 'Dễ đi'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pháp lý & Tình trạng */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                            <div>
                                <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">
                                    ⚖️ Pháp lý
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        {property.hasConstructionApproval ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-rose-600" />
                                        )}
                                        <span className="dark:text-white">{property.hasConstructionApproval ? 'Đã hoàn công' : 'Chưa hoàn công'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        {property.hasFullConstructionApproval ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-amber-600" />
                                        )}
                                        <span className="dark:text-white">{property.hasFullConstructionApproval ? 'Hoàn công đầy đủ' : 'Hoàn công chưa đầy đủ'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        {property.hasBuildingPermit ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-amber-600" />
                                        )}
                                        <span className="dark:text-white">{property.hasBuildingPermit ? 'Có GPXD' : 'Không GPXD'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        {property.isInExistingResidentialArea ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-amber-600" />
                                        )}
                                        <span className="dark:text-white">{property.isInExistingResidentialArea ? 'KDC hiện hữu' : 'Đất mới'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        {property.hasPlanningIssue ? (
                                            <XCircle className="w-4 h-4 text-rose-600" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        )}
                                        <span className="dark:text-white">{property.hasPlanningIssue ? '⚠️ Dính quy hoạch' : 'Không quy hoạch'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        {property.hasRoadWidthIssue ? (
                                            <XCircle className="w-4 h-4 text-rose-600" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        )}
                                        <span className="dark:text-white">{property.hasRoadWidthIssue ? '⚠️ Dính lộ giới' : 'Không lộ giới'}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">
                                    💰 Tài chính & Môi trường
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        {property.hasCashFlow ? (
                                            <DollarSign className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <DollarSign className="w-4 h-4 text-neutral-400" />
                                        )}
                                        <span className="dark:text-white">{property.hasCashFlow ? 'Có dòng tiền' : 'Không dòng tiền'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-neutral-400" />
                                        <span className="dark:text-white">Hàng xóm: {getNeighborLabel(property.neighborType)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        {property.hasFengShuiIssue ? (
                                            <AlertCircle className="w-4 h-4 text-amber-600" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        )}
                                        <span className="dark:text-white">
                                            {property.hasFengShuiIssue ? `⚠️ ${getFengShuiLabel(property.fengShuiIssue)}` : 'Không lỗi phong thủy'}
                                        </span>
                                    </div>
                                </div>

                                {property.googleMapCoordinates && (
                                    <div className="mt-4">
                                        <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">
                                            📍 Vị trí
                                        </h4>
                                        <a
                                            href={`https://www.google.com/maps?q=${property.googleMapCoordinates}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono break-all"
                                        >
                                            {property.googleMapCoordinates}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Ghi chú */}
                        {property.notes && (
                            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900">
                                <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">
                                    📝 Ghi chú
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
                                    {property.notes}
                                </p>
                            </div>
                        )}

                        {/* Hình nhạy cảm - toggle */}
                        {property.sensitiveImages && property.sensitiveImages.length > 0 && (
                            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900">
                                <button
                                    onClick={toggleSensitiveImages}
                                    className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
                                >
                                    {showSensitiveImages ? (
                                        <>
                                            <EyeOff className="w-4 h-4" />
                                            Ẩn hình nhạy cảm
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-4 h-4" />
                                            Xem hình nhạy cảm ({property.sensitiveImages.length} ảnh)
                                        </>
                                    )}
                                </button>
                                {showSensitiveImages && (
                                    <div className="mt-2 flex gap-2 flex-wrap">
                                        {property.sensitiveImages.map((img, idx) => (
                                            <div 
                                                key={idx} 
                                                className="relative w-16 h-16 border dark:border-neutral-800 overflow-hidden cursor-pointer group"
                                                onClick={() => openZoom(property.images.length + idx)}
                                            >
                                                <img src={img} alt={`Sensitive ${idx + 1}`} className="w-full h-full object-cover" />
                                                <span className="absolute bottom-0 left-0 right-0 bg-amber-500/80 text-white text-[6px] text-center py-0.5">
                                                    🔒
                                                </span>
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                                    <Maximize className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Contact */}
                        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-lg font-semibold">
                                    {property.contactName?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold dark:text-white">{property.contactName || 'Chính chủ'}</p>
                                    <p className="text-xs text-neutral-400">{property.district}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <a
                                    href={`tel:${property.contactPhone}`}
                                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 py-2.5 text-xs tracking-widest uppercase font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-4 h-4" />
                                    Gọi ngay
                                </a>
                                <button
                                    onClick={onClose}
                                    className="flex-1 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white py-2.5 text-xs tracking-widest uppercase font-medium transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ZOOM LIGHTBOX */}
            {isZoomed && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
                    onClick={closeZoom}
                >
                    {/* Close button */}
                    <button
                        onClick={closeZoom}
                        className="absolute top-4 right-4 text-white hover:text-neutral-300 transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-mono">
                        {zoomIndex + 1} / {allImages.length}
                    </div>

                    {/* Badge sensitive */}
                    {allImages[zoomIndex]?.type === 'sensitive' && (
                        <div className="absolute top-16 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-[10px] tracking-widest uppercase font-bold rounded">
                            🔒 ẢNH NHẠY CẢM
                        </div>
                    )}

                    {/* Image */}
                    <div 
                        className="relative w-full h-full flex items-center justify-center p-4 sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={allImages[zoomIndex]?.url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"}
                            alt={`Image ${zoomIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />

                        {/* Navigation buttons */}
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevZoomImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-neutral-300 transition-colors p-3 hover:bg-white/10 rounded-full"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextZoomImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-neutral-300 transition-colors p-3 hover:bg-white/10 rounded-full"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[80vw] px-4">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setZoomIndex(idx); }}
                                        className={`relative w-12 h-10 overflow-hidden border-2 transition-all flex-shrink-0 ${
                                            zoomIndex === idx ? 'border-white' : 'border-white/30 hover:border-white/60'
                                        }`}
                                    >
                                        <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                        {img.type === 'sensitive' && (
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

export default AdminPropertyDetailModal;