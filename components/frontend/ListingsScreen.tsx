import React, { useState } from 'react';
import { Property, FilterState } from '@/types';
import { TARGET_DISTRICTS } from '@/configs/constants';
import { PropertyCard } from './PropertyCard';
import { Filter, ChevronDown, Loader2, Grid3x3, List } from 'lucide-react';
import { PropertyPreviewModal } from '@/app/(frontend)/PropertyPreviewModal';

interface ListingsScreenProps {
    properties: Property[];
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    navigateTo: (tab: string, id?: string) => void;
}

export function ListingsScreen({
    properties,
    filters,
    setFilters,
    navigateTo
}: ListingsScreenProps) {
    const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState(true);
    const [displayCount, setDisplayCount] = useState(4);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerLoad = 6;

    // Lọc sản phẩm
    const filteredProperties = properties.filter((prop) => {
        if (filters.search) {
            const text = filters.search.toLowerCase();
            const matchesTitle = prop.title.toLowerCase().includes(text);
            const matchesDesc = prop.description.toLowerCase().includes(text);
            const matchesAddr = prop.address.toLowerCase().includes(text);
            if (!matchesTitle && !matchesDesc && !matchesAddr) return false;
        }

        if (filters.location && prop.district !== filters.location) return false;
        if (filters.minPrice && prop.price < Number(filters.minPrice)) return false;
        if (filters.maxPrice && prop.price > Number(filters.maxPrice)) return false;
        if (filters.minArea && prop.area < Number(filters.minArea)) return false;
        if (filters.maxArea && prop.area > Number(filters.maxArea)) return false;

        return true;
    });

    const displayedProperties = filteredProperties.slice(0, displayCount);
    const hasMore = displayCount < filteredProperties.length;

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        setDisplayCount(6);
    };

    const loadMore = () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        setTimeout(() => {
            setDisplayCount(prev => Math.min(prev + itemsPerLoad, filteredProperties.length));
            setIsLoading(false);
        }, 500);
    };

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
        setDisplayCount(6);
    };

    // Modal handlers
    const handleOpenModal = (property: Property) => {
        setSelectedProperty(property);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProperty(null), 300);
    };

    const handleViewDetail = (id: string) => {
        navigateTo('detail', id);
    };

    return (
        <>
            <div
                style={{
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="space-y-8"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-neutral-200 dark:border-neutral-900 pb-6">
                    <div>
                        <h1 className="text-lg font-semibold tracking-[0.2em] uppercase dark:text-white">DANH SÁCH BẤT ĐỘNG SẢN</h1>
                        <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">
                            Tìm thấy {filteredProperties.length} kết quả phù hợp
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Mode Toggle */}
                        <div className="hidden sm:flex border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 transition-colors ${
                                    viewMode === 'grid' 
                                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950' 
                                        : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                                title="Dạng lưới"
                            >
                                <Grid3x3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 transition-colors ${
                                    viewMode === 'list' 
                                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950' 
                                        : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                                title="Dạng danh sách"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                            className="md:hidden w-full border border-neutral-950 dark:border-white py-2.5 text-xs tracking-widest uppercase font-medium"
                        >
                            {mobileFilterOpen ? 'ĐÓNG BỘ LỌC' : 'MỞ BỘ LỌC NÂNG CAO'}
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* Filter Panel */}
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
                                    onChange={e => handleFilterChange({ ...filters, search: e.target.value })}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">KHU VỰC (QUẬN/HUYỆN)</span>
                                <select
                                    value={filters.location}
                                    onChange={e => handleFilterChange({ ...filters, location: e.target.value })}
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
                                        onChange={e => handleFilterChange({ ...filters, minPrice: e.target.value })}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        placeholder="MAX"
                                        value={filters.maxPrice}
                                        onChange={e => handleFilterChange({ ...filters, maxPrice: e.target.value })}
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
                                        onChange={e => handleFilterChange({ ...filters, minArea: e.target.value })}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        placeholder="MAX"
                                        value={filters.maxArea}
                                        onChange={e => handleFilterChange({ ...filters, maxArea: e.target.value })}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results */}
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
                            <>
                                <div className={`grid gap-6 ${
                                    viewMode === 'grid' 
                                        ? 'grid-cols-1 sm:grid-cols-2' 
                                        : 'grid-cols-1'
                                }`}>
                                    {displayedProperties.map((prop) => (
                                        <div key={prop.id} className={viewMode === 'list' ? 'w-full' : ''}>
                                            <PropertyCard 
                                                property={prop} 
                                                navigateTo={navigateTo}
                                                onOpenPreview={handleOpenModal}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Load More Button */}
                                <div className="flex flex-col items-center gap-4 mt-8 pt-6">
                                    {hasMore ? (
                                        <button
                                            onClick={loadMore}
                                            disabled={isLoading}
                                            className="w-full sm:w-auto border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white px-8 py-3 text-xs tracking-widest uppercase font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    ĐANG TẢI...
                                                </>
                                            ) : (
                                                <>
                                                    XEM THÊM {Math.min(itemsPerLoad, filteredProperties.length - displayCount)} SẢN PHẨM
                                                    <ChevronDown className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="text-[10px] text-neutral-400 tracking-widest uppercase">
                                            Đã hiển thị tất cả {filteredProperties.length} sản phẩm
                                        </div>
                                    )}

                                    <div className="text-[9px] text-neutral-400 tracking-wider">
                                        Hiển thị {displayedProperties.length} / {filteredProperties.length} sản phẩm
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </div>

            {/* Preview Modal */}
            <PropertyPreviewModal
                property={selectedProperty}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onViewDetail={handleViewDetail}
            />
        </>
    );
}

export default ListingsScreen;