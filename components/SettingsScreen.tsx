// import React, { useState } from 'react';
// import { AppConfig } from '@/types';

// interface SettingsScreenProps {
//     config: AppConfig;
//     onSave: (config: AppConfig) => void;
//     onSync: () => void;
//     isLoading: boolean;
// }

// export function SettingsScreen({ config, onSave, onSync, isLoading }: SettingsScreenProps) {
//     const [ssId, setSsId] = useState<string>(config.spreadsheetId);
//     const [apiKey, setApiKey] = useState<string>(config.googleApiKey);
//     const [webhookUrl, setWebhookUrl] = useState<string>(config.discordWebhookUrl);
//     const [isVisible, setIsVisible] = useState(true);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSave({
//             spreadsheetId: ssId,
//             googleApiKey: apiKey,
//             discordWebhookUrl: webhookUrl,
//             isUsingMock: !ssId
//         });
//     };

//     return (
//         <div
//             style={{
//                 opacity: isVisible ? 1 : 0,
//                 transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
//             }}
//             className="max-w-4xl mx-auto space-y-8"
//         >
//             <div className="border-b border-neutral-200 dark:border-neutral-900 pb-4">
//                 <h1 className="text-lg font-semibold tracking-[0.2em] uppercase dark:text-white">KẾT NỐI API & ENVIRONMENT</h1>
//                 <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">
//                     Cấu hình liên kết đến Google Sheets của bạn và kênh Discord của nhóm.
//                 </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

//                 {/* Settings Form */}
//                 <div className="md:col-span-2 border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 space-y-6">
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div className="space-y-1.5">
//                             <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
//                                 SPREADSHEET ID
//                             </label>
//                             <input
//                                 type="text"
//                                 placeholder="VÍ DỤ: 1_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
//                                 value={ssId}
//                                 onChange={e => setSsId(e.target.value)}
//                                 className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs tracking-widest uppercase focus:outline-none dark:text-white font-mono"
//                             />
//                             <p className="text-[9px] text-neutral-400 tracking-wider">
//                                 Lấy từ URL Google Sheets: https://docs.google.com/spreadsheets/d/&lt;SPREADSHEET_ID&gt;/edit
//                             </p>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
//                                 GOOGLE SHEETS API KEY (READ ONLY)
//                             </label>
//                             <input
//                                 type="password"
//                                 placeholder="NHẬP API KEY ĐÃ ĐĂNG KÝ..."
//                                 value={apiKey}
//                                 onChange={e => setApiKey(e.target.value)}
//                                 className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs tracking-widest uppercase focus:outline-none dark:text-white font-mono"
//                             />
//                             <p className="text-[9px] text-neutral-400 tracking-wider">
//                                 Tạo tại: https://console.cloud.google.com/apis/credentials
//                             </p>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
//                                 DISCORD WEBHOOK URL
//                             </label>
//                             <input
//                                 type="text"
//                                 placeholder="HTTPS://DISCORD.COM/API/WEBHOOKS/..."
//                                 value={webhookUrl}
//                                 onChange={e => setWebhookUrl(e.target.value)}
//                                 className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs tracking-widest uppercase focus:outline-none dark:text-white font-mono"
//                             />
//                             <p className="text-[9px] text-neutral-400 tracking-wider">
//                                 Tạo Webhook trong Discord Server Settings &gt; Integrations
//                             </p>
//                         </div>

//                         <div className="flex gap-3 pt-3">
//                             <button
//                                 type="submit"
//                                 className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 px-6 py-3 text-xs tracking-widest uppercase font-semibold transition-all"
//                             >
//                                 LƯU CẤU HÌNH
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={onSync}
//                                 disabled={isLoading}
//                                 className="border border-neutral-300 dark:border-neutral-800 hover:border-neutral-900 dark:hover:white px-5 py-3 text-xs tracking-widest uppercase transition-all"
//                             >
//                                 {isLoading ? 'ĐANG TẢI...' : 'ĐỒNG BỘ THỬ NGHIỆM'}
//                             </button>
//                         </div>
//                     </form>
//                 </div>

//                 {/* Env Instructions */}
//                 <div className="border border-neutral-200 dark:border-neutral-900 bg-neutral-100/55 dark:bg-neutral-900/50 p-6 space-y-4">
//                     <h4 className="text-xs font-semibold tracking-widest uppercase dark:text-white">NEXT.JS ENV.LOCAL</h4>
//                     <p className="text-[10px] tracking-wide text-neutral-400 uppercase leading-relaxed">
//                         Sao chép đoạn cấu hình dưới đây đặt vào file `.env.local` của dự án Next.js:
//                     </p>

//                     <pre className="p-3 bg-neutral-950 text-neutral-400 text-[10px] overflow-x-auto font-mono tracking-normal leading-normal border border-neutral-800 uppercase">
//                         {`NEXT_PUBLIC_SPREADSHEET_ID="${ssId || 'ID_CỦA_SHEET'}"
// NEXT_PUBLIC_GOOGLE_API_KEY="${apiKey ? '••••••••' : 'API_KEY'}"
// NEXT_PUBLIC_DISCORD_WEBHOOK_URL="${webhookUrl || 'WEBHOOK_URL'}"`}
//                     </pre>

//                     <div className="space-y-3 text-[9px] text-neutral-400 uppercase tracking-wider leading-relaxed">
//                         <p>✅ Đảm bảo bạn chia sẻ bảng Google Sheets ở chế độ:</p>
//                         <ul className="list-disc pl-4 space-y-1">
//                             <li>"Bất kỳ ai có liên kết đều có thể xem"</li>
//                             <li>Hoặc thêm API Key vào danh sách truy cập</li>
//                         </ul>
//                         <p className="mt-2 text-amber-600 dark:text-amber-400">
//                             ⚠️ Lưu ý: API Key chỉ hỗ trợ đọc dữ liệu, không hỗ trợ ghi.
//                         </p>
//                         <p className="mt-1 text-emerald-600 dark:text-emerald-400">
//                             💡 Để ghi dữ liệu, sử dụng Service Account hoặc OAuth 2.0
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* Hướng dẫn cấu hình Google Sheets */}
//             <div className="border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 space-y-4">
//                 <h4 className="text-xs font-semibold tracking-widest uppercase dark:text-white">
//                     📋 HƯỚNG DẪN CẤU HÌNH GOOGLE SHEETS
//                 </h4>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] tracking-wider">
//                     <div className="space-y-2">
//                         <p className="font-bold text-neutral-900 dark:text-white uppercase">Bước 1: Tạo Google Sheets</p>
//                         <ul className="list-decimal pl-4 space-y-1 text-neutral-600 dark:text-neutral-400">
//                             <li>Tạo bảng tính mới trên Google Sheets</li>
//                             <li>Thêm header cho các cột (tham khảo bên dưới)</li>
//                             <li>Điền dữ liệu mẫu</li>
//                         </ul>
//                     </div>

//                     <div className="space-y-2">
//                         <p className="font-bold text-neutral-900 dark:text-white uppercase">Bước 2: Cấu hình API</p>
//                         <ul className="list-decimal pl-4 space-y-1 text-neutral-600 dark:text-neutral-400">
//                             <li>Truy cập Google Cloud Console</li>
//                             <li>Bật Google Sheets API</li>
//                             <li>Tạo API Key</li>
//                             <li>Giới hạn API Key chỉ cho Sheets API</li>
//                         </ul>
//                     </div>
//                 </div>

//                 <div className="mt-4 overflow-x-auto">
//                     <p className="text-[10px] font-bold text-neutral-900 dark:text-white uppercase mb-2">
//                         Cấu trúc Google Sheets (Header):
//                     </p>
//                     <div className="bg-neutral-100 dark:bg-neutral-900 p-3 rounded text-[9px] font-mono text-neutral-700 dark:text-neutral-300 overflow-x-auto whitespace-nowrap">
//                         ID | Tiêu đề | Mô tả | Giá (VNĐ) | Diện tích (m²) | Địa chỉ | Quận/Huyện | Số phòng ngủ | Số toilet | URL ảnh (cách nhau bằng dấu phẩy) | Tên liên hệ | SĐT liên hệ
//                     </div>
//                     <p className="text-[9px] text-neutral-400 mt-2">
//                         💡 Mỗi cột tương ứng với một trường trong Property. Các trường boolean sử dụng true/false.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SettingsScreen;