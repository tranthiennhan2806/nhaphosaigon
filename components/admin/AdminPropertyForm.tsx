import React, { useState, useEffect } from 'react';
import { Property } from '@/types';
import {
    X, Upload, Trash2, Loader2,
    Bed, Bath, Building2, Ruler,
    Navigation, Car, Users,
    MapPin, Home, AlertCircle,
    TrendingUp, Compass, FileCheck,
    GripVertical, Plus
} from 'lucide-react';
import {
    TARGET_DISTRICTS,
    HOUSE_TYPES,
    ALLEY_TYPES,
    FENG_SHUI_ISSUES,
    NEIGHBOR_TYPES,
    ALLEY_END_TYPES,
    DIRECTIONS,
    SALE_STATUSES
} from '@/configs/constants';

interface AdminPropertyFormProps {
    initialData?: Partial<Property>;
    onSubmit: (data: Property) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function AdminPropertyForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}: AdminPropertyFormProps) {
    const isEditing = !!initialData?.id;

    // Form state
    const [formData, setFormData] = useState<Partial<Property>>({
        title: '',
        description: '',
        price: 0,
        area: 0,
        address: '',
        district: 'Quận 1',
        bedrooms: 2,
        bathrooms: 2,
        images: [],
        contactName: '',
        contactPhone: '',
        hasPlanningIssue: false,
        hasRoadWidthIssue: false,
        houseType: 'nha_pho',
        googleMapCoordinates: '',
        alleyDepth: 0,
        alleyType: 'khac',
        width: 0,
        length: 0,
        hasConstructionApproval: false,
        hasFullConstructionApproval: false,
        floors: 0,
        hasCashFlow: false,
        hasFengShuiIssue: false,
        fengShuiIssue: 'khong',
        isHardToAccess: false,
        neighborType: 'khac',
        alleyEndType: 'khong_xac_dinh',
        saleStatus: 'dang_ban',
        floorNumber: 0,
        direction: 'khong_xac_dinh',
        isInExistingResidentialArea: false,
        sensitiveImages: [],
        hasBuildingPermit: false,
        notes: '',
        projectName: ''
    });

    // State cho danh sách URL ảnh thường
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    // State cho input URL đang nhập - mỗi input có id riêng
    const [urlInputs, setUrlInputs] = useState<{ id: string; value: string }[]>([
        { id: 'img-0', value: '' }
    ]);

    // State cho danh sách URL ảnh nhạy cảm
    const [sensitiveImageUrls, setSensitiveImageUrls] = useState<string[]>([]);
    const [sensitiveUrlInputs, setSensitiveUrlInputs] = useState<{ id: string; value: string }[]>([
        { id: 'sensitive-0', value: '' }
    ]);

    // Drag state cho ảnh thường
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Load initial data
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setImageUrls(initialData.images || []);
            setSensitiveImageUrls(initialData.sensitiveImages || []);

            // Nếu có ảnh thì tạo input tương ứng, nếu không thì giữ 1 input rỗng
            const imageCount = (initialData.images || []).length;
            if (imageCount > 0) {
                setUrlInputs(Array.from({ length: imageCount }, (_, i) => ({
                    id: `img-${i}`,
                    value: initialData.images?.[i] || ''
                })));
            }

            const sensitiveCount = (initialData.sensitiveImages || []).length;
            if (sensitiveCount > 0) {
                setSensitiveUrlInputs(Array.from({ length: sensitiveCount }, (_, i) => ({
                    id: `sensitive-${i}`,
                    value: initialData.sensitiveImages?.[i] || ''
                })));
            }
        }
    }, [initialData]);

    const handleChange = (field: keyof Property, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Thêm input URL ảnh mới
    const addImageInput = () => {
        const newId = `img-${Date.now()}`;
        setUrlInputs(prev => [...prev, { id: newId, value: '' }]);
    };

    // Thêm input URL ảnh nhạy cảm mới
    const addSensitiveImageInput = () => {
        const newId = `sensitive-${Date.now()}`;
        setSensitiveUrlInputs(prev => [...prev, { id: newId, value: '' }]);
    };

    // Cập nhật giá trị input URL
    const updateUrlInput = (id: string, value: string) => {
        setUrlInputs(prev => prev.map(item =>
            item.id === id ? { ...item, value } : item
        ));
    };

    // Cập nhật giá trị input URL nhạy cảm
    const updateSensitiveUrlInput = (id: string, value: string) => {
        setSensitiveUrlInputs(prev => prev.map(item =>
            item.id === id ? { ...item, value } : item
        ));
    };

    // Xóa input URL ảnh thường
    const removeUrlInput = (id: string) => {
        if (urlInputs.length <= 1) {
            alert('Phải có ít nhất 1 ô nhập URL');
            return;
        }
        setUrlInputs(prev => prev.filter(item => item.id !== id));
        // Cập nhật lại imageUrls
        const remainingUrls = urlInputs
            .filter(item => item.id !== id)
            .map(item => item.value)
            .filter(value => value.trim() !== '');
        setImageUrls(remainingUrls);
        handleChange('images', remainingUrls);
    };

    // Xóa input URL ảnh nhạy cảm
    const removeSensitiveUrlInput = (id: string) => {
        if (sensitiveUrlInputs.length <= 1) {
            alert('Phải có ít nhất 1 ô nhập URL');
            return;
        }
        setSensitiveUrlInputs(prev => prev.filter(item => item.id !== id));
        const remainingUrls = sensitiveUrlInputs
            .filter(item => item.id !== id)
            .map(item => item.value)
            .filter(value => value.trim() !== '');
        setSensitiveImageUrls(remainingUrls);
        handleChange('sensitiveImages', remainingUrls);
    };

    // Xóa URL ảnh đã lưu (khi xóa input)
    const removeImageUrl = (index: number) => {
        const newImages = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newImages);
        handleChange('images', newImages);
        // Cập nhật lại inputs
        const newInputs = urlInputs.filter((_, i) => i !== index);
        setUrlInputs(newInputs);
    };

    // Xóa URL ảnh nhạy cảm đã lưu
    const removeSensitiveImageUrl = (index: number) => {
        const newSensitiveImages = sensitiveImageUrls.filter((_, i) => i !== index);
        setSensitiveImageUrls(newSensitiveImages);
        handleChange('sensitiveImages', newSensitiveImages);
        const newInputs = sensitiveUrlInputs.filter((_, i) => i !== index);
        setSensitiveUrlInputs(newInputs);
    };

    // Lưu tất cả URL từ inputs vào state
    const saveImageUrls = () => {
        const urls = urlInputs
            .map(item => item.value.trim())
            .filter(value => value !== '');
        setImageUrls(urls);
        handleChange('images', urls);
    };

    const saveSensitiveImageUrls = () => {
        const urls = sensitiveUrlInputs
            .map(item => item.value.trim())
            .filter(value => value !== '');
        setSensitiveImageUrls(urls);
        handleChange('sensitiveImages', urls);
    };

    // Khi blur input, tự động lưu URL
    const handleUrlBlur = (type: 'normal' | 'sensitive') => {
        if (type === 'normal') {
            saveImageUrls();
        } else {
            saveSensitiveImageUrls();
        }
    };

    // ===== DRAG & DROP HANDLERS =====
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        (e.target as HTMLElement).style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setDraggedIndex(null);
        setDragOverIndex(null);
        (e.target as HTMLElement).style.opacity = '1';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();

        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const newImages = [...imageUrls];
        const [draggedItem] = newImages.splice(draggedIndex, 1);
        newImages.splice(dropIndex, 0, draggedItem);

        setImageUrls(newImages);
        handleChange('images', newImages);

        // Sắp xếp lại inputs theo thứ tự mới
        const newInputs = [...urlInputs];
        const [draggedInput] = newInputs.splice(draggedIndex, 1);
        newInputs.splice(dropIndex, 0, draggedInput);
        setUrlInputs(newInputs);

        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Hàm format giá tiền Việt Nam
    const formatPrice = (value: number): string => {
        if (!value || value === 0) return '0 ₫';

        // Định dạng theo kiểu Việt Nam: 1.000.000 ₫
        const formatted = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);

        return formatted;
    };

    // Hàm format giá dạng rút gọn (tỷ, triệu)
    const formatPriceShort = (value: number): string => {
        if (!value || value === 0) return '0 ₫';

        const billion = 1000000000;
        const million = 1000000;
        const thousand = 1000;

        if (value >= billion) {
            const result = value / billion;
            return `${result.toFixed(1).replace(/\.0$/, '')} tỷ`;
        }

        if (value >= million) {
            const result = value / million;
            return `${result.toFixed(1).replace(/\.0$/, '')} triệu`;
        }

        if (value >= thousand) {
            const result = value / thousand;
            return `${result.toFixed(0).replace(/\.0$/, '')} nghìn`;
        }

        return `${value} ₫`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Lưu URL từ inputs trước khi submit
        saveImageUrls();
        saveSensitiveImageUrls();

        if (!formData.title || !formData.price || !formData.area || !formData.address) {
            alert('Vui lòng điền đầy đủ các trường bắt buộc: Tiêu đề, Giá, Diện tích, Địa chỉ');
            return;
        }

        const propertyId = initialData?.id || `prop-${Date.now()}`;

        const propertyData: Property = {
            id: propertyId,
            title: formData.title || '',
            description: formData.description || '',
            price: Number(formData.price) || 0,
            area: Number(formData.area) || 0,
            address: formData.address || '',
            district: formData.district || 'Quận 1',
            type: 'sale',
            bedrooms: Number(formData.bedrooms) || 2,
            bathrooms: Number(formData.bathrooms) || 2,
            images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
            contactName: formData.contactName || 'Chính chủ',
            contactPhone: formData.contactPhone || '',
            hasPlanningIssue: formData.hasPlanningIssue || false,
            hasRoadWidthIssue: formData.hasRoadWidthIssue || false,
            houseType: formData.houseType || 'nha_pho',
            googleMapCoordinates: formData.googleMapCoordinates || '',
            alleyDepth: Number(formData.alleyDepth) || 0,
            alleyType: formData.alleyType || 'khac',
            width: Number(formData.width) || 0,
            length: Number(formData.length) || 0,
            hasConstructionApproval: formData.hasConstructionApproval || false,
            hasFullConstructionApproval: formData.hasFullConstructionApproval || false,
            floors: Number(formData.floors) || 0,
            hasCashFlow: formData.hasCashFlow || false,
            hasFengShuiIssue: formData.hasFengShuiIssue || false,
            fengShuiIssue: formData.fengShuiIssue || 'khong',
            isHardToAccess: formData.isHardToAccess || false,
            neighborType: formData.neighborType || 'khac',
            alleyEndType: formData.alleyEndType || 'khong_xac_dinh',
            saleStatus: formData.saleStatus || 'dang_ban',
            floorNumber: Number(formData.floorNumber) || 0,
            direction: formData.direction || 'khong_xac_dinh',
            isInExistingResidentialArea: formData.isInExistingResidentialArea || false,
            sensitiveImages: sensitiveImageUrls,
            hasBuildingPermit: formData.hasBuildingPermit || false,
            notes: formData.notes || '',
            projectName: formData.projectName || ''
        };

        onSubmit(propertyData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-900 p-6 flex items-center justify-between z-10">
                    <h3 className="text-sm font-semibold tracking-widest uppercase dark:text-white">
                        {isEditing ? '✏️ Chỉnh sửa bất động sản' : '➕ Thêm bất động sản mới'}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Các phần khác giữ nguyên... */}

                    {/* Thông tin cơ bản */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase border-b border-neutral-200 dark:border-neutral-900 pb-2">
                            📋 Thông tin cơ bản
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1 sm:col-span-2">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Tiêu đề *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ví dụ: Căn hộ Vinhomes Golden River Quận 1"
                                    value={formData.title || ''}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Mô tả
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Mô tả chi tiết về bất động sản..."
                                    value={formData.description || ''}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white resize-y"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Giá (VNĐ) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    placeholder="0"
                                    value={formData.price || ''}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        handleChange('price', value);
                                    }}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />

                                {/* Hiển thị định dạng giá */}
                                {formData.price && formData.price > 0 && (
                                    <div className="mt-1 space-y-0.5">
                                        <div className="flex items-center gap-2 text-[10px]">
                                            <span className="text-neutral-400 tracking-wider">📊 Định dạng:</span>
                                            <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">
                                                {formatPrice(formData.price)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px]">
                                            <span className="text-neutral-400 tracking-wider">📌 Rút gọn:</span>
                                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatPriceShort(formData.price)}
                                            </span>
                                        </div>
                                        {/* Hiển thị thêm các đơn vị khác để tham khảo */}
                                        <div className="flex items-center gap-3 text-[9px] text-neutral-400 flex-wrap">
                                            <span>💡 {formatPriceShort(formData.price)}</span>
                                            {formData.price >= 1000000 && (
                                                <span>• {(formData.price / 1000000).toFixed(1)} triệu</span>
                                            )}
                                            {formData.price >= 1000000000 && (
                                                <span>• {(formData.price / 1000000000).toFixed(2)} tỷ</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Gợi ý cách nhập nếu giá quá lớn */}
                                {formData.price && formData.price > 999999999 && (
                                    <div className="mt-1 text-[9px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>Bạn đang nhập giá hàng tỷ đồng</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Diện tích (m²) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    placeholder="0"
                                    value={formData.area || ''}
                                    onChange={(e) => handleChange('area', Number(e.target.value))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Địa chỉ *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Số nhà, tên đường, phường, quận..."
                                    value={formData.address || ''}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Khu vực *
                                </label>
                                <select
                                    value={formData.district || 'Quận 1'}
                                    onChange={(e) => handleChange('district', e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                >
                                    {TARGET_DISTRICTS.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Tọa độ Google Map
                                </label>
                                <input
                                    type="text"
                                    placeholder="10.123456, 106.123456"
                                    value={formData.googleMapCoordinates || ''}
                                    onChange={(e) => handleChange('googleMapCoordinates', e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Loại nhà
                                </label>
                                <select
                                    value={formData.houseType || 'nha_pho'}
                                    onChange={(e) => handleChange('houseType', e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                >
                                    {HOUSE_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>
                            {formData.houseType === 'chung_cu' && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                        <Building2 className="w-3 h-3 inline mr-1" /> Tên dự án
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Vinhomes Golden River, Sunrise City..."
                                        value={formData.projectName || ''}
                                        onChange={(e) => handleChange('projectName', e.target.value)}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                    />
                                    <p className="text-[9px] text-neutral-400 tracking-wider">
                                        💡 Chỉ nhập khi loại nhà là "Chung cư"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Thông tin bán & Hướng */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase border-b border-neutral-200 dark:border-neutral-900 pb-2">
                            🏷️ Thông tin bán & Hướng
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    <TrendingUp className="w-3 h-3 inline mr-1" /> Trạng thái
                                </label>
                                <select
                                    value={formData.saleStatus || 'dang_ban'}
                                    onChange={(e) => handleChange('saleStatus', e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                >
                                    {SALE_STATUSES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    <Compass className="w-3 h-3 inline mr-1" /> Hướng nhà
                                </label>
                                <select
                                    value={formData.direction || 'khong_xac_dinh'}
                                    onChange={(e) => handleChange('direction', e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                >
                                    {DIRECTIONS.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    <Building2 className="w-3 h-3 inline mr-1" /> Tầng số (chung cư)
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={formData.floorNumber || ''}
                                    onChange={(e) => handleChange('floorNumber', Number(e.target.value))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Phòng ngủ & Toilet */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase border-b border-neutral-200 dark:border-neutral-900 pb-2">
                            🏠 Phòng ốc
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                    <Bed className="w-3 h-3" /> Phòng ngủ
                                </label>
                                <input
                                    type="number"
                                    value={formData.bedrooms || 2}
                                    onChange={(e) => handleChange('bedrooms', Number(e.target.value))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                    <Bath className="w-3 h-3" /> Toilet
                                </label>
                                <input
                                    type="number"
                                    value={formData.bathrooms || 2}
                                    onChange={(e) => handleChange('bathrooms', Number(e.target.value))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                    <Building2 className="w-3 h-3" /> Số tầng
                                </label>
                                <input
                                    type="number"
                                    value={formData.floors || 0}
                                    onChange={(e) => handleChange('floors', Number(e.target.value))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                    <Ruler className="w-3 h-3" /> Ngang x Dài (m)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="Ngang"
                                        value={formData.width || ''}
                                        onChange={(e) => handleChange('width', Number(e.target.value))}
                                        className="w-1/2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="Dài"
                                        value={formData.length || ''}
                                        onChange={(e) => handleChange('length', Number(e.target.value))}
                                        className="w-1/2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin hẻm */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase border-b border-neutral-200 dark:border-neutral-900 pb-2">
                            🚗 Thông tin hẻm
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                    <Navigation className="w-3 h-3" /> Số xẹt
                                </label>
                                <input
                                    type="number"
                                    value={formData.alleyDepth || 0}
                                    onChange={(e) => handleChange('alleyDepth', Number(e.target.value))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                    <Car className="w-3 h-3" /> Loại hẻm
                                </label>
                                <select
                                    value={formData.alleyType || 'khac'}
                                    onChange={(e) => handleChange('alleyType', e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                >
                                    {ALLEY_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Hẻm cụt/thông
                                </label>
                                <select
                                    value={formData.alleyEndType || 'khong_xac_dinh'}
                                    onChange={(e) => handleChange('alleyEndType', e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                >
                                    {ALLEY_END_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1 flex items-end">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isHardToAccess || false}
                                        onChange={(e) => handleChange('isHardToAccess', e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    Đường vào khó đi
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Pháp lý */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase border-b border-neutral-200 dark:border-neutral-900 pb-2">
                            ⚖️ Pháp lý
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="space-y-1 flex items-center">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasPlanningIssue || false}
                                        onChange={(e) => handleChange('hasPlanningIssue', e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    Dính quy hoạch
                                </label>
                            </div>

                            <div className="space-y-1 flex items-center">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasRoadWidthIssue || false}
                                        onChange={(e) => handleChange('hasRoadWidthIssue', e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    Dính lộ giới
                                </label>
                            </div>

                            <div className="space-y-1 flex items-center">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasBuildingPermit || false}
                                        onChange={(e) => handleChange('hasBuildingPermit', e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    Giấy phép xây dựng
                                </label>
                            </div>

                            <div className="space-y-1 flex items-center">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasConstructionApproval || false}
                                        onChange={(e) => handleChange('hasConstructionApproval', e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    Đã hoàn công
                                </label>
                            </div>

                            <div className="space-y-1 flex items-center">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasFullConstructionApproval || false}
                                        onChange={(e) => handleChange('hasFullConstructionApproval', e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    Hoàn công đầy đủ
                                </label>
                            </div>

                            <div className="space-y-1 flex items-center">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isInExistingResidentialArea || false}
                                        onChange={(e) => handleChange('isInExistingResidentialArea', e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    Khu dân cư hiện hữu
                                </label>
                            </div>

                            <div className="space-y-1 flex items-center sm:col-span-2">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasCashFlow || false}
                                        onChange={(e) => handleChange('hasCashFlow', e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    Có dòng tiền
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Phong thủy & Hàng xóm */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase border-b border-neutral-200 dark:border-neutral-900 pb-2">
                            🧭 Phong thủy & Môi trường
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasFengShuiIssue || false}
                                        onChange={(e) => handleChange('hasFengShuiIssue', e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                        Có lỗi phong thủy
                                    </label>
                                </div>

                                {formData.hasFengShuiIssue && (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                            Loại lỗi phong thủy
                                        </label>
                                        <select
                                            value={formData.fengShuiIssue || 'khong'}
                                            onChange={(e) => handleChange('fengShuiIssue', e.target.value)}
                                            className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                        >
                                            {FENG_SHUI_ISSUES.map((t) => (
                                                <option key={t.value} value={t.value}>{t.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
                                    <Users className="w-3 h-3" /> Hàng xóm
                                </label>
                                <select
                                    value={formData.neighborType || 'khac'}
                                    onChange={(e) => handleChange('neighborType', e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                >
                                    {NEIGHBOR_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Ghi chú */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase border-b border-neutral-200 dark:border-neutral-900 pb-2">
                            📝 Ghi chú
                        </h4>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                Ghi chú thêm
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Thông tin thêm về bất động sản..."
                                value={formData.notes || ''}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white resize-y"
                            />
                        </div>
                    </div>

                    {/* Liên hệ */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase border-b border-neutral-200 dark:border-neutral-900 pb-2">
                            📞 Thông tin liên hệ
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Tên người liên hệ
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    value={formData.contactName || ''}
                                    onChange={(e) => handleChange('contactName', e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    SĐT liên hệ
                                </label>
                                <input
                                    type="text"
                                    placeholder="0901234567"
                                    value={formData.contactPhone || ''}
                                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Hình ảnh */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase border-b border-neutral-200 dark:border-neutral-900 pb-2">
                            🖼️ Hình ảnh
                        </h4>

                        {/* Ảnh thường */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Ảnh bất động sản
                                </label>
                                <button
                                    type="button"
                                    onClick={addImageInput}
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm URL
                                </button>
                            </div>

                            {imageUrls.length > 0 && (
                                <p className="text-[8px] text-neutral-400 tracking-wider mt-0.5">
                                    💡 Kéo thả để sắp xếp thứ tự ảnh
                                </p>
                            )}

                            {/* Danh sách các input URL */}
                            <div className="space-y-2 mt-2">
                                {urlInputs.map((input, index) => (
                                    <div key={input.id} className="flex items-center gap-2">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                placeholder={`URL ảnh #${index + 1}`}
                                                value={input.value}
                                                onChange={(e) => updateUrlInput(input.id, e.target.value)}
                                                onBlur={() => handleUrlBlur('normal')}
                                                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                            />
                                            {/* Preview ảnh khi có URL */}
                                            {input.value.trim() && (
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                                                    <img
                                                        src={input.value.trim()}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="%23f3f4f6"/><text x="16" y="18" font-size="10" text-anchor="middle" fill="%239ca3af">❌</text></svg>';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeUrlInput(input.id)}
                                            className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 transition-colors"
                                            title="Xóa URL này"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Hiển thị ảnh đã lưu dạng thumbnail */}
                            {imageUrls.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap mt-3 border-t border-neutral-100 dark:border-neutral-900 pt-3">
                                    <span className="text-[8px] text-neutral-400 tracking-wider">📷 Đã lưu:</span>
                                    {imageUrls.map((url, idx) => (
                                        <div key={idx} className="relative w-12 h-12 border dark:border-neutral-800 overflow-hidden group">
                                            <img src={url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImageUrl(idx)}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                            >
                                                <Trash2 className="w-3 h-3 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p className="text-[9px] text-neutral-400 mt-2 tracking-wider">
                                💡 Nhập URL ảnh, ảnh sẽ preview ngay bên phải ô nhập
                            </p>
                        </div>

                        {/* Ảnh nhạy cảm */}
                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                                    <FileCheck className="w-3 h-3" />
                                    Hình nhạy cảm
                                </label>
                                <button
                                    type="button"
                                    onClick={addSensitiveImageInput}
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm URL
                                </button>
                            </div>

                            {/* Danh sách các input URL nhạy cảm */}
                            <div className="space-y-2 mt-2">
                                {sensitiveUrlInputs.map((input, index) => (
                                    <div key={input.id} className="flex items-center gap-2">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                placeholder={`URL ảnh nhạy cảm #${index + 1}`}
                                                value={input.value}
                                                onChange={(e) => updateSensitiveUrlInput(input.id, e.target.value)}
                                                onBlur={() => handleUrlBlur('sensitive')}
                                                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                            />
                                            {input.value.trim() && (
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                                                    <img
                                                        src={input.value.trim()}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="%23f3f4f6"/><text x="16" y="18" font-size="10" text-anchor="middle" fill="%239ca3af">❌</text></svg>';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeSensitiveUrlInput(input.id)}
                                            className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 transition-colors"
                                            title="Xóa URL này"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Hiển thị ảnh nhạy cảm đã lưu */}
                            {sensitiveImageUrls.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap mt-3 border-t border-neutral-100 dark:border-neutral-900 pt-3">
                                    <span className="text-[8px] text-neutral-400 tracking-wider">🔒 Đã lưu:</span>
                                    {sensitiveImageUrls.map((url, idx) => (
                                        <div key={idx} className="relative w-12 h-12 border dark:border-neutral-800 overflow-hidden group">
                                            <img src={url} alt={`Sensitive ${idx + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeSensitiveImageUrl(idx)}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                            >
                                                <Trash2 className="w-3 h-3 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p className="text-[9px] text-neutral-400 mt-2 tracking-wider">
                                🔒 Hình nhạy cảm chỉ hiển thị cho admin, không hiển thị với khách hàng.
                            </p>
                            <p className="text-[9px] text-neutral-400 tracking-wider">
                                💡 Nhập URL ảnh, ảnh sẽ preview ngay bên phải ô nhập
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-900 pt-4 flex gap-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 py-3 text-xs tracking-widest uppercase font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    ĐANG XỬ LÝ...
                                </>
                            ) : (
                                isEditing ? 'CẬP NHẬT' : 'THÊM MỚI'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white py-3 text-xs tracking-widest uppercase transition-colors"
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminPropertyForm;