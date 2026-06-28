import React, { useState, useEffect } from 'react';
import { Property } from '@/types';
import {
    X, Upload, Trash2, Loader2,
    Bed, Bath, Building2, Ruler,
    Navigation, Car, Users,
    MapPin, Home, AlertCircle
} from 'lucide-react';
import {
    TARGET_DISTRICTS,
    HOUSE_TYPES,
    ALLEY_TYPES,
    FENG_SHUI_ISSUES,
    NEIGHBOR_TYPES,
    ALLEY_END_TYPES
} from '@/configs/constants';

interface AdminPropertyFormProps {
    initialData?: Partial<Property>;
    onSubmit: (data: Property) => void;
    onCancel: () => void;
    isLoading?: boolean;
    uploadImageToDiscord?: (file: File) => Promise<{ success: boolean; url: string }>;
}

export function AdminPropertyForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    uploadImageToDiscord
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
    });

    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Load initial data
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setUploadedImages(initialData.images || []);
        }
    }, [initialData]);

    const handleChange = (field: keyof Property, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (!uploadImageToDiscord) {
            // Fallback: tạo URL tạm thời
            const urls = files.map(file => URL.createObjectURL(file));
            setUploadedImages(prev => [...prev, ...urls]);
            handleChange('images', [...uploadedImages, ...urls]);
            return;
        }

        setIsUploading(true);
        try {
            const uploadPromises = files.map(file => uploadImageToDiscord(file));
            const results = await Promise.all(uploadPromises);
            const urls = results.map(r => r.url);
            const newImages = [...uploadedImages, ...urls];
            setUploadedImages(newImages);
            handleChange('images', newImages);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Lỗi upload ảnh. Vui lòng thử lại.');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const removeImage = (index: number) => {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
        handleChange('images', newImages);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.title || !formData.price || !formData.area || !formData.address) {
            alert('Vui lòng điền đầy đủ các trường bắt buộc: Tiêu đề, Giá, Diện tích, Địa chỉ');
            return;
        }

        const propertyData: Property = {
            id: initialData?.id || `prop-${Date.now()}`,
            title: formData.title || '',
            description: formData.description || '',
            price: Number(formData.price) || 0,
            area: Number(formData.area) || 0,
            address: formData.address || '',
            district: formData.district || 'Quận 1',
            type: 'sale',
            bedrooms: Number(formData.bedrooms) || 2,
            bathrooms: Number(formData.bathrooms) || 2,
            images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
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
                                    onChange={(e) => handleChange('price', Number(e.target.value))}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
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

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <label className={`cursor-pointer border border-dashed border-neutral-400 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-white w-20 h-20 flex flex-col items-center justify-center gap-1.5 transition-all bg-neutral-50 dark:bg-neutral-900/50 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <Upload className="w-4 h-4 text-neutral-500" />
                                    <span className="text-[9px] font-bold tracking-wider text-neutral-500 uppercase text-center leading-tight">
                                        {isUploading ? 'Đang tải...' : 'Tải ảnh'}
                                    </span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={isUploading}
                                    />
                                </label>

                                {isUploading && (
                                    <div className="w-20 h-20 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-1.5 text-[9px] tracking-wider uppercase">
                                        <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                                        <span>ĐANG GỬI</span>
                                    </div>
                                )}

                                {uploadedImages.map((url, idx) => (
                                    <div key={idx} className="relative w-20 h-20 border dark:border-neutral-800 overflow-hidden group">
                                        <img src={url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-neutral-950/80 text-white p-1 hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <p className="text-[9px] text-neutral-400 mt-2 tracking-wider">
                                💡 Hỗ trợ tải nhiều ảnh cùng lúc. Ảnh sẽ được upload lên Discord CDN.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-900 pt-4 flex gap-3">
                        <button
                            type="submit"
                            disabled={isLoading || isUploading}
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