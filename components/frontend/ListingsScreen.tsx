import React, { useState, useMemo } from 'react';
import { Property, FilterState } from '@/types';
import { TARGET_DISTRICTS } from '@/configs/constants';
import { PropertyCard } from './PropertyCard';
import { Filter } from 'lucide-react';

interface ListingsScreenProps {
    properties: Property[];
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    navigateTo: (tab: string, id?: string) => void;
    isLoading?: boolean; // Thêm prop isLoading
}

export function ListingsScreen({
    properties,
    filters,
    setFilters,
    navigateTo,
    isLoading = false // Default là false
}: ListingsScreenProps) {
    const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState(true);

    // Lọc sản phẩm trực tiếp - KHÔNG DÙNG useMemo
    const filteredProperties = properties.filter((prop) => {
        // Tìm kiếm theo từ khóa
        if (filters.search) {
            const text = filters.search.toLowerCase();
            const matchesTitle = prop.title.toLowerCase().includes(text);
            const matchesDesc = prop.description.toLowerCase().includes(text);
            const matchesAddr = prop.address.toLowerCase().includes(text);
            if (!matchesTitle && !matchesDesc && !matchesAddr) return false;
        }

        // Lọc theo khu vực
        if (filters.location && prop.district !== filters.location) return false;

        // Lọc theo giá
        if (filters.minPrice && prop.price < Number(filters.minPrice)) return false;
        if (filters.maxPrice && prop.price > Number(filters.maxPrice)) return false;

        // Lọc theo diện tích
        if (filters.minArea && prop.area < Number(filters.minArea)) return false;
        if (filters.maxArea && prop.area > Number(filters.maxArea)) return false;

        return true;
    });

    const clearFilters = () => {
        setFilters({
            search: '',
            type: 'sale',
            minPrice: '',
            maxPrice: '',
            minArea: '',
            maxArea: '',
            location: '',
        });
    };

    // Nếu đang loading, hiển thị spinner
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white mx-auto"></div>
                    <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">Đang tải dữ liệu...</p>
                </div>
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
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-neutral-200 dark:border-neutral-900 pb-6">
                <div>
                    <h1 className="text-lg font-semibold tracking-[0.2em] uppercase dark:text-white">DANH SÁCH BẤT ĐỘNG SẢN</h1>
                    <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">
                        Tìm thấy {filteredProperties.length} kết quả phù hợp
                    </p>
                </div>

                <button
                    onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                    className="md:hidden w-full border border-neutral-950 dark:border-white py-2.5 text-xs tracking-widest uppercase font-medium"
                >
                    {mobileFilterOpen ? 'ĐÓNG BỘ LỌC' : 'MỞ BỘ LỌC NÂNG CAO'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                {/* FILTER PANEL */}
                <aside className={`border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-3">
                        <span className="text-xs font-semibold tracking-widest uppercase dark:text-white flex items-center gap-2">
                            <Filter className="w-3.5 h-3.5 stroke-[1.5]" /> BỘ LỌC TÌM KIẾM
                        </span>
                        <button
                            onClick={clearFilters}
                            className="text-[10px] text-neutral-400 hover:text-neutral-900 dark:hover:text-white uppercase tracking-widest"
                        >
                            XÓA TẤT CẢ
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">TỪ KHÓA TÌM KIẾM</span>
                            <input
                                type="text"
                                placeholder="NHẬP TÊN ĐƯỜNG..."
                                value={filters.search}
                                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">KHU VỰC (QUẬN/HUYỆN)</span>
                            <select
                                value={filters.location}
                                onChange={e => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs tracking-widest uppercase focus:outline-none cursor-pointer text-neutral-900 dark:text-neutral-100"
                            >
                                <option value="" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">TẤT CẢ KHU VỰC</option>
                                {TARGET_DISTRICTS.map((p, idx) => (
                                    <option key={idx} value={p} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">{p}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">GIÁ (VNĐ)</span>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    placeholder="MIN"
                                    value={filters.minPrice}
                                    onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                                />
                                <input
                                    type="number"
                                    placeholder="MAX"
                                    value={filters.maxPrice}
                                    onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">DIỆN TÍCH (M²)</span>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    placeholder="MIN"
                                    value={filters.minArea}
                                    onChange={e => setFilters(prev => ({ ...prev, minArea: e.target.value }))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                                />
                                <input
                                    type="number"
                                    placeholder="MAX"
                                    value={filters.maxArea}
                                    onChange={e => setFilters(prev => ({ ...prev, maxArea: e.target.value }))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* RESULTS GRID - HIỂN THỊ TẤT CẢ SẢN PHẨM */}
                <section className="lg:col-span-3">
                    {filteredProperties.length === 0 ? (
                        <div className="border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 text-center py-20 px-6">
                            <h3 className="text-xs font-semibold tracking-widest uppercase mb-2 dark:text-white">KHÔNG TÌM THẤY KẾT QUẢ</h3>
                            <p className="text-[11px] text-neutral-400 tracking-wider uppercase mb-6 max-w-xs mx-auto leading-relaxed">
                                Hãy điều chỉnh thông số bộ lọc để tìm kiếm các lựa chọn không gian tối giản khác.
                            </p>
                            <button
                                onClick={clearFilters}
                                className="border border-neutral-900 dark:border-white px-6 py-2.5 text-xs tracking-widest uppercase font-medium transition-colors"
                            >
                                ĐẶT LẠI
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {filteredProperties.map((prop) => (
                                <PropertyCard key={prop.id} property={prop} navigateTo={navigateTo} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default ListingsScreen;