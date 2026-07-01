import React, { useState, useEffect } from 'react';
import { Property, AppConfig } from '@/types';
import { 
  Trash2, Edit, Upload, Loader2, 
  MapPin, Bed, Bath, Maximize, Info
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

interface AdminScreenProps {
  properties: Property[];
  savePropertiesState: (properties: Property[]) => void;
  syncToGoogleSheet: (properties: Property[]) => Promise<boolean>;
  uploadImageToDiscord: (file: File) => Promise<{ success: boolean; url: string }>;
  navigateTo: (tab: string, id?: string) => void;
  showToast: (message: string, type?: string) => void;
  config: AppConfig;
}

export function AdminScreen({ 
  properties, 
  savePropertiesState, 
  syncToGoogleSheet, 
  uploadImageToDiscord, 
  navigateTo, 
  showToast, 
  config 
}: AdminScreenProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [district, setDistrict] = useState<string>('Quận 1');
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  
  // Các trường mới
  const [hasPlanningIssue, setHasPlanningIssue] = useState<boolean>(false);
  const [hasRoadWidthIssue, setHasRoadWidthIssue] = useState<boolean>(false);
  const [houseType, setHouseType] = useState<string>('nha_pho');
  const [googleMapCoordinates, setGoogleMapCoordinates] = useState<string>('');
  const [alleyDepth, setAlleyDepth] = useState<number>(0);
  const [alleyType, setAlleyType] = useState<string>('khac');
  const [width, setWidth] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [hasConstructionApproval, setHasConstructionApproval] = useState<boolean>(false);
  const [hasFullConstructionApproval, setHasFullConstructionApproval] = useState<boolean>(false);
  const [floors, setFloors] = useState<number>(0);
  const [hasCashFlow, setHasCashFlow] = useState<boolean>(false);
  const [hasFengShuiIssue, setHasFengShuiIssue] = useState<boolean>(false);
  const [fengShuiIssue, setFengShuiIssue] = useState<string>('khong');
  const [isHardToAccess, setIsHardToAccess] = useState<boolean>(false);
  const [neighborType, setNeighborType] = useState<string>('khac');
  const [alleyEndType, setAlleyEndType] = useState<string>('khong_xac_dinh');
  const [saleStatus, setSaleStatus] = useState<string>('dang_ban');
  const [floorNumber, setFloorNumber] = useState<number>(0);
  const [direction, setDirection] = useState<string>('khong_xac_dinh');
  const [isInExistingResidentialArea, setIsInExistingResidentialArea] = useState<boolean>(false);
  const [hasBuildingPermit, setHasBuildingPermit] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleEditClick = (prop: Property) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsEditing(true);
    setEditingId(prop.id);
    setTitle(prop.title);
    setDescription(prop.description);
    setPrice(prop.price.toString());
    setArea(prop.area.toString());
    setAddress(prop.address);
    setDistrict(prop.district || 'Quận 1');
    setBedrooms(prop.bedrooms);
    setBathrooms(prop.bathrooms);
    setContactName(prop.contactName || '');
    setContactPhone(prop.contactPhone || '');
    setUploadedImages(prop.images || []);
    
    // Set các trường mới
    setHasPlanningIssue(prop.hasPlanningIssue || false);
    setHasRoadWidthIssue(prop.hasRoadWidthIssue || false);
    setHouseType(prop.houseType || 'nha_pho');
    setGoogleMapCoordinates(prop.googleMapCoordinates || '');
    setAlleyDepth(prop.alleyDepth || 0);
    setAlleyType(prop.alleyType || 'khac');
    setWidth(prop.width || 0);
    setLength(prop.length || 0);
    setHasConstructionApproval(prop.hasConstructionApproval || false);
    setHasFullConstructionApproval(prop.hasFullConstructionApproval || false);
    setFloors(prop.floors || 0);
    setHasCashFlow(prop.hasCashFlow || false);
    setHasFengShuiIssue(prop.hasFengShuiIssue || false);
    setFengShuiIssue(prop.fengShuiIssue || 'khong');
    setIsHardToAccess(prop.isHardToAccess || false);
    setNeighborType(prop.neighborType || 'khac');
    setAlleyEndType(prop.alleyEndType || 'khong_xac_dinh');
    setSaleStatus(prop.saleStatus || 'dang_ban');
    setFloorNumber(prop.floorNumber || 0);
    setDirection(prop.direction || 'khong_xac_dinh');
    setIsInExistingResidentialArea(prop.isInExistingResidentialArea || false);
    setHasBuildingPermit(prop.hasBuildingPermit || false);
    setNotes(prop.notes || '');
    setProjectName(prop.projectName || '');
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    showToast("Đang kết nối Discord CDN Webhook...", "info");

    try {
      const uploadPromises = files.map(async (file) => {
        const res = await uploadImageToDiscord(file);
        return res.url;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...urls]);
      showToast(`Đã thêm thành công ${urls.length} hình ảnh vào hàng chờ!`);
    } catch (err) {
      showToast("Lỗi tải ảnh lên. Đang gán ảnh mô phỏng thay thế.", "error");
      setUploadedImages(prev => [...prev, "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"]);
    } finally {
      setIsUploading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const removeUploadedImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !area || !address) {
      showToast("Điền đầy đủ các thông tin bắt buộc.", "error");
      return;
    }

    const itemData: Property = {
      id: isEditing && editingId ? editingId : `prop-${Date.now()}`,
      title,
      description,
      price: Number(price),
      area: Number(area),
      address,
      district,
      type: 'sale',
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      images: uploadedImages.length > 0 ? uploadedImages : ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"],
      contactName: contactName || "CHÍNH CHỦ",
      contactPhone: contactPhone || "0901234567",
      
      // Các trường cũ
      hasPlanningIssue,
      hasRoadWidthIssue,
      houseType: houseType as any,
      googleMapCoordinates,
      alleyDepth,
      alleyType: alleyType as any,
      width,
      length,
      hasConstructionApproval,
      hasFullConstructionApproval,
      floors,
      hasCashFlow,
      hasFengShuiIssue,
      fengShuiIssue: fengShuiIssue as any,
      isHardToAccess,
      neighborType: neighborType as any,
      alleyEndType: alleyEndType as any,
      
      // Các trường bổ sung mới
      saleStatus: saleStatus as any,
      floorNumber,
      direction: direction as any,
      isInExistingResidentialArea,
      sensitiveImages: [], // Chưa có sensitive images trong AdminScreen
      hasBuildingPermit,
      notes,
      projectName
    };

    let updatedList: Property[];
    if (isEditing && editingId) {
      updatedList = properties.map(p => p.id === editingId ? itemData : p);
    } else {
      updatedList = [itemData, ...properties];
    }

    await syncToGoogleSheet(updatedList);
    showToast("Đã cập nhật hệ thống.", "success");
    resetForm();
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm("Xác nhận xóa không gian này?")) {
      const updated = properties.filter(p => p.id !== id);
      await syncToGoogleSheet(updated);
      showToast("Đã xóa khỏi hệ thống.", "info");
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setArea('');
    setAddress('');
    setDistrict('Quận 1');
    setBedrooms(2);
    setBathrooms(2);
    setContactName('');
    setContactPhone('');
    setUploadedImages([]);
    
    // Reset các trường mới
    setHasPlanningIssue(false);
    setHasRoadWidthIssue(false);
    setHouseType('nha_pho');
    setGoogleMapCoordinates('');
    setAlleyDepth(0);
    setAlleyType('khac');
    setWidth(0);
    setLength(0);
    setHasConstructionApproval(false);
    setHasFullConstructionApproval(false);
    setFloors(0);
    setHasCashFlow(false);
    setHasFengShuiIssue(false);
    setFengShuiIssue('khong');
    setIsHardToAccess(false);
    setNeighborType('khac');
    setAlleyEndType('khong_xac_dinh');
    setSaleStatus('dang_ban');
    setFloorNumber(0);
    setDirection('khong_xac_dinh');
    setIsInExistingResidentialArea(false);
    setHasBuildingPermit(false);
    setNotes('');
    setProjectName('');
  };

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="space-y-8"
    >
      <div className="border-b border-neutral-200 dark:border-neutral-900 pb-4">
        <h1 className="text-lg font-semibold tracking-[0.2em] uppercase dark:text-white">GIÁM SÁT THIẾT LẬP</h1>
        <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">Thêm mới, điều chỉnh, hoặc loại bỏ cấu trúc các căn hộ thông qua Google Sheet Database.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* INPUT FORM */}
        <div className="lg:col-span-2 border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 space-y-4">
          <div className="flex justify-between items-baseline border-b border-neutral-100 dark:border-neutral-900 pb-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase dark:text-white">
              {isEditing ? `⚡ ĐANG SỬA TIN (#${editingId})` : "✨ KHỞI TẠO TIN ĐĂNG MỚI"}
            </h3>
            {isEditing && (
              <button onClick={resetForm} className="text-[10px] text-rose-500 hover:underline uppercase tracking-wider font-bold">Hủy bỏ</button>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">TIÊU ĐỀ KHÔNG GIAN *</label>
              <input
                type="text"
                required
                placeholder="VÍ DỤ: LANDMARK 81 LUXURY MINI STUDIO..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">CHI TIẾT MÔ TẢ</label>
              <textarea
                rows={4}
                placeholder="CUNG CẤP CÁC ĐẶC ĐIỂM KIẾN TRÚC..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">KHU VỰC *</label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white cursor-pointer"
                >
                  {TARGET_DISTRICTS.map((dst, i) => (
                    <option key={i} value={dst}>{dst}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">GIÁ (VNĐ) *</label>
                <input
                  type="number"
                  required
                  placeholder="3000000000"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">DIỆN TÍCH (M²) *</label>
                <input
                  type="number"
                  required
                  placeholder="85"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">ĐỊA CHỈ CHI TIẾT *</label>
              <input
                type="text"
                required
                placeholder="ĐƯỜNG, PHƯỜNG, QUẬN, THÀNH PHỐ..."
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">TỌA ĐỘ GOOGLE MAP</label>
              <input
                type="text"
                placeholder="10.123456,106.123456"
                value={googleMapCoordinates}
                onChange={e => setGoogleMapCoordinates(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">PHÒNG NGỦ</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={e => setBedrooms(Number(e.target.value))}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">TOILET</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={e => setBathrooms(Number(e.target.value))}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">LOẠI NHÀ</label>
                <select
                  value={houseType}
                  onChange={e => setHouseType(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                >
                  {HOUSE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">SỐ TẦNG</label>
                <input
                  type="number"
                  value={floors}
                  onChange={e => setFloors(Number(e.target.value))}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">NGANG (M)</label>
                <input
                  type="number"
                  step="0.1"
                  value={width}
                  onChange={e => setWidth(Number(e.target.value))}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">DÀI (M)</label>
                <input
                  type="number"
                  step="0.1"
                  value={length}
                  onChange={e => setLength(Number(e.target.value))}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">SỐ XẸT</label>
                <input
                  type="number"
                  value={alleyDepth}
                  onChange={e => setAlleyDepth(Number(e.target.value))}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">LOẠI HẺM</label>
                <select
                  value={alleyType}
                  onChange={e => setAlleyType(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                >
                  {ALLEY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">HẺM CỤT/THÔNG</label>
                <select
                  value={alleyEndType}
                  onChange={e => setAlleyEndType(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                >
                  {ALLEY_END_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">HƯỚNG NHÀ</label>
                <select
                  value={direction}
                  onChange={e => setDirection(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                >
                  {DIRECTIONS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">TRẠNG THÁI BÁN</label>
                <select
                  value={saleStatus}
                  onChange={e => setSaleStatus(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                >
                  {SALE_STATUSES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">TẦNG SỐ (CHUNG CƯ)</label>
                <input
                  type="number"
                  value={floorNumber}
                  onChange={e => setFloorNumber(Number(e.target.value))}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
                />
              </div>
            </div>

            {houseType === 'chung_cu' && (
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">TÊN DỰ ÁN</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Vinhomes Golden River, Sunrise City..."
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 flex items-center">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasPlanningIssue}
                    onChange={e => setHasPlanningIssue(e.target.checked)}
                    className="w-4 h-4"
                  />
                  DÍNH QUY HOẠCH
                </label>
              </div>

              <div className="space-y-1 flex items-center">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasRoadWidthIssue}
                    onChange={e => setHasRoadWidthIssue(e.target.checked)}
                    className="w-4 h-4"
                  />
                  DÍNH LỘ GIỚI
                </label>
              </div>

              <div className="space-y-1 flex items-center">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasConstructionApproval}
                    onChange={e => setHasConstructionApproval(e.target.checked)}
                    className="w-4 h-4"
                  />
                  ĐÃ HOÀN CÔNG
                </label>
              </div>

              <div className="space-y-1 flex items-center">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasFullConstructionApproval}
                    onChange={e => setHasFullConstructionApproval(e.target.checked)}
                    className="w-4 h-4"
                  />
                  HOÀN CÔNG ĐẦY ĐỦ
                </label>
              </div>

              <div className="space-y-1 flex items-center">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasCashFlow}
                    onChange={e => setHasCashFlow(e.target.checked)}
                    className="w-4 h-4"
                  />
                  CÓ DÒNG TIỀN
                </label>
              </div>

              <div className="space-y-1 flex items-center">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isInExistingResidentialArea}
                    onChange={e => setIsInExistingResidentialArea(e.target.checked)}
                    className="w-4 h-4"
                  />
                  KDC HIỆN HỮU
                </label>
              </div>

              <div className="space-y-1 flex items-center">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasBuildingPermit}
                    onChange={e => setHasBuildingPermit(e.target.checked)}
                    className="w-4 h-4"
                  />
                  GP XÂY DỰNG
                </label>
              </div>

              <div className="space-y-1 flex items-center">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isHardToAccess}
                    onChange={e => setIsHardToAccess(e.target.checked)}
                    className="w-4 h-4"
                  />
                  ĐƯỜNG VÀO KHÓ ĐI
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">LỖI PHONG THỦY</label>
              <select
                value={fengShuiIssue}
                onChange={e => setFengShuiIssue(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
              >
                {FENG_SHUI_ISSUES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">HÀNG XÓM</label>
              <select
                value={neighborType}
                onChange={e => setNeighborType(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none dark:text-white"
              >
                {NEIGHBOR_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">GHI CHÚ</label>
              <textarea
                rows={2}
                placeholder="GHI CHÚ THÊM..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-neutral-100 dark:border-neutral-900 pt-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">NGƯỜI LIÊN HỆ</label>
                <input
                  type="text"
                  placeholder="NGUYỄN VĂN A"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">SĐT LIÊN HỆ</label>
                <input
                  type="text"
                  placeholder="0901234567"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-2 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-3 border-t border-neutral-100 dark:border-neutral-900 pt-4">
              <div>
                <label className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">ẢNH MINIMAL (UPLOADING CDN)</label>
                <span className="text-[9px] text-neutral-400 block tracking-wider uppercase mt-0.5">Tải tệp tin ảnh từ máy lên Discord Webhook CDN miễn phí.</span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <label className="cursor-pointer border border-dashed border-neutral-400 dark:border-neutral-800 hover:border-neutral-950 dark:hover:white w-20 h-20 flex flex-col items-center justify-center gap-1.5 transition-all bg-neutral-50 dark:bg-neutral-900/50">
                  <Upload className="w-4 h-4 text-neutral-500" />
                  <span className="text-[9px] font-bold tracking-wider text-neutral-500 uppercase">Tải tệp</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageFileChange} className="hidden" />
                </label>

                {isUploading && (
                  <div className="w-20 h-20 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-1.5 text-[9px] tracking-wider uppercase">
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                    <span>ĐANG GỬI</span>
                  </div>
                )}

                {uploadedImages.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20 border dark:border-neutral-800 overflow-hidden">
                    <img src={url} alt="Queue" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeUploadedImage(idx)}
                      className="absolute top-1 right-1 bg-neutral-950 text-white p-1 hover:bg-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 py-3 text-xs tracking-widest uppercase font-semibold transition-all"
              >
                {isEditing ? "CẬP NHẬT THÔNG TIN" : "KHỞI TẠO KHÔNG GIAN BẤT ĐỘNG SẢN"}
              </button>
            </div>
          </form>
        </div>

        {/* LIST MANAGEMENT */}
        <div className="space-y-6">
          <div className="border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 space-y-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-neutral-100 dark:border-neutral-900 pb-3 dark:text-white">QUẢN LÝ TIN HIỆN TẠI ({properties.length})</h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {properties.map(p => (
                <div key={p.id} className="p-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-900 flex items-center justify-between gap-3 text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.images[0]} alt="" className="w-10 h-10 object-cover border dark:border-neutral-800" />
                    <div className="min-w-0">
                      <h5 className="font-semibold truncate dark:text-white text-xs">{p.title}</h5>
                      <span className="text-[9px] text-neutral-400 font-mono block mt-0.5">{p.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleEditClick(p)} className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteProperty(p.id)} className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminScreen;