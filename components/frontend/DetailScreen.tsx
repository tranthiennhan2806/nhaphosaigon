import React, { useState, useMemo } from 'react';
import { Property } from '@/types';
import {
    ChevronLeft, Phone, MapPin, Bath, Bed, Maximize, Info,
    Building2, Ruler, Home, Navigation, Car, Users, DollarSign,
    CheckCircle, XCircle, AlertCircle
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

// Helper functions để lấy label
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

    const suggestions = useMemo(() => {
        return properties
            .filter(p => p.id !== property.id && p.district === property.district)
            .slice(0, 3);
    }, [properties, property]);

    if (!property) {
        return (
            <div className="text-center py-12">
                <p className="dark:text-white uppercase tracking-wider text-xs">Không tìm thấy không gian.</p>
                <button onClick={() => navigateTo('listings')} className="text-neutral-500 hover:underline text-xs uppercase mt-4">Trở lại danh sách</button>
            </div>
        );
    }

    return (
        <div
            style={{
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="space-y-8"
        >
            {/* Nút quay lại */}
            <button
                onClick={() => navigateTo('listings')}
                className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
                <ChevronLeft className="w-3.5 h-3.5" /> QUAY LẠI DANH SÁCH TÌM KIẾM
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* GALLERY & CORE INFOS */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-3">
                        <div className="relative h-[250px] sm:h-[450px] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-900 overflow-hidden">
                            <img
                                key={activeImageIndex}
                                src={property.images[activeImageIndex] || "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80"}
                                alt={property.title}
                                style={{
                                    opacity: 1,
                                    transition: 'opacity 0.3s ease'
                                }}
                                className="w-full h-full object-cover"
                            />

                            {/* Trạng thái bán */}
                            <span className={`absolute top-4 left-4 px-3 py-1 text-[9px] tracking-widest uppercase font-bold z-10 ${property.saleStatus === 'da_ban'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                                }`}>
                                {getSaleStatusLabel(property.saleStatus)}
                            </span>

                            <span className="absolute bottom-4 right-4 bg-white/80 dark:bg-neutral-950/80 text-neutral-900 dark:text-white px-2.5 py-1 text-[10px] tracking-widest uppercase z-10">
                                ẢNH {activeImageIndex + 1} / {property.images.length || 1}
                            </span>
                        </div>

                        {property.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {property.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative w-20 h-14 overflow-hidden border transition-all ${activeImageIndex === idx ? 'border-neutral-950 dark:border-white scale-95' : 'border-transparent opacity-60'}`}
                                    >
                                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price & Basic Info */}
                    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 space-y-6">
                        {property.houseType === 'chung_cu' && property.projectName && (
                            <div className="flex items-center gap-2 mt-1">
                                <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Dự án: {property.projectName}
                                </span>
                            </div>
                        )}
                        <div className="space-y-2">
                            <div className="flex items-start justify-between">
                                <h1 className="text-xl sm:text-2xl font-light tracking-wide dark:text-white flex-1">
                                    {property.title}
                                </h1>
                            </div>
                            <div className="flex items-center gap-1.5 text-neutral-400 text-xs uppercase tracking-wider">
                                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                                <span>{property.address}</span>
                            </div>
                            {/* Loại nhà */}
                            <div className="flex items-center gap-2 mt-1">
                                <Home className="w-3.5 h-3.5 text-neutral-400" />
                                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    {getHouseTypeLabel(property.houseType)}
                                </span>
                                {property.houseType === 'chung_cu' && property.floorNumber > 0 && (
                                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                        • Tầng {property.floorNumber}
                                    </span>
                                )}
                                {property.direction && property.direction !== 'khong_xac_dinh' && (
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

                    {/* Details Spec Description */}
                    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 space-y-6">
                        <h3 className="font-semibold text-xs tracking-widest uppercase border-b border-neutral-100 dark:border-neutral-900 pb-3 dark:text-white">
                            THÔNG TIN CHI TIẾT
                        </h3>

                        {/* Thông tin cơ bản */}
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
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-neutral-400" />
                                <div>
                                    <span className="text-[9px] text-neutral-400 block">MÃ SỐ</span>
                                    <span className="font-mono text-xs font-bold dark:text-white uppercase">{property.id.slice(-6)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin hẻm (nếu có) */}
                        {(property.alleyDepth > 0 || property.alleyType !== 'khac') && (
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

                        {/* Kích thước đất (nếu có) */}
                        {(property.width > 0 || property.length > 0) && (
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

                        {/* Pháp lý cơ bản */}
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

                        {/* Mô tả */}
                        <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900">
                            <p className="text-neutral-500 dark:text-neutral-300 text-xs leading-relaxed whitespace-pre-wrap uppercase tracking-wider">
                                {property.description}
                            </p>
                        </div>

                        {/* Ghi chú (nếu có) */}
                        {property.notes && (
                            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900">
                                <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">GHI CHÚ</h4>
                                <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed italic">
                                    {property.notes}
                                </p>
                            </div>
                        )}

                        {/* Thêm nút xem thêm thông tin (ẩn các thông tin nhạy cảm) */}
                        <button
                            onClick={() => setShowFullInfo(!showFullInfo)}
                            className="w-full border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white py-2 text-[10px] tracking-widest uppercase transition-colors text-neutral-600 dark:text-neutral-400"
                        >
                            {showFullInfo ? 'ẨN BỚT THÔNG TIN' : 'XEM THÊM THÔNG TIN CHI TIẾT'}
                        </button>

                        {/* Thông tin mở rộng (ẩn mặc định) */}
                        {showFullInfo && (
                            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900 space-y-4">
                                {/* Phong thủy */}
                                <div>
                                    <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">PHONG THỦY</h4>
                                    <div className="flex items-center gap-2">
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

                                {/* Hàng xóm */}
                                <div>
                                    <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">MÔI TRƯỜNG</h4>
                                    <div className="flex items-center gap-2">
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

                                {/* Google Maps */}
                                {property.googleMapCoordinates && (
                                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-neutral-400" />
                                            <a
                                                href={`https://www.google.com/maps?q=${property.googleMapCoordinates}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono"
                                            >
                                                Xem vị trí trên Google Maps
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* CONTACT BAR */}
                <div className="space-y-6">
                    <div className="border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 text-center sticky top-28 space-y-6">
                        <span className="text-[10px] text-neutral-400 block uppercase tracking-[0.2em] font-semibold">TƯ VẤN QUẢN LÝ</span>

                        <div className="w-16 h-16 rounded-none bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center text-lg font-light mx-auto">
                            {property.contactName?.charAt(0) || "D"}
                        </div>

                        <div>
                            <h4 className="font-semibold text-xs tracking-wider uppercase dark:text-white">{property.contactName || "CHÍNH CHỦ"}</h4>
                            <span className="text-[9px] tracking-widest text-neutral-400 block uppercase mt-1">Đại diện cao cấp {property.district}</span>
                        </div>

                        <div className="space-y-3">
                            <a
                                href={`tel:${property.contactPhone}`}
                                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-bold py-3 text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
                            >
                                <Phone className="w-4 h-4" /> {property.contactPhone || "09xxxxxxx"}
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
    );
}

export default DetailScreen;