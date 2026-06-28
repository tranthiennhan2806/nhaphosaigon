import React, { useState, useEffect } from 'react';
import { Property } from '@/types';
import {
    X, Upload, Trash2, Loader2,
    Bed, Bath, Building2, Ruler,
    Navigation, Car, Users,
    MapPin, Home, AlertCircle,
    TrendingUp, Compass, FileCheck
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
    uploadMultipleImages?: (files: File[], onProgress?: (current: number, total: number) => void) => Promise<string[]>;
}

export function AdminPropertyForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    uploadMultipleImages
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
    });

    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [uploadedSensitiveImages, setUploadedSensitiveImages] = useState<string[]>([]);
    const [pendingNormalFiles, setPendingNormalFiles] = useState<File[]>([]);
    const [pendingSensitiveFiles, setPendingSensitiveFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, type: '' });

    // Load initial data
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setUploadedImages(initialData.images || []);
            setUploadedSensitiveImages(initialData.sensitiveImages || []);
        }
    }, [initialData]);

    const handleChange = (field: keyof Property, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Chọn ảnh nhưng chưa upload
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'normal' | 'sensitive') => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (type === 'normal') {
            setPendingNormalFiles(prev => [...prev, ...files]);
        } else {
            setPendingSensitiveFiles(prev => [...prev, ...files]);
        }
        e.target.value = '';
    };

    // Xóa ảnh đã chọn nhưng chưa upload
    const removePendingImage = (index: number, type: 'normal' | 'sensitive') => {
        if (type === 'normal') {
            setPendingNormalFiles(prev => prev.filter((_, i) => i !== index));
        } else {
            setPendingSensitiveFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Xóa ảnh đã upload
    const removeUploadedImage = (index: number, type: 'normal' | 'sensitive') => {
        if (type === 'normal') {
            const newImages = uploadedImages.filter((_, i) => i !== index);
            setUploadedImages(newImages);
            handleChange('images', newImages);
        } else {
            const newSensitiveImages = uploadedSensitiveImages.filter((_, i) => i !== index);
            setUploadedSensitiveImages(newSensitiveImages);
            handleChange('sensitiveImages', newSensitiveImages);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.price || !formData.area || !formData.address) {
            alert('Vui lòng điền đầy đủ các trường bắt buộc: Tiêu đề, Giá, Diện tích, Địa chỉ');
            return;
        }

        // Gom tất cả URL ảnh
        let finalNormalImages = [...uploadedImages];
        let finalSensitiveImages = [...uploadedSensitiveImages];

        // Upload ảnh thường nếu có
        if (pendingNormalFiles.length > 0 && uploadMultipleImages) {
            setIsUploading(true);
            setUploadProgress({ current: 0, total: pendingNormalFiles.length, type: 'normal' });
            
            try {
                const urls = await uploadMultipleImages(pendingNormalFiles, (current, total) => {
                    setUploadProgress({ current, total, type: 'normal' });
                });
                finalNormalImages = [...finalNormalImages, ...urls];
                setUploadedImages(finalNormalImages);
                setPendingNormalFiles([]);
            } catch (error) {
                console.error('Upload error:', error);
                alert('Lỗi upload ảnh thường. Vui lòng thử lại.');
                setIsUploading(false);
                return;
            }
        }

        // Upload ảnh nhạy cảm nếu có
        if (pendingSensitiveFiles.length > 0 && uploadMultipleImages) {
            setIsUploading(true);
            setUploadProgress({ current: 0, total: pendingSensitiveFiles.length, type: 'sensitive' });
            
            try {
                const urls = await uploadMultipleImages(pendingSensitiveFiles, (current, total) => {
                    setUploadProgress({ current, total, type: 'sensitive' });
                });
                finalSensitiveImages = [...finalSensitiveImages, ...urls];
                setUploadedSensitiveImages(finalSensitiveImages);
                setPendingSensitiveFiles([]);
            } catch (error) {
                console.error('Upload error:', error);
                alert('Lỗi upload ảnh nhạy cảm. Vui lòng thử lại.');
                setIsUploading(false);
                return;
            }
        }

        setIsUploading(false);

        // Gom tất cả dữ liệu vào 1 object Property
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
            images: finalNormalImages.length > 0 ? finalNormalImages : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
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
            sensitiveImages: finalSensitiveImages,
            hasBuildingPermit: formData.hasBuildingPermit || false,
            notes: formData.notes || '',
        };

        // Gửi 1 lần duy nhất lên Google Sheets
        onSubmit(propertyData);
    };

    // Render preview cho file pending
    const renderPendingPreview = (files: File[], type: 'normal' | 'sensitive') => {
        return files.map((file, idx) => (
            <div key={idx} className="relative w-20 h-20 border dark:border-neutral-800 overflow-hidden group">
                <img src={URL.createObjectURL(file)} alt={`Pending ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                    type="button"
                    onClick={() => removePendingImage(idx, type)}
                    className="absolute top-1 right-1 bg-rose-600 text-white p-1 hover:bg-rose-700 transition-colors"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1 left-1 bg-yellow-500/80 text-white text-[8px] px-1">Chờ upload</span>
            </div>
        ));
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
                    {/* ... Tất cả các phần form giữ nguyên ... */}
                    
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
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                Ảnh bất động sản
                            </label>
                            <div className="flex items-center gap-3 flex-wrap mt-2">
                                <label className="cursor-pointer border border-dashed border-neutral-400 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-white w-20 h-20 flex flex-col items-center justify-center gap-1.5 transition-all bg-neutral-50 dark:bg-neutral-900/50">
                                    <Upload className="w-4 h-4 text-neutral-500" />
                                    <span className="text-[9px] font-bold tracking-wider text-neutral-500 uppercase text-center leading-tight">
                                        Chọn ảnh
                                    </span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleImageSelect(e, 'normal')}
                                        className="hidden"
                                        disabled={isUploading}
                                    />
                                </label>

                                {/* Ảnh đã upload */}
                                {uploadedImages.map((url, idx) => (
                                    <div key={`uploaded-${idx}`} className="relative w-20 h-20 border dark:border-neutral-800 overflow-hidden group">
                                        <img src={url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeUploadedImage(idx, 'normal')}
                                            className="absolute top-1 right-1 bg-neutral-950/80 text-white p-1 hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* Ảnh chờ upload */}
                                {renderPendingPreview(pendingNormalFiles, 'normal')}
                            </div>

                            {pendingNormalFiles.length > 0 && (
                                <p className="text-[9px] text-yellow-500 mt-1 tracking-wider">
                                    ⏳ {pendingNormalFiles.length} ảnh đang chờ upload khi bấm "Thêm mới"
                                </p>
                            )}
                            <p className="text-[9px] text-neutral-400 mt-1 tracking-wider">
                                💡 Chọn ảnh trước, sau đó bấm "Thêm mới" để upload lên Discord CDN
                            </p>
                        </div>

                        {/* Ảnh nhạy cảm */}
                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                                <FileCheck className="w-3 h-3" />
                                Hình nhạy cảm (sổ, mặt tiền có bảng địa chỉ)
                            </label>
                            <div className="flex items-center gap-3 flex-wrap mt-2">
                                <label className="cursor-pointer border border-dashed border-neutral-400 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-white w-20 h-20 flex flex-col items-center justify-center gap-1.5 transition-all bg-neutral-50 dark:bg-neutral-900/50">
                                    <Upload className="w-4 h-4 text-neutral-500" />
                                    <span className="text-[9px] font-bold tracking-wider text-neutral-500 uppercase text-center leading-tight">
                                        Chọn ảnh
                                    </span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleImageSelect(e, 'sensitive')}
                                        className="hidden"
                                        disabled={isUploading}
                                    />
                                </label>

                                {/* Ảnh đã upload */}
                                {uploadedSensitiveImages.map((url, idx) => (
                                    <div key={`sensitive-${idx}`} className="relative w-20 h-20 border dark:border-neutral-800 overflow-hidden group">
                                        <img src={url} alt={`Sensitive ${idx + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeUploadedImage(idx, 'sensitive')}
                                            className="absolute top-1 right-1 bg-neutral-950/80 text-white p-1 hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* Ảnh chờ upload */}
                                {renderPendingPreview(pendingSensitiveFiles, 'sensitive')}
                            </div>

                            {pendingSensitiveFiles.length > 0 && (
                                <p className="text-[9px] text-yellow-500 mt-1 tracking-wider">
                                    ⏳ {pendingSensitiveFiles.length} ảnh nhạy cảm đang chờ upload khi bấm "Thêm mới"
                                </p>
                            )}
                            <p className="text-[9px] text-neutral-400 mt-1 tracking-wider">
                                🔒 Hình nhạy cảm chỉ hiển thị cho admin, không hiển thị với khách hàng.
                            </p>
                        </div>

                        {/* Progress bar khi uploading */}
                        {isUploading && (
                            <div className="mt-3 p-3 bg-neutral-100 dark:bg-neutral-900 rounded">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-neutral-600 dark:text-neutral-400">
                                        {uploadProgress.type === 'normal' ? 'Đang upload ảnh thường' : 'Đang upload ảnh nhạy cảm'}...
                                    </span>
                                    <span className="text-neutral-600 dark:text-neutral-400">
                                        {uploadProgress.current}/{uploadProgress.total}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full mt-1 overflow-hidden">
                                    <div 
                                        className="h-full bg-neutral-900 dark:bg-white transition-all duration-300 rounded-full"
                                        style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-900 pt-4 flex gap-3">
                        <button
                            type="submit"
                            disabled={isLoading || isUploading}
                            className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 py-3 text-xs tracking-widest uppercase font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    ĐANG UPLOAD ẢNH...
                                </>
                            ) : isLoading ? (
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