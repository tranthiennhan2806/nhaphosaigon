import React from 'react';
import { Property } from '@/types';
import {
    MapPin, Bed, Bath, Maximize, Info,
    AlertCircle, CheckCircle, XCircle,
    Home, Ruler, Map, Car, Building2,
    DollarSign, Users, Navigation
} from 'lucide-react';
import {
    HOUSE_TYPES,
    ALLEY_TYPES,
    FENG_SHUI_ISSUES,
    NEIGHBOR_TYPES,
    ALLEY_END_TYPES
} from '@/configs/constants';

interface PropertyDetailInfoProps {
    property: Property;
}

export function PropertyDetailInfo({ property }: PropertyDetailInfoProps) {
    const getHouseTypeLabel = (value: string) => {
        const found = HOUSE_TYPES.find(t => t.value === value);
        return found ? found.label : value;
    };

    const getAlleyTypeLabel = (value: string) => {
        const found = ALLEY_TYPES.find(t => t.value === value);
        return found ? found.label : value;
    };

    const getFengShuiLabel = (value: string) => {
        const found = FENG_SHUI_ISSUES.find(t => t.value === value);
        return found ? found.label : value;
    };

    const getNeighborLabel = (value: string) => {
        const found = NEIGHBOR_TYPES.find(t => t.value === value);
        return found ? found.label : value;
    };

    const getAlleyEndLabel = (value: string) => {
        const found = ALLEY_END_TYPES.find(t => t.value === value);
        return found ? found.label : value;
    };

    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 space-y-6">
            <h3 className="font-semibold text-xs tracking-widest uppercase border-b border-neutral-100 dark:border-neutral-900 pb-3 dark:text-white">
                THÔNG TIN CHI TIẾT BẤT ĐỘNG SẢN
            </h3>

            <div className="grid grid-cols-2 gap-6">
                {/* Thông tin cơ bản */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-neutral-400" />
                        <div>
                            <span className="text-[9px] text-neutral-400 block">LOẠI NHÀ</span>
                            <span className="font-semibold dark:text-white text-xs">{getHouseTypeLabel(property.houseType)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-neutral-400" />
                        <div>
                            <span className="text-[9px] text-neutral-400 block">SỐ TẦNG</span>
                            <span className="font-semibold dark:text-white text-xs">{property.floors} tầng</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-neutral-400" />
                        <div>
                            <span className="text-[9px] text-neutral-400 block">KÍCH THƯỚC</span>
                            <span className="font-semibold dark:text-white text-xs">Ngang {property.width}m x Dài {property.length}m</span>
                        </div>
                    </div>
                </div>

                {/* Thông tin hẻm */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-neutral-400" />
                        <div>
                            <span className="text-[9px] text-neutral-400 block">VỊ TRÍ HẺM</span>
                            <span className="font-semibold dark:text-white text-xs">
                                Xẹt {property.alleyDepth} - {getAlleyTypeLabel(property.alleyType)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-neutral-400" />
                        <div>
                            <span className="text-[9px] text-neutral-400 block">LOẠI HẺM</span>
                            <span className="font-semibold dark:text-white text-xs">{getAlleyEndLabel(property.alleyEndType)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-neutral-400" />
                        <div>
                            <span className="text-[9px] text-neutral-400 block">ĐƯỜNG VÀO</span>
                            <span className={`font-semibold text-xs ${property.isHardToAccess ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {property.isHardToAccess ? 'KHÓ ĐI' : 'DỄ ĐI'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pháp lý */}
            <div className="border-t border-neutral-100 dark:border-neutral-900 pt-4">
                <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">PHÁP LÝ</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        {property.hasPlanningIssue ? (
                            <XCircle className="w-4 h-4 text-rose-600" />
                        ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                        )}
                        <span className="text-xs">
                            {property.hasPlanningIssue ? 'Dính quy hoạch' : 'Không quy hoạch'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {property.hasRoadWidthIssue ? (
                            <XCircle className="w-4 h-4 text-rose-600" />
                        ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                        )}
                        <span className="text-xs">
                            {property.hasRoadWidthIssue ? 'Dính lộ giới' : 'Không lộ giới'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {property.hasConstructionApproval ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                            <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                        <span className="text-xs">
                            {property.hasConstructionApproval ? 'Đã hoàn công' : 'Chưa hoàn công'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {property.hasFullConstructionApproval ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                            <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                        <span className="text-xs">
                            {property.hasFullConstructionApproval ? 'Hoàn công đầy đủ' : 'Hoàn công chưa đầy đủ'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Phong thủy & Hàng xóm */}
            <div className="border-t border-neutral-100 dark:border-neutral-900 pt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">PHONG THỦY</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                {property.hasFengShuiIssue ? (
                                    <AlertCircle className="w-4 h-4 text-amber-600" />
                                ) : (
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                )}
                                <span className="text-xs">
                                    {property.hasFengShuiIssue ? 'Có lỗi phong thủy' : 'Không lỗi phong thủy'}
                                </span>
                            </div>
                            {property.hasFengShuiIssue && (
                                <div className="text-xs text-neutral-400 pl-6">
                                    {getFengShuiLabel(property.fengShuiIssue)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">MÔI TRƯỜNG</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-neutral-400" />
                                <span className="text-xs">Hàng xóm: {getNeighborLabel(property.neighborType)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-neutral-400" />
                                <span className="text-xs">
                                    {property.hasCashFlow ? 'Có dòng tiền' : 'Không dòng tiền'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Maps */}
            {property.googleMapCoordinates && (
                <div className="border-t border-neutral-100 dark:border-neutral-900 pt-4">
                    <div className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-neutral-400" />
                        <div>
                            <span className="text-[9px] text-neutral-400 block">TỌA ĐỘ GOOGLE MAP</span>
                            <a
                                href={`https://www.google.com/maps?q=${property.googleMapCoordinates}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono"
                            >
                                {property.googleMapCoordinates}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PropertyDetailInfo;