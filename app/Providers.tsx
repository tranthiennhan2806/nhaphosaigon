"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Moon, Sun, Eye } from 'lucide-react';

// Import types and constants
import { Property, FilterState } from '@/types';
import { MOCK_PROPERTIES } from '@/configs/constants';

// Import hooks
import { useGoogleSheets } from '@/hooks/useGoogleSheets';

// Export AppContext để các trang khác có thể import
export const AppContext = React.createContext<{
    properties: Property[];
    setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    darkMode: boolean;
    toggleDarkMode: () => void;
    showToast: (message: string, type?: string) => void;
    isLoading: boolean;
    handleSyncData: () => Promise<void>;
    savePropertiesState: (newProps: Property[]) => void;
}>({
    properties: [],
    setProperties: () => { },
    filters: {
        search: '',
        type: 'sale',
        minPrice: '',
        maxPrice: '',
        minArea: '',
        maxArea: '',
        location: '',
    },
    setFilters: () => { },
    darkMode: false,
    toggleDarkMode: () => { },
    showToast: () => { },
    isLoading: false,
    handleSyncData: async () => { },
    savePropertiesState: () => { },
});

export default function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
    const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        type: 'sale',
        minPrice: '',
        maxPrice: '',
        minArea: '',
        maxArea: '',
        location: '',
    });

    // Cấu hình cho Google Sheets (chỉ đọc)
    const config = {
        spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID || "",
        googleApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
        googleClientEmail: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL || "",
        googlePrivateKey: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY || "",
        discordWebhookUrl: "",
        discordWebhookUrl2: "",
        isUsingMock: true
    };

    const { isLoading, fetchProperties } = useGoogleSheets(config);

    // Toast notification
    const showToast = (message: string, type: string = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Load initial data
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
        }

        const savedProperties = localStorage.getItem('properties_db');
        if (savedProperties) {
            try {
                setProperties(JSON.parse(savedProperties));
            } catch (e) { }
        } else {
            localStorage.setItem('properties_db', JSON.stringify(MOCK_PROPERTIES));
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const savePropertiesState = (newProps: Property[]) => {
        setProperties(newProps);
        localStorage.setItem('properties_db', JSON.stringify(newProps));
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
    };

    const handleSyncData = async () => {
        try {
            const data = await fetchProperties();
            savePropertiesState(data);
            showToast("Đồng bộ dữ liệu thành công!");
        } catch (error) {
            showToast("Lỗi đồng bộ dữ liệu.", "error");
        }
    };

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname?.startsWith(path)) return true;
        return false;
    };

    // 🔴 QUAN TRỌNG: Kiểm tra chính xác đường dẫn admin
    const isAdminRoute = pathname?.startsWith('/admin');

    // Nếu là admin route, KHÔNG hiển thị frontend layout
    if (isAdminRoute) {
        return <>{children}</>;
    }

    return (
        <AppContext.Provider value={{
            properties,
            setProperties,
            filters,
            setFilters,
            darkMode,
            toggleDarkMode,
            showToast,
            isLoading,
            handleSyncData,
            savePropertiesState,
        }}>
            {/* TOAST */}
            {toast && (
                <div className="fixed top-8 right-8 z-50 max-w-sm animate-fade-in-up">
                    <div className="flex items-center gap-2 p-4 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs tracking-wider uppercase border border-neutral-800 dark:border-neutral-200 shadow-md">
                        <span className="font-semibold">{toast.message}</span>
                    </div>
                </div>
            )}

            {/* HEADER - Chỉ hiển thị cho frontend */}
            <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-950/90 border-b border-neutral-200 dark:border-neutral-900 transition-colors backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex flex-col cursor-pointer">
                            <span className="font-light text-xl tracking-[0.25em] uppercase text-neutral-900 dark:text-white">
                                Dream<span className="font-semibold">home</span>.
                            </span>
                            <span className="text-[9px] tracking-widest text-neutral-400 uppercase">SOUTHERN PORTAL</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6 text-[10px] tracking-widest uppercase">
                            <Link href="/" className={`transition-colors ${isActive('/') ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}>
                                Trang chủ
                            </Link>
                            <Link href="/listings" className={`transition-colors ${isActive('/listings') ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}>
                                Danh sách
                            </Link>
                            <Link href="/admin/login" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                                Quản lý
                            </Link>
                            <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800"></div>
                            <button onClick={toggleDarkMode} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-6xl mx-auto px-6 pt-10 pb-28 md:pb-16">
                {children}
            </main>

            {/* FOOTER */}
            <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-900 py-16 hidden md:block">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-4">
                        <div>
                            <span className="font-light text-lg tracking-[0.25em] uppercase text-neutral-900 dark:text-white">
                                Dream<span className="font-semibold">home</span>.
                            </span>
                            <p className="text-[11px] tracking-wide text-neutral-400 mt-2 max-w-xs leading-relaxed uppercase">
                                Nền tảng tìm kiếm bất động sản cao cấp tại Quận trung tâm & Nam Sài Gòn.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-16 text-[10px] tracking-widest uppercase text-neutral-500">
                        <div className="flex flex-col gap-2">
                            <span className="font-bold text-neutral-800 dark:text-neutral-200">ĐIỀU HƯỚNG</span>
                            <Link href="/" className="hover:text-neutral-900 dark:hover:text-white">TRANG CHỦ</Link>
                            <Link href="/listings" className="hover:text-neutral-900 dark:hover:text-white">KHÔNG GIAN</Link>
                            <Link href="/admin/login" className="hover:text-neutral-900 dark:hover:text-white">QUẢN LÝ</Link>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-900 flex justify-between items-center text-[10px] tracking-widest uppercase text-neutral-400">
                    <span>© 2026 DREAMHOME. ALL RIGHTS RESERVED.</span>
                    <span>EST. 2026</span>
                </div>
            </footer>
        </AppContext.Provider>
    );
}