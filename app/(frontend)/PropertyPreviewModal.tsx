import React, { useEffect } from 'react';
import { Property } from '@/types';
import { X, MapPin, Bed, Bath, Maximize, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/utils/format';

interface PropertyPreviewModalProps {
    property: Property | null;
    isOpen: boolean;
    onClose: () => void;
    onViewDetail: (id: string) => void;
}

export function PropertyPreviewModal({ 
    property, 
    isOpen, 
    onClose, 
    onViewDetail 
}: PropertyPreviewModalProps) {
    const [activeImageIndex, setActiveImageIndex] = React.useState(0);

    useEffect(() => {
        setActiveImageIndex(0);
    }, [property]);

    if (!property) return null;

    const nextImage = () => {
        setActiveImageIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevImage = () => {
        setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    };

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    onClick={onClose}
                />
            )}

            <div 
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
                    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
            >
                <div 
                    className="bg-white dark:bg-neutral-950 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 dark:border-neutral-900"
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
                    <div className="relative h-80 bg-neutral-100 dark:bg-neutral-900">
                        <img
                            src={property.images[activeImageIndex] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"}
                            alt={property.title}
                            className="w-full h-full object-cover"
                        />

                        {property.images.length > 1 && (
                            <>
                                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 text-xs rounded-full">
                                    {activeImageIndex + 1} / {property.images.length}
                                </span>
                                
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-neutral-950/80 p-2 rounded-full hover:bg-white dark:hover:bg-neutral-950 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-neutral-950/80 p-2 rounded-full hover:bg-white dark:hover:bg-neutral-950 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}

                        {property.images.length > 1 && (
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                                {property.images.slice(0, 5).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            activeImageIndex === idx 
                                                ? 'bg-white w-6' 
                                                : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                    />
                                ))}
                                {property.images.length > 5 && (
                                    <span className="text-white/70 text-xs ml-1">+{property.images.length - 5}</span>
                                )}
                            </div>
                        )}

                        <span className="absolute top-4 left-4 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[9px] font-bold tracking-widest uppercase px-3 py-1">
                            BÁN
                        </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold dark:text-white">
                                {property.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    {formatPrice(property.price)}
                                </span>
                                <span className="text-sm text-neutral-400">• {property.area} m²</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{property.address}</span>
                        </div>

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

                        <div>
                            <h4 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-2">
                                Mô tả
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {property.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div>
                                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Loại nhà</span>
                                <p className="text-sm font-medium dark:text-white capitalize">
                                    {property.houseType?.replace(/_/g, ' ').toLowerCase() || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Hướng</span>
                                <p className="text-sm font-medium dark:text-white capitalize">
                                    {property.direction?.replace(/_/g, ' ').toLowerCase() || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Số tầng</span>
                                <p className="text-sm font-medium dark:text-white">
                                    {property.floors || 0} tầng
                                </p>
                            </div>
                            <div>
                                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Trạng thái</span>
                                <p className={`text-sm font-medium ${
                                    property.saleStatus === 'da_ban' 
                                        ? 'text-rose-600' 
                                        : 'text-emerald-600'
                                }`}>
                                    {property.saleStatus === 'da_ban' ? 'Đã bán' : 'Đang bán'}
                                </p>
                            </div>
                        </div>

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
                                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 py-3 text-xs tracking-widest uppercase font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-4 h-4" />
                                    Gọi ngay
                                </a>
                                <button
                                    onClick={() => {
                                        onClose();
                                        onViewDetail(property.id);
                                    }}
                                    className="flex-1 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white py-3 text-xs tracking-widest uppercase font-medium transition-colors"
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}