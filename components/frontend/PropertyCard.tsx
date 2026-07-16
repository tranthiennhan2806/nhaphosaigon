import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/types';
import { formatPriceShort } from '@/utils/format';
import { 
    MapPin, Bed, Bath, ImageIcon, 
    Home, Building2, Ruler, Navigation,
    TrendingUp, CheckCircle, XCircle
} from 'lucide-react';

interface PropertyCardProps {
    property: Property;
    navigateTo?: (tab: string, id?: string) => void;
    onOpenPreview?: (property: Property) => void;
    viewMode?: 'grid' | 'list'; // Thêm prop viewMode
}

export function PropertyCard({ 
    property, 
    navigateTo, 
    onOpenPreview,
    viewMode = 'grid' // Mặc định là grid
}: PropertyCardProps) {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        if (onOpenPreview) {
            onOpenPreview(property);
        } else if (navigateTo) {
            navigateTo('detail', property.id);
        } else {
            router.push(`/property/${property.id}`);
        }
    };

    // Nếu viewMode là list, render dạng danh sách
    if (viewMode === 'list') {
        return (
            <div
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    borderColor: isHovered ? 'var(--color-neutral-900, #000)' : undefined,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="group bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 cursor-pointer overflow-hidden flex flex-col sm:flex-row"
            >
                {/* Image - smaller on list view */}
                <div className="relative w-full sm:w-64 h-[200px] sm:h-auto sm:min-h-[200px] bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex-shrink-0">
                    <img
                        src={property.images[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"}
                        alt={property.title}
                        style={{
                            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />

                    <span className="absolute top-3 left-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 z-10">
                        BÁN
                    </span>

                    {property.images.length > 1 && (
                        <span className="absolute bottom-3 right-3 bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white text-[8px] font-semibold tracking-wider uppercase px-2 py-0.5 flex items-center gap-1 border dark:border-neutral-800 z-10">
                            <ImageIcon className="w-3 h-3 stroke-[1.5]" />
                            {property.images.length}
                        </span>
                    )}
                </div>

                {/* Content - expanded for list view */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                    <div className="space-y-3">
                        {/* Header with price and area */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-bold text-neutral-900 dark:text-white text-lg tracking-wide">
                                {formatPriceShort(property.price)}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-neutral-400 font-light tracking-widest uppercase">
                                    {property.area} M²
                                </span>
                                <span className="text-[10px] text-neutral-400">
                                    ~ {(property.price / property.area / 1000000).toFixed(1)} TR/M²
                                </span>
                            </div>
                        </div>

                        {/* Title and address */}
                        <div>
                            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white line-clamp-1 uppercase tracking-wider group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
                                {property.title}
                            </h4>
                        </div>

                        {/* Extended info for list view */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-900">
                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-600 dark:text-neutral-400">
                                <Home className="w-3.5 h-3.5" />
                                <span>Loại: {property.houseType}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-600 dark:text-neutral-400">
                                <Bed className="w-3.5 h-3.5" />
                                <span>{property.bedrooms} PN</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-600 dark:text-neutral-400">
                                <Bath className="w-3.5 h-3.5" />
                                <span>{property.bathrooms} WC</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-600 dark:text-neutral-400">
                                <Building2 className="w-3.5 h-3.5" />
                                <span>{property.floors} Tầng</span>
                            </div>
                        </div>

                        {/* Status badges */}
                        <div className="flex flex-wrap items-center gap-2">
                            {property.saleStatus === 'da_ban' ? (
                                <span className="text-[9px] bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-2 py-0.5 uppercase tracking-wider">
                                    Đã bán
                                </span>
                            ) : (
                                <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 uppercase tracking-wider">
                                    Đang bán
                                </span>
                            )}
                            {property.hasConstructionApproval && (
                                <span className="text-[9px] bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Hoàn công
                                </span>
                            )}
                            {property.hasCashFlow && (
                                <span className="text-[9px] bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 uppercase tracking-wider">
                                    💰 Có dòng tiền
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-900 mt-3">
                        <div className="flex items-center gap-4 text-[9px] text-neutral-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5" />
                                {property.saleStatus === 'da_ban' ? 'Đã bán' : 'Đang bán'}
                            </span>
                            {property.direction && property.direction !== 'khong_xac_dinh' && (
                                <span className="flex items-center gap-1">
                                    <Navigation className="w-3.5 h-3.5" />
                                    {property.direction}
                                </span>
                            )}
                        </div>
                        <span className="font-bold text-neutral-900 dark:text-white group-hover:underline text-xs flex items-center">
                            CHI TIẾT →
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // Grid view (mặc định)
    return (
        <div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                borderColor: isHovered ? 'var(--color-neutral-900, #000)' : undefined,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="group bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 cursor-pointer overflow-hidden flex flex-col h-full"
        >
            <div className="relative h-[210px] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                <img
                    src={property.images[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"}
                    alt={property.title}
                    style={{
                        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                <span className="absolute top-3 left-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 z-10">
                    BÁN
                </span>

                {property.images.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white text-[8px] font-semibold tracking-wider uppercase px-2 py-0.5 flex items-center gap-1 border dark:border-neutral-800 z-10">
                        <ImageIcon className="w-3 h-3 stroke-[1.5]" />
                        {property.images.length} ẢNH
                    </span>
                )}

                {/* Status badge on image - grid view */}
                {property.saleStatus === 'da_ban' && (
                    <span className="absolute top-3 right-3 bg-rose-600 text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 z-10">
                        ĐÃ BÁN
                    </span>
                )}
            </div>

            <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-neutral-900 dark:text-white text-sm tracking-wide uppercase">
                            {formatPriceShort(property.price)}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-light tracking-widest uppercase">
                            {property.area} M²
                        </span>
                    </div>

                    <h4 className="font-light text-xs text-neutral-800 dark:text-neutral-200 line-clamp-1 uppercase tracking-wider group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
                        {property.title}
                    </h4>

              
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-900 text-[9px] text-neutral-400 uppercase tracking-widest">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {property.bedrooms}</span>
                        <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.bathrooms}</span>
                        {property.floors > 0 && (
                            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {property.floors}</span>
                        )}
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white group-hover:underline flex items-center">
                        CHI TIẾT →
                    </span>
                </div>
            </div>
        </div>
    );
}

export default PropertyCard;