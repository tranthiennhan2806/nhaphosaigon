import React, { useState } from 'react';
import { Property } from '@/types';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { formatPriceShort } from '@/utils/format';
import { AdminPropertyForm } from './AdminPropertyForm';
import { AdminPropertyDetailModal } from './AdminPropertyDetailModal';

interface AdminPropertiesProps {
    properties: Property[];
    setProperties: (props: Property[]) => void;
    isLoading: boolean;
    onRefresh: () => void;
    uploadImageToDiscord?: (file: File) => Promise<{ success: boolean; url: string }>;
    uploadMultipleImages?: (files: File[], onProgress?: (current: number, total: number) => void) => Promise<string[]>;
    onCreateProperty?: (property: Property) => Promise<Property | null>;
    onUpdateProperty?: (property: Property) => Promise<Property | null>;
    onDeleteProperty?: (id: string) => Promise<boolean>;
    syncToGoogleSheet?: (properties: Property[]) => Promise<boolean>;
}

export function AdminProperties({
    properties,
    setProperties,
    isLoading,
    onRefresh,
    uploadImageToDiscord,
    uploadMultipleImages,
    onCreateProperty,
    onUpdateProperty,
    onDeleteProperty,
    syncToGoogleSheet
}: AdminPropertiesProps) {
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase())
    );

    const handleView = (property: Property) => {
        setViewingProperty(property);
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setTimeout(() => setViewingProperty(null), 300);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc muốn xóa bất động sản này?')) {
            if (onDeleteProperty) {
                const success = await onDeleteProperty(id);
                if (success) {
                    onRefresh();
                } else {
                    alert('Lỗi khi xóa bất động sản. Vui lòng thử lại.');
                }
            } else {
                const updated = properties.filter(p => p.id !== id);
                setProperties(updated);
                if (syncToGoogleSheet) {
                    await syncToGoogleSheet(updated);
                }
            }
        }
    };

    const handleEdit = (property: Property) => {
        setEditingProperty(property);
        setIsFormOpen(true);
    };

    const handleSubmit = async (data: Property) => {
        setIsSubmitting(true);
        try {
            if (editingProperty) {
                const updateData = { ...data, id: editingProperty.id };
                const updatedProperties = properties.map(p => 
                    p.id === editingProperty.id ? updateData : p
                );
                setProperties(updatedProperties);
                if (syncToGoogleSheet) {
                    await syncToGoogleSheet(updatedProperties);
                }
                setIsFormOpen(false);
                setEditingProperty(null);
                setIsSubmitting(false);
                return;
            }
            
            const newData = { ...data, id: `prop-${Date.now()}` };
            const updatedProperties = [newData, ...properties];
            setProperties(updatedProperties);
            if (syncToGoogleSheet) {
                await syncToGoogleSheet(updatedProperties);
            }
            setIsFormOpen(false);
            setEditingProperty(null);
        } catch (error) {
            console.error('Error saving property:', error);
            alert('Lỗi khi lưu bất động sản. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl font-semibold tracking-[0.2em] uppercase dark:text-white">
                            Quản lý bất động sản
                        </h1>
                        <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">
                            Tổng {properties.length} bất động sản
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-xs tracking-wider focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white w-40 sm:w-60"
                            />
                        </div>

                        <button
                            onClick={() => {
                                setEditingProperty(null);
                                setIsFormOpen(true);
                            }}
                            className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 px-4 py-2 text-xs tracking-widest uppercase font-semibold transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm mới
                        </button>

                        <button
                            onClick={onRefresh}
                            disabled={isLoading}
                            className="border border-neutral-300 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white px-4 py-2 text-xs tracking-widest uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Đang tải...' : 'Làm mới'}
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white mx-auto"></div>
                        <p className="mt-4 text-sm text-neutral-500">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-neutral-200 dark:border-neutral-900">
                                    <th className="text-left p-4 text-[10px] tracking-widest text-neutral-400 uppercase font-normal min-w-[200px]">
                                        Thông tin
                                    </th>
                                    <th className="text-left p-4 text-[10px] tracking-widest text-neutral-400 uppercase font-normal min-w-[120px]">
                                        Giá / Diện tích
                                    </th>
                                    <th className="text-left p-4 text-[10px] tracking-widest text-neutral-400 uppercase font-normal min-w-[200px]">
                                        Địa chỉ
                                    </th>
                                    <th className="text-right p-4 text-[10px] tracking-widest text-neutral-400 uppercase font-normal min-w-[120px]">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProperties.map((prop) => (
                                    <tr key={prop.id} className="border-b border-neutral-100 dark:border-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={prop.images?.[0] || '/placeholder.jpg'}
                                                    alt={prop.title}
                                                    className="w-12 h-12 object-cover border dark:border-neutral-800 flex-shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-semibold dark:text-white line-clamp-2">
                                                        {prop.title}
                                                    </p>
                                                    <p className="text-[9px] text-neutral-400 uppercase tracking-wider mt-0.5">
                                                        {prop.bedrooms}PN - {prop.bathrooms}WC
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-semibold dark:text-white">
                                                {formatPriceShort(prop.price)}
                                            </p>
                                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                                {prop.area} m²
                                            </p>
                                        </td>
                                        <td className="p-4 text-neutral-500 dark:text-neutral-400">
                                            <p className="line-clamp-2">{prop.address}</p>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleView(prop)}
                                                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4 text-neutral-400" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(prop)}
                                                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Edit className="w-4 h-4 text-neutral-400" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(prop.id)}
                                                    className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-4 h-4 text-rose-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredProperties.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-neutral-400 uppercase tracking-wider text-xs">
                                    {search ? 'Không tìm thấy bất động sản nào' : 'Chưa có bất động sản nào'}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Property Form Modal */}
                {isFormOpen && (
                    <AdminPropertyForm
                        initialData={editingProperty || undefined}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setIsFormOpen(false);
                            setEditingProperty(null);
                        }}
                        isLoading={isSubmitting}
                        uploadMultipleImages={uploadMultipleImages}
                    />
                )}
            </div>

            {/* View Detail Modal */}
            <AdminPropertyDetailModal
                property={viewingProperty}
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
            />
        </>
    );
}

export default AdminProperties;