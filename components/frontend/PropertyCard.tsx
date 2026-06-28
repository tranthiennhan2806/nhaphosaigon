import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/types';
import { formatPriceShort } from '@/utils/format';
import { MapPin, Bed, Bath, ImageIcon } from 'lucide-react';

interface PropertyCardProps {
    property: Property;
    navigateTo?: (tab: string, id?: string) => void;
    onOpenPreview?: (property: Property) => void;
}

export function PropertyCard({ 
    property, 
    navigateTo, 
    onOpenPreview 
}: PropertyCardProps) {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        // Nếu có onOpenPreview thì mở modal preview, không thì chuyển đến trang detail
        if (onOpenPreview) {
            onOpenPreview(property);
        } else if (navigateTo) {
            navigateTo('detail', property.id);
        } else {
            router.push(`/property/${property.id}`);
        }
    };

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

                    <div className="flex items-center gap-1 text-neutral-400 text-[10px] uppercase tracking-wider truncate">
                        <MapPin className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                        <span>{property.address}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-900 text-[9px] text-neutral-400 uppercase tracking-widest">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {property.bedrooms} PHÒNG</span>
                        <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.bathrooms} Toilet</span>
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