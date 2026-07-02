"use client";

import React, { useContext, useMemo } from 'react';
import { Building2, Users, Eye, TrendingUp, Menu, Home, MapPin, Layers, AlertCircle, CheckCircle, XCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { AdminContext } from './AdminClientLayout';
import { Property, HouseType, SaleStatus, Direction, AlleyType } from '@/types';

export default function AdminDashboardClient() {
    const { user, sidebarCollapsed, toggleSidebar, properties = [] } = useContext(AdminContext);

    // Tính toán số liệu thống kê từ dữ liệu properties
    const stats = useMemo(() => {
        const total = properties.length;
        const displaying = properties.filter((p: Property) => p.saleStatus === 'dang_ban').length;
        const staffSet = new Set(properties.map((p: Property) => p.contactName).filter(Boolean));
        const staffCount = staffSet.size;
        const totalViews = properties.reduce((sum: number, p: Property) => {
            const views = (p as any).views || 0;
            return sum + views;
        }, 0);
        
        return [
            { 
                label: 'Tổng BĐS', 
                value: total.toString(), 
                icon: Building2, 
                color: 'bg-blue-500' 
            },
            { 
                label: 'Đang hiển thị', 
                value: displaying.toString(), 
                icon: Eye, 
                color: 'bg-emerald-500' 
            },
            { 
                label: 'Nhân viên', 
                value: staffCount.toString(), 
                icon: Users, 
                color: 'bg-purple-500' 
            },
            { 
                label: 'Lượt xem', 
                value: totalViews > 0 ? totalViews.toLocaleString() : '0', 
                icon: TrendingUp, 
                color: 'bg-amber-500' 
            },
        ];
    }, [properties]);

    // Thống kê theo loại nhà
    const houseTypeStats = useMemo(() => {
        const stats: Record<HouseType, number> = {
            'nha_cap_4': 0,
            'dat': 0,
            'nha_mat_tien': 0,
            'nha_hem': 0,
            'biet_thu': 0,
            'chung_cu': 0,
            'nha_pho': 0,
            'khac': 0
        };
        
        properties.forEach((p: Property) => {
            const type = p.houseType || 'khac';
            stats[type] = (stats[type] || 0) + 1;
        });
        
        return Object.entries(stats)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1]);
    }, [properties]);

    // Thống kê theo trạng thái
    const statusStats = useMemo(() => {
        const dangBan = properties.filter((p: Property) => p.saleStatus === 'dang_ban').length;
        const daBan = properties.filter((p: Property) => p.saleStatus === 'da_ban').length;
        const total = properties.length;
        const dangBanPercentage = total > 0 ? Math.round((dangBan / total) * 100) : 0;
        const daBanPercentage = total > 0 ? Math.round((daBan / total) * 100) : 0;
        
        return { dangBan, daBan, total, dangBanPercentage, daBanPercentage };
    }, [properties]);

    // Thống kê theo hướng
    const directionStats = useMemo(() => {
        const stats: Record<Direction, number> = {
            'dong': 0,
            'tay': 0,
            'nam': 0,
            'bac': 0,
            'tay_bac': 0,
            'tay_nam': 0,
            'dong_bac': 0,
            'dong_nam': 0,
            'khong_xac_dinh': 0
        };
        
        properties.forEach((p: Property) => {
            const direction = p.direction || 'khong_xac_dinh';
            stats[direction] = (stats[direction] || 0) + 1;
        });
        
        return Object.entries(stats)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }, [properties]);

    // Thống kê các vấn đề
    const issueStats = useMemo(() => {
        const withPlanningIssue = properties.filter((p: Property) => p.hasPlanningIssue).length;
        const withRoadWidthIssue = properties.filter((p: Property) => p.hasRoadWidthIssue).length;
        const withFengShuiIssue = properties.filter((p: Property) => p.hasFengShuiIssue).length;
        const withBuildingPermit = properties.filter((p: Property) => p.hasBuildingPermit).length;
        const withConstructionApproval = properties.filter((p: Property) => p.hasConstructionApproval).length;
        const withFullConstructionApproval = properties.filter((p: Property) => p.hasFullConstructionApproval).length;
        const withCashFlow = properties.filter((p: Property) => p.hasCashFlow).length;
        const hardToAccess = properties.filter((p: Property) => p.isHardToAccess).length;
        const inExistingResidentialArea = properties.filter((p: Property) => p.isInExistingResidentialArea).length;
        const total = properties.length;
        
        return {
            withPlanningIssue,
            withRoadWidthIssue,
            withFengShuiIssue,
            withBuildingPermit,
            withConstructionApproval,
            withFullConstructionApproval,
            withCashFlow,
            hardToAccess,
            inExistingResidentialArea,
            total
        };
    }, [properties]);

    // Thống kê diện tích và giá
    const areaPriceStats = useMemo(() => {
        if (properties.length === 0) return null;
        
        const areas = properties.map((p: Property) => p.area);
        const prices = properties.map((p: Property) => p.price);
        
        const avgArea = Math.round(areas.reduce((a, b) => a + b, 0) / areas.length);
        const minArea = Math.min(...areas);
        const maxArea = Math.max(...areas);
        
        const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        return { avgArea, minArea, maxArea, avgPrice, minPrice, maxPrice };
    }, [properties]);

    // Lấy 5 BĐS gần đây nhất
    const recentProperties = useMemo(() => {
        if (properties.length === 0) return [];
        
        return properties.slice(0, 5).map((p: Property) => ({
            id: p.id,
            title: p.title || 'Bất động sản',
            status: p.saleStatus === 'dang_ban' ? 'Đang bán' : 'Đã bán',
            price: p.price,
            address: p.address,
            contactName: p.contactName,
            houseType: p.houseType
        }));
    }, [properties]);

    // Hàm format giá tiền
    const formatPrice = (price: number): string => {
        if (!price) return '0';
        if (price >= 1000000000) {
            return (price / 1000000000).toFixed(1) + ' tỷ';
        } else if (price >= 1000000) {
            return (price / 1000000).toFixed(0) + ' tr';
        }
        return price.toLocaleString();
    };

    // Hàm lấy tên hiển thị cho loại nhà
    const getHouseTypeLabel = (type: string): string => {
        const map: Record<string, string> = {
            'nha_cap_4': 'Nhà cấp 4',
            'dat': 'Đất',
            'nha_mat_tien': 'Nhà mặt tiền',
            'nha_hem': 'Nhà hẻm',
            'biet_thu': 'Biệt thự',
            'chung_cu': 'Chung cư',
            'nha_pho': 'Nhà phố',
            'khac': 'Khác'
        };
        return map[type] || type;
    };

    // Hàm lấy tên hiển thị cho hướng
    const getDirectionLabel = (direction: string): string => {
        const map: Record<string, string> = {
            'dong': 'Đông',
            'tay': 'Tây',
            'nam': 'Nam',
            'bac': 'Bắc',
            'tay_bac': 'Tây Bắc',
            'tay_nam': 'Tây Nam',
            'dong_bac': 'Đông Bắc',
            'dong_nam': 'Đông Nam',
            'khong_xac_dinh': 'Không xác định'
        };
        return map[direction] || direction;
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-[0.2em] uppercase dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">
                        Chào mừng {user?.name || 'Admin'} trở lại
                    </p>
                    {properties.length > 0 && (
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                            Quản lý {properties.length} BĐS
                        </p>
                    )}
                </div>

                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-800"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* 4 thống kê chính */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] tracking-widest text-neutral-400 uppercase">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-semibold mt-2 dark:text-white transition-all duration-300">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p-3 ${stat.color} bg-opacity-10 dark:bg-opacity-20 rounded-lg`}>
                                <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Thống kê chi tiết */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Loại nhà */}
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Home className="w-4 h-4 text-neutral-400" />
                        <h3 className="text-xs font-semibold tracking-widest uppercase dark:text-white">
                            Loại nhà
                        </h3>
                    </div>
                    <div className="space-y-2">
                        {houseTypeStats.length > 0 ? (
                            houseTypeStats.map(([type, count]) => (
                                <div key={type} className="flex justify-between text-xs">
                                    <span className="text-neutral-600 dark:text-neutral-400">
                                        {getHouseTypeLabel(type)}
                                    </span>
                                    <span className="font-semibold dark:text-white">{count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-neutral-400 text-center py-4">
                                Chưa có dữ liệu
                            </p>
                        )}
                    </div>
                </div>

                {/* Trạng thái bán */}
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Layers className="w-4 h-4 text-neutral-400" />
                        <h3 className="text-xs font-semibold tracking-widest uppercase dark:text-white">
                            Trạng thái bán
                        </h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-neutral-600 dark:text-neutral-400">Đang bán</span>
                            </span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {statusStats.dangBan} ({statusStats.dangBanPercentage}%)
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-neutral-600 dark:text-neutral-400">Đã bán</span>
                            </span>
                            <span className="font-semibold text-red-600 dark:text-red-400">
                                {statusStats.daBan} ({statusStats.daBanPercentage}%)
                            </span>
                        </div>
                        <div className="flex justify-between text-xs pt-2 border-t border-neutral-200 dark:border-neutral-900">
                            <span className="text-neutral-600 dark:text-neutral-400">Tổng</span>
                            <span className="font-semibold dark:text-white">{statusStats.total}</span>
                        </div>
                    </div>
                </div>

                {/* Hướng nhà */}
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-neutral-400" />
                        <h3 className="text-xs font-semibold tracking-widest uppercase dark:text-white">
                            Hướng nhà
                        </h3>
                    </div>
                    <div className="space-y-2">
                        {directionStats.length > 0 ? (
                            directionStats.map(([direction, count]) => (
                                <div key={direction} className="flex justify-between text-xs">
                                    <span className="text-neutral-600 dark:text-neutral-400">
                                        {getDirectionLabel(direction)}
                                    </span>
                                    <span className="font-semibold dark:text-white">{count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-neutral-400 text-center py-4">
                                Chưa có dữ liệu
                            </p>
                        )}
                    </div>
                </div>

                {/* Vấn đề */}
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-4 h-4 text-neutral-400" />
                        <h3 className="text-xs font-semibold tracking-widest uppercase dark:text-white">
                            Vấn đề pháp lý
                        </h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-2">
                                <XCircle className="w-3 h-3 text-rose-500" />
                                <span className="text-neutral-600 dark:text-neutral-400">Dính quy hoạch</span>
                            </span>
                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                                {issueStats.withPlanningIssue}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-2">
                                <XCircle className="w-3 h-3 text-rose-500" />
                                <span className="text-neutral-600 dark:text-neutral-400">Dính lộ giới</span>
                            </span>
                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                                {issueStats.withRoadWidthIssue}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                <span className="text-neutral-600 dark:text-neutral-400">Có GPXD</span>
                            </span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {issueStats.withBuildingPermit}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                <span className="text-neutral-600 dark:text-neutral-400">Hoàn công</span>
                            </span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {issueStats.withConstructionApproval}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tiện ích */}
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-neutral-400" />
                        <h3 className="text-xs font-semibold tracking-widest uppercase dark:text-white">
                            Tiện ích
                        </h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-2">
                                <ArrowUp className="w-3 h-3 text-emerald-500" />
                                <span className="text-neutral-600 dark:text-neutral-400">Có dòng tiền</span>
                            </span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {issueStats.withCashFlow}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                <span className="text-neutral-600 dark:text-neutral-400">KDC hiện hữu</span>
                            </span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {issueStats.inExistingResidentialArea}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-2">
                                <ArrowDown className="w-3 h-3 text-amber-500" />
                                <span className="text-neutral-600 dark:text-neutral-400">Đường khó đi</span>
                            </span>
                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                                {issueStats.hardToAccess}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Diện tích & Giá */}
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Layers className="w-4 h-4 text-neutral-400" />
                        <h3 className="text-xs font-semibold tracking-widest uppercase dark:text-white">
                            Diện tích & Giá
                        </h3>
                    </div>
                    {areaPriceStats ? (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-neutral-600 dark:text-neutral-400">Diện tích TB</span>
                                <span className="font-semibold dark:text-white">{areaPriceStats.avgArea} m²</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-neutral-600 dark:text-neutral-400">Diện tích (min - max)</span>
                                <span className="font-semibold dark:text-white">
                                    {areaPriceStats.minArea} - {areaPriceStats.maxArea} m²
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-neutral-600 dark:text-neutral-400">Giá TB</span>
                                <span className="font-semibold dark:text-white">{formatPrice(areaPriceStats.avgPrice)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-neutral-600 dark:text-neutral-400">Giá (min - max)</span>
                                <span className="font-semibold dark:text-white">
                                    {formatPrice(areaPriceStats.minPrice)} - {formatPrice(areaPriceStats.maxPrice)}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-neutral-400 text-center py-4">
                            Chưa có dữ liệu
                        </p>
                    )}
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6">
                    <h3 className="text-xs font-semibold tracking-widest uppercase dark:text-white border-b border-neutral-200 dark:border-neutral-900 pb-3 mb-4">
                        BĐS gần đây
                    </h3>
                    <div className="space-y-3">
                        {recentProperties.length > 0 ? (
                            recentProperties.map((property) => (
                                <div key={property.id} className="flex items-center gap-3 text-xs">
                                    <div className={`w-2 h-2 rounded-full ${property.status === 'Đang bán' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-neutral-600 dark:text-neutral-400 truncate">
                                            {property.title}
                                        </p>
                                        <p className="text-[10px] text-neutral-500 truncate">
                                            {property.address}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                                            {formatPrice(property.price)}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${
                                            property.status === 'Đang bán' 
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                            {property.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-neutral-400 text-center py-4">
                                Chưa có dữ liệu BĐS
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6">
                    <h3 className="text-xs font-semibold tracking-widest uppercase dark:text-white border-b border-neutral-200 dark:border-neutral-900 pb-3 mb-4">
                        Thống kê nhanh
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400">BĐS đang bán</span>
                            <span className="font-semibold dark:text-white">{statusStats.dangBan}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400">BĐS đã bán</span>
                            <span className="font-semibold dark:text-white">{statusStats.daBan}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400">Tổng BĐS</span>
                            <span className="font-semibold dark:text-white">{statusStats.total}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400">Tỷ lệ đang bán</span>
                            <span className="font-semibold dark:text-white">{statusStats.dangBanPercentage}%</span>
                        </div>
                        <div className="flex justify-between text-xs pt-2 border-t border-neutral-200 dark:border-neutral-900">
                            <span className="text-neutral-600 dark:text-neutral-400">Loại nhà phổ biến</span>
                            <span className="font-semibold dark:text-white">
                                {houseTypeStats.length > 0 ? getHouseTypeLabel(houseTypeStats[0][0]) : 'Chưa có'}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400">Diện tích TB</span>
                            <span className="font-semibold dark:text-white">
                                {areaPriceStats ? `${areaPriceStats.avgArea} m²` : 'Chưa có'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}