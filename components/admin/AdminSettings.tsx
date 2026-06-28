import React, { useState } from 'react';
import { Save, RefreshCw, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface AdminSettingsProps {
    config: {
        spreadsheetId: string;
        googleClientEmail: string;
        googlePrivateKey: string;
        discordWebhookUrl: string;
        discordWebhookUrl2: string;
    };
    onSave: (config: any) => void;
    onTestConnection?: () => Promise<boolean>;
}

export function AdminSettings({ config, onSave, onTestConnection }: AdminSettingsProps) {
    const [formData, setFormData] = useState(config);
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await onSave(formData);
            setTestResult({
                success: true,
                message: 'Đã lưu cấu hình thành công!'
            });
            setTimeout(() => setTestResult(null), 3000);
        } catch (error) {
            setTestResult({
                success: false,
                message: 'Lỗi khi lưu cấu hình'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleTestConnection = async () => {
        if (!onTestConnection) return;

        setIsTesting(true);
        setTestResult(null);

        try {
            const success = await onTestConnection();
            setTestResult({
                success,
                message: success ? 'Kết nối thành công!' : 'Kết nối thất bại. Vui lòng kiểm tra lại thông tin.'
            });
        } catch (error) {
            setTestResult({
                success: false,
                message: 'Lỗi khi kiểm tra kết nối'
            });
        } finally {
            setIsTesting(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-semibold tracking-[0.2em] uppercase dark:text-white">
                    Cài đặt hệ thống
                </h1>
                <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">
                    Cấu hình kết nối Google Sheets và Discord Webhook
                </p>
            </div>

            {testResult && (
                <div className={`mb-6 p-4 border ${testResult.success
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                    }`}>
                    <div className="flex items-center gap-2">
                        {testResult.success
                            ? <CheckCircle className="w-4 h-4" />
                            : <AlertCircle className="w-4 h-4" />
                        }
                        <span className="text-xs tracking-wider uppercase">{testResult.message}</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 space-y-4">
                    <h3 className="text-xs font-semibold tracking-widest uppercase dark:text-white border-b border-neutral-200 dark:border-neutral-900 pb-3">
                        📊 Google Sheets Configuration
                    </h3>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                            Spreadsheet ID *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="1_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                            value={formData.spreadsheetId}
                            onChange={(e) => handleChange('spreadsheetId', e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                        />
                        <p className="text-[9px] text-neutral-400 tracking-wider">
                            Lấy từ URL: https://docs.google.com/spreadsheets/d/&lt;SPREADSHEET_ID&gt;/edit
                        </p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                            Service Account Email *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="example@project.iam.gserviceaccount.com"
                            value={formData.googleClientEmail}
                            onChange={(e) => handleChange('googleClientEmail', e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                            Private Key (PEM) *
                        </label>
                        <div className="relative">
                            <textarea
                                required
                                rows={6}
                                placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                                value={formData.googlePrivateKey}
                                onChange={(e) => handleChange('googlePrivateKey', e.target.value)}
                                className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-[10px] font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white resize-y"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPrivateKey(!showPrivateKey)}
                                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                            >
                                {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-[9px] text-neutral-400 tracking-wider">
                            Private key từ Service Account JSON file (bao gồm cả BEGIN và END)
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 space-y-4">
                    <h3 className="text-xs font-semibold tracking-widest uppercase dark:text-white border-b border-neutral-200 dark:border-neutral-900 pb-3">
                        💬 Discord Webhook Configuration
                    </h3>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                            Webhook URL (Chính)
                        </label>
                        <input
                            type="text"
                            placeholder="https://discord.com/api/webhooks/..."
                            value={formData.discordWebhookUrl}
                            onChange={(e) => handleChange('discordWebhookUrl', e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                            Webhook URL (Dự phòng)
                        </label>
                        <input
                            type="text"
                            placeholder="https://discord.com/api/webhooks/..."
                            value={formData.discordWebhookUrl2}
                            onChange={(e) => handleChange('discordWebhookUrl2', e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 px-8 py-3 text-xs tracking-widest uppercase font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'ĐANG LƯU...' : 'LƯU CẤU HÌNH'}
                    </button>

                    {onTestConnection && (
                        <button
                            type="button"
                            onClick={handleTestConnection}
                            disabled={isTesting}
                            className="w-full sm:w-auto border border-neutral-300 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white px-8 py-3 text-xs tracking-widest uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                            {isTesting ? 'ĐANG KIỂM TRA...' : 'KIỂM TRA KẾT NỐI'}
                        </button>
                    )}
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-[10px] font-bold tracking-widest text-amber-700 dark:text-amber-300 uppercase">
                                Lưu ý quan trọng
                            </p>
                            <ul className="text-[9px] text-amber-600 dark:text-amber-400 tracking-wider mt-1 space-y-1 list-disc pl-4">
                                <li>Đảm bảo Service Account có quyền Editor trên Google Sheets</li>
                                <li>Private key phải bao gồm cả "-----BEGIN PRIVATE KEY-----" và "-----END PRIVATE KEY-----"</li>
                                <li>Các thay đổi sẽ được lưu vào localStorage và áp dụng ngay</li>
                                <li>Kiểm tra kết nối trước khi sử dụng để đảm bảo cấu hình đúng</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Environment Variables Reference */}
                <div className="bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-6">
                    <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">
                        📋 Environment Variables Reference
                    </h4>
                    <div className="space-y-2 text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-2 bg-white dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800">
                            <span className="font-bold text-neutral-900 dark:text-white">NEXT_PUBLIC_SPREADSHEET_ID</span>
                            <span className="text-neutral-400">=</span>
                            <span className="break-all">{formData.spreadsheetId || 'chưa cấu hình'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-2 bg-white dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800">
                            <span className="font-bold text-neutral-900 dark:text-white">NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL</span>
                            <span className="text-neutral-400">=</span>
                            <span className="break-all">{formData.googleClientEmail || 'chưa cấu hình'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-2 bg-white dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800">
                            <span className="font-bold text-neutral-900 dark:text-white">NEXT_PUBLIC_GOOGLE_PRIVATE_KEY</span>
                            <span className="text-neutral-400">=</span>
                            <span className="break-all">{formData.googlePrivateKey ? '•••••••• (đã cấu hình)' : 'chưa cấu hình'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-2 bg-white dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800">
                            <span className="font-bold text-neutral-900 dark:text-white">NEXT_PUBLIC_DISCORD_WEBHOOK_URL</span>
                            <span className="text-neutral-400">=</span>
                            <span className="break-all">{formData.discordWebhookUrl || 'chưa cấu hình'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-2 bg-white dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800">
                            <span className="font-bold text-neutral-900 dark:text-white">NEXT_PUBLIC_DISCORD_WEBHOOK_URL_2</span>
                            <span className="text-neutral-400">=</span>
                            <span className="break-all">{formData.discordWebhookUrl2 || 'chưa cấu hình'}</span>
                        </div>
                    </div>
                    <p className="mt-3 text-[9px] text-neutral-400 tracking-wider">
                        💡 Các biến môi trường này sẽ được sử dụng khi khởi động ứng dụng.
                        Bạn có thể cấu hình trong file .env.local để tự động load.
                    </p>
                </div>
            </form>
        </div>
    );
}