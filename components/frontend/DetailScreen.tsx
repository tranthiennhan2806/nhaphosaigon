import React, { useState, useMemo } from 'react';
import { Property } from '@/types';
import { ChevronLeft, Phone, MapPin, Bath, Bed, Maximize, Info } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { formatPrice } from '@/utils/format';
import PropertyDetailInfo from '@/app/(frontend)/PropertyDetailInfo';

interface DetailScreenProps {
    property: Property;
    navigateTo: (tab: string, id?: string) => void;
    properties: Property[];
}

export function DetailScreen({ property, navigateTo, properties }: DetailScreenProps) {
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
    const [isVisible, setIsVisible] = useState(true);

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
            {/* CHỈ CÓ NÚT QUAY LẠI, KHÔNG CÓ HEADER/NAVBAR */}
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

                            <span className="absolute top-4 left-4 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[9px] tracking-widest uppercase px-3 py-1 font-bold z-10">
                                BÁN
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
                        <div className="space-y-2">
                            <h1 className="text-xl sm:text-2xl font-light tracking-wide dark:text-white">{property.title}</h1>
                            <div className="flex items-center gap-1.5 text-neutral-400 text-xs uppercase tracking-wider">
                                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                                <span>{property.address}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-t border-b border-neutral-100 dark:border-neutral-900 py-4 text-center">
                            <div>
                                <span className="text-[10px] tracking-widest text-neutral-400 uppercase block mb-1">MỨC GIÁ CHÍNH XÁC</span>
                                <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base">
                                    {formatPrice(property.price)}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] tracking-widest text-neutral-400 uppercase block mb-1">KÍCH THƯỚC DIỆN TÍCH</span>
                                <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base">
                                    {property.area} M²
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] tracking-widest text-neutral-400 uppercase block mb-1">DỰ KIẾN TRÊN M²</span>
                                <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base">
                                    ~ {(property.price / property.area / 1000000).toFixed(1)} TR/M²
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Details Spec Description */}
                    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 space-y-6">
                        <h3 className="font-semibold text-xs tracking-widest uppercase border-b border-neutral-100 dark:border-neutral-900 pb-3 dark:text-white">BẢN VẼ CHI TIẾT & THÔNG TIN</h3>

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
                                <Maximize className="w-4 h-4 text-neutral-400" />
                                <div>
                                    <span className="text-[9px] text-neutral-400 block">DIỆN TÍCH SÀN</span>
                                    <span className="font-semibold dark:text-white">{property.area} M²</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-neutral-400" />
                                <div>
                                    <span className="text-[9px] text-neutral-400 block">MÃ KHÔNG GIAN</span>
                                    <span className="font-mono text-xs font-bold dark:text-white uppercase">{property.id}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900">
                            <p className="text-neutral-500 dark:text-neutral-300 text-xs leading-relaxed whitespace-pre-wrap uppercase tracking-wider">
                                {property.description}
                            </p>
                        </div>

                        {/* Thêm component hiển thị thông tin chi tiết */}
                        <PropertyDetailInfo property={property} />
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