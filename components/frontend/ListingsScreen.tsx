import React, { useState, useMemo, useEffect } from 'react';
import { Property, FilterState } from '@/types';
import { 
    TARGET_DISTRICTS, 
    HOUSE_TYPES, 
    ALLEY_TYPES, 
    DIRECTIONS, 
    SALE_STATUSES,
    ALLEY_END_TYPES
} from '@/configs/constants';
import { PropertyCard } from './PropertyCard';
import { 
    Filter, 
    Grid, 
    List, 
    X, 
    Search, 
    MapPin, 
    DollarSign, 
    Ruler, 
    Home, 
    Building2, 
    Car, 
    Compass, 
    TrendingUp,
    Shield,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';

interface ListingsScreenProps {
    properties: Property[];
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    navigateTo: (tab: string, id?: string) => void;
    isLoading?: boolean;
}

type ViewMode = 'grid' | 'list';

export function ListingsScreen({
    properties,
    filters,
    setFilters,
    navigateTo,
    isLoading = false
}: ListingsScreenProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [showFilter, setShowFilter] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    // Local filter state để áp dụng khi bấm Enter hoặc Apply
    const [localFilters, setLocalFilters] = useState<FilterState>(filters);

    // Reset local filters khi filters thay đổi từ bên ngoài
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    // Lọc sản phẩm dựa trên filters
    const filteredProperties = useMemo(() => {
        return properties.filter((prop) => {
            // Tìm kiếm theo từ khóa
            if (localFilters.search) {
                const text = localFilters.search.toLowerCase();
                const matchesTitle = prop.title.toLowerCase().includes(text);
                const matchesDesc = prop.description.toLowerCase().includes(text);
                const matchesAddr = prop.address.toLowerCase().includes(text);
                if (!matchesTitle && !matchesDesc && !matchesAddr) return false;
            }

            // Lọc theo khu vực
            if (localFilters.location && prop.district !== localFilters.location) return false;

            // Lọc theo giá
            if (localFilters.minPrice && prop.price < Number(localFilters.minPrice)) return false;
            if (localFilters.maxPrice && prop.price > Number(localFilters.maxPrice)) return false;

            // Lọc theo diện tích
            if (localFilters.minArea && prop.area < Number(localFilters.minArea)) return false;
            if (localFilters.maxArea && prop.area > Number(localFilters.maxArea)) return false;

            // Lọc theo loại nhà
            if (localFilters.houseType && prop.houseType !== localFilters.houseType) return false;

            // Lọc theo số tầng
            if (localFilters.minFloors && prop.floors < Number(localFilters.minFloors)) return false;
            if (localFilters.maxFloors && prop.floors > Number(localFilters.maxFloors)) return false;

            // Lọc theo số tầng (chung cư)
            if (localFilters.minFloor && prop.floorNumber < Number(localFilters.minFloor)) return false;
            if (localFilters.maxFloor && prop.floorNumber > Number(localFilters.maxFloor)) return false;

            // Lọc theo loại hẻm
            if (localFilters.alleyType && prop.alleyType !== localFilters.alleyType) return false;

            // Lọc theo hướng
            if (localFilters.direction && prop.direction !== localFilters.direction) return false;

            // Lọc theo trạng thái bán
            if (localFilters.saleStatus && prop.saleStatus !== localFilters.saleStatus) return false;

            // Lọc theo tên dự án
            if (localFilters.projectName) {
                const project = localFilters.projectName.toLowerCase();
                if (!prop.projectName?.toLowerCase().includes(project)) return false;
            }

            // Lọc theo chiều ngang
            if (localFilters.minWidth && prop.width < Number(localFilters.minWidth)) return false;
            if (localFilters.maxWidth && prop.width > Number(localFilters.maxWidth)) return false;

            // Boolean filters
            if (localFilters.hasPlanningIssue !== undefined && prop.hasPlanningIssue !== localFilters.hasPlanningIssue) return false;
            if (localFilters.hasRoadWidthIssue !== undefined && prop.hasRoadWidthIssue !== localFilters.hasRoadWidthIssue) return false;
            if (localFilters.hasConstructionApproval !== undefined && prop.hasConstructionApproval !== localFilters.hasConstructionApproval) return false;
            if (localFilters.hasCashFlow !== undefined && prop.hasCashFlow !== localFilters.hasCashFlow) return false;
            if (localFilters.hasBuildingPermit !== undefined && prop.hasBuildingPermit !== localFilters.hasBuildingPermit) return false;
            if (localFilters.isInExistingResidentialArea !== undefined && prop.isInExistingResidentialArea !== localFilters.isInExistingResidentialArea) return false;

            return true;
        });
    }, [properties, localFilters]);

    // Áp dụng filter
    const applyFilters = () => {
        setFilters(localFilters);
        setShowFilter(false);
    };

    // Reset filter
    const clearFilters = () => {
        const emptyFilters: FilterState = {
            search: '',
            type: 'sale',
            minPrice: '',
            maxPrice: '',
            minArea: '',
            maxArea: '',
            location: '',
        };
        setLocalFilters(emptyFilters);
        setFilters(emptyFilters);
        setShowFilter(false);
    };

    // Đếm số filter đang active
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (localFilters.search) count++;
        if (localFilters.location) count++;
        if (localFilters.minPrice || localFilters.maxPrice) count++;
        if (localFilters.minArea || localFilters.maxArea) count++;
        if (localFilters.houseType) count++;
        if (localFilters.saleStatus) count++;
        if (localFilters.direction) count++;
        if (localFilters.alleyType) count++;
        if (localFilters.minFloors || localFilters.maxFloors) count++;
        if (localFilters.minFloor || localFilters.maxFloor) count++;
        if (localFilters.minWidth || localFilters.maxWidth) count++;
        if (localFilters.projectName) count++;
        if (localFilters.hasPlanningIssue !== undefined) count++;
        if (localFilters.hasRoadWidthIssue !== undefined) count++;
        if (localFilters.hasConstructionApproval !== undefined) count++;
        if (localFilters.hasCashFlow !== undefined) count++;
        if (localFilters.hasBuildingPermit !== undefined) count++;
        if (localFilters.isInExistingResidentialArea !== undefined) count++;
        return count;
    }, [localFilters]);

    // Xử lý Enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-neutral-900 dark:text-white mx-auto" />
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
            className="space-y-6"
        >
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-900 pb-6">
                <div>
                    <h1 className="text-lg font-semibold tracking-[0.2em] uppercase dark:text-white">
                        DANH SÁCH BẤT ĐỘNG SẢN
                    </h1>
                    <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">
                        Tìm thấy {filteredProperties.length} kết quả phù hợp
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* View mode buttons */}
                    <div className="flex border border-neutral-200 dark:border-neutral-800 divide-x divide-neutral-200 dark:divide-neutral-800">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 transition-colors ${viewMode === 'grid' 
                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950' 
                                : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
                            }`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 transition-colors ${viewMode === 'list' 
                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950' 
                                : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
                            }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Filter button với badge */}
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className={`relative border px-4 py-2 text-[10px] tracking-widest uppercase font-medium transition-colors flex items-center gap-2 ${
                            showFilter 
                                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950' 
                                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white'
                        }`}
                    >
                        <Filter className="w-3.5 h-3.5" />
                        BỘ LỌC
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[8px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* FILTER PANEL - Full width khi mở */}
            {showFilter && (
                <div className="border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 space-y-6 animate-in slide-in-from-top-5 duration-200">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-3">
                        <span className="text-xs font-semibold tracking-widest uppercase dark:text-white flex items-center gap-2">
                            <Filter className="w-3.5 h-3.5 stroke-[1.5]" /> 
                            BỘ LỌC NÂNG CAO
                            {activeFilterCount > 0 && (
                                <span className="text-[9px] text-neutral-400 font-normal">
                                    ({activeFilterCount} filter đang áp dụng)
                                </span>
                            )}
                        </span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={clearFilters}
                                className="text-[10px] text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 uppercase tracking-widest transition-colors"
                            >
                                XÓA TẤT CẢ
                            </button>
                            <button
                                onClick={() => setShowFilter(false)}
                                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" onKeyDown={handleKeyDown}>
                        {/* Tìm kiếm */}
                        <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                <Search className="w-3 h-3" /> TỪ KHÓA
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập tên đường, dự án..."
                                value={localFilters.search}
                                onChange={e => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                            />
                        </div>

                        {/* Khu vực */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> KHU VỰC
                            </label>
                            <select
                                value={localFilters.location}
                                onChange={e => setLocalFilters(prev => ({ ...prev, location: e.target.value }))}
                                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                            >
                                <option value="">TẤT CẢ KHU VỰC</option>
                                {TARGET_DISTRICTS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        {/* Loại nhà */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                <Home className="w-3 h-3" /> LOẠI NHÀ
                            </label>
                            <select
                                value={localFilters.houseType || ''}
                                onChange={e => setLocalFilters(prev => ({ ...prev, houseType: e.target.value || undefined }))}
                                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                            >
                                <option value="">TẤT CẢ LOẠI</option>
                                {HOUSE_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Trạng thái bán */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> TRẠNG THÁI
                            </label>
                            <select
                                value={localFilters.saleStatus || ''}
                                onChange={e => setLocalFilters(prev => ({ ...prev, saleStatus: e.target.value || undefined }))}
                                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                            >
                                <option value="">TẤT CẢ</option>
                                {SALE_STATUSES.map((status) => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Giá */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                <DollarSign className="w-3 h-3" /> GIÁ (VNĐ)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    placeholder="MIN"
                                    value={localFilters.minPrice}
                                    onChange={e => setLocalFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                                <input
                                    type="number"
                                    placeholder="MAX"
                                    value={localFilters.maxPrice}
                                    onChange={e => setLocalFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Diện tích */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                <Ruler className="w-3 h-3" /> DIỆN TÍCH (M²)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    placeholder="MIN"
                                    value={localFilters.minArea}
                                    onChange={e => setLocalFilters(prev => ({ ...prev, minArea: e.target.value }))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                                <input
                                    type="number"
                                    placeholder="MAX"
                                    value={localFilters.maxArea}
                                    onChange={e => setLocalFilters(prev => ({ ...prev, maxArea: e.target.value }))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Số tầng */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                <Building2 className="w-3 h-3" /> SỐ TẦNG
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    placeholder="MIN"
                                    value={localFilters.minFloors || ''}
                                    onChange={e => setLocalFilters(prev => ({ ...prev, minFloors: e.target.value }))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                                <input
                                    type="number"
                                    placeholder="MAX"
                                    value={localFilters.maxFloors || ''}
                                    onChange={e => setLocalFilters(prev => ({ ...prev, maxFloors: e.target.value }))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Hướng */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                <Compass className="w-3 h-3" /> HƯỚNG
                            </label>
                            <select
                                value={localFilters.direction || ''}
                                onChange={e => setLocalFilters(prev => ({ ...prev, direction: e.target.value || undefined }))}
                                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                            >
                                <option value="">TẤT CẢ HƯỚNG</option>
                                {DIRECTIONS.map((dir) => (
                                    <option key={dir.value} value={dir.value}>{dir.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Loại hẻm */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                <Car className="w-3 h-3" /> LOẠI HẺM
                            </label>
                            <select
                                value={localFilters.alleyType || ''}
                                onChange={e => setLocalFilters(prev => ({ ...prev, alleyType: e.target.value || undefined }))}
                                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                            >
                                <option value="">TẤT CẢ LOẠI</option>
                                {ALLEY_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tên dự án */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                <Building2 className="w-3 h-3" /> DỰ ÁN
                            </label>
                            <input
                                type="text"
                                placeholder="Tên dự án..."
                                value={localFilters.projectName || ''}
                                onChange={e => setLocalFilters(prev => ({ ...prev, projectName: e.target.value || undefined }))}
                                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                            />
                        </div>

                    </div>

                    {/* Filter Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                        <button
                            onClick={applyFilters}
                            className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 py-3 text-xs tracking-widest uppercase font-semibold transition-colors"
                        >
                            ÁP DỤNG BỘ LỌC
                            <span className="ml-2 text-[9px] opacity-60">(Enter)</span>
                        </button>
                        <button
                            onClick={clearFilters}
                            className="flex-1 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white py-3 text-xs tracking-widest uppercase transition-colors"
                        >
                            XÓA TẤT CẢ
                        </button>
                    </div>
                </div>
            )}

            {/* RESULTS */}
            <section>
                {filteredProperties.length === 0 ? (
                    <div className="border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 text-center py-20 px-6">
                        <h3 className="text-xs font-semibold tracking-widest uppercase mb-2 dark:text-white">
                            KHÔNG TÌM THẤY KẾT QUẢ
                        </h3>
                        <p className="text-[11px] text-neutral-400 tracking-wider uppercase mb-6 max-w-xs mx-auto leading-relaxed">
                            Hãy điều chỉnh thông số bộ lọc để tìm kiếm các lựa chọn không gian tối giản khác.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="border border-neutral-900 dark:border-white px-6 py-2.5 text-xs tracking-widest uppercase font-medium transition-colors hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950"
                        >
                            ĐẶT LẠI BỘ LỌC
                        </button>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' 
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                        : 'space-y-4'
                    }>
                        {filteredProperties.map((prop) => (
                            <PropertyCard 
                                key={prop.id} 
                                property={prop} 
                                navigateTo={navigateTo}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ListingsScreen;