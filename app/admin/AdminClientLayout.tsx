"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAutoLogout } from '@/hooks/useAutoLogout';
import {
    LayoutDashboard,
    Building2,
    Users,
    Settings,
    LogOut,
    Moon,
    Sun,
    Menu,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Property, AppConfig } from '@/types';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';

// Admin context
export const AdminContext = React.createContext<{
    user: any | null;
    isLoading: boolean;
    logout: () => void;
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    properties: Property[];
    setProperties: (properties: Property[]) => void;
    refreshProperties: () => Promise<void>;
}>({
    user: null,
    isLoading: false,
    logout: () => { },
    sidebarCollapsed: false,
    toggleSidebar: () => { },
    properties: [],
    setProperties: () => { },
    refreshProperties: async () => {},
});

interface AdminClientLayoutProps {
    children: React.ReactNode;
}

export default function AdminClientLayout({ children }: AdminClientLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [properties, setProperties] = useState<Property[]>([]);
    const [isPropertiesLoading, setIsPropertiesLoading] = useState<boolean>(true);

    // Load config từ environment variables
    const config: AppConfig = {
        spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID || "",
        googleApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
        googleClientEmail: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL || "",
        googlePrivateKey: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY || "",
        discordWebhookUrl: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || "",
        discordWebhookUrl2: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL_2 || "",
        isUsingMock: false
    };

    // Lấy functions từ hook
    const { fetchProperties } = useGoogleSheets(config);

    // ✅ Auto logout khi qua ngày mới
    useAutoLogout();

    // Kiểm tra authentication
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('admin_token');
            const userData = localStorage.getItem('admin_user');

            if (token && userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                } catch (e) {
                    console.error('❌ Error parsing user data:', e);
                    setUser(null);
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_user');
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        };

        checkAuth();

        // Load theme
        const savedTheme = localStorage.getItem('admin_theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }

        const savedSidebarState = localStorage.getItem('admin_sidebar_collapsed');
        if (savedSidebarState === 'true') {
            setSidebarCollapsed(true);
        }
    }, []);

    // Fetch properties từ Google Sheets
    const refreshProperties = async () => {
        setIsPropertiesLoading(true);
        try {
            const data = await fetchProperties();
            setProperties(data || []);
            console.log(`✅ Loaded ${data?.length || 0} properties from Google Sheets`);
        } catch (error) {
            console.error('❌ Error loading properties:', error);
            setProperties([]);
        } finally {
            setIsPropertiesLoading(false);
        }
    };

    // Load properties khi user đã đăng nhập
    useEffect(() => {
        if (user) {
            refreshProperties();
        }
    }, [user]);

    // Redirect logic
    useEffect(() => {
        if (!isLoading) {
            if (pathname === '/admin/login' && user) {
                router.push('/admin/dashboard');
                return;
            }

            if (!user && pathname !== '/admin/login' && !pathname?.startsWith('/api/')) {
                router.push('/admin/login');
            }
        }
    }, [isLoading, user, pathname, router]);

    const logout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_login_date');
        localStorage.removeItem('admin_login_time');
        setUser(null);
        setProperties([]);
        window.location.href = '/admin/login';
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('admin_theme', !darkMode ? 'dark' : 'light');
        if (!darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
        localStorage.setItem('admin_sidebar_collapsed', String(!sidebarCollapsed));
    };

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { label: 'Bất động sản', icon: Building2, href: '/admin/properties' },
        { label: 'Nhân viên', icon: Users, href: '/admin/users' },
        { label: 'Cài đặt', icon: Settings, href: '/admin/settings' },
    ];

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white mx-auto"></div>
                    <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <AdminContext.Provider value={{ 
            user, 
            isLoading: isPropertiesLoading, 
            logout, 
            sidebarCollapsed, 
            toggleSidebar,
            properties,
            setProperties,
            refreshProperties
        }}>
            <div className={`min-h-screen ${darkMode ? 'dark bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`}>
                {/* Sidebar */}
                <aside 
                    className={`fixed top-0 left-0 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-900 transition-all duration-300 z-50 ${
                        sidebarCollapsed ? 'w-20' : 'w-64'
                    } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
                >
                    <div className={`p-4 border-b border-neutral-200 dark:border-neutral-900 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                        <Link href="/admin/dashboard" className={`flex flex-col ${sidebarCollapsed ? 'items-center' : ''}`}>
                            <span className={`font-light tracking-[0.25em] uppercase text-neutral-900 dark:text-white ${sidebarCollapsed ? 'text-lg' : 'text-xl'}`}>
                                {sidebarCollapsed ? 'DH' : 'Dreamhome'}
                            </span>
                            {!sidebarCollapsed && (
                                <span className="text-[9px] tracking-widest text-neutral-400 uppercase">ADMIN PANEL</span>
                            )}
                        </Link>
                    </div>

                    <button
                        onClick={toggleSidebar}
                        className={`absolute -right-3 top-20 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors shadow-md ${sidebarCollapsed ? 'rotate-180' : ''}`}
                    >
                        {sidebarCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        ) : (
                            <ChevronLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        )}
                    </button>

                    <nav className="p-4 space-y-1 mt-4">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-3 text-xs tracking-widest uppercase transition-colors rounded-lg ${
                                        isActive
                                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold'
                                            : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white'
                                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                                    title={sidebarCollapsed ? item.label : ''}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {!sidebarCollapsed && item.label}
                                </Link>
                            );
                        })}

                        <div className={`pt-4 border-t border-neutral-200 dark:border-neutral-900 mt-4 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
                            <button
                                onClick={logout}
                                className={`flex items-center gap-3 px-3 py-3 text-xs tracking-widest uppercase text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors ${
                                    sidebarCollapsed ? 'justify-center w-full' : ''
                                }`}
                                title={sidebarCollapsed ? 'Đăng xuất' : ''}
                            >
                                <LogOut className="w-5 h-5 flex-shrink-0" />
                                {!sidebarCollapsed && 'Đăng xuất'}
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main content */}
                <div className={`transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                    {/* Header */}
                    <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-950/90 border-b border-neutral-200 dark:border-neutral-900 backdrop-blur-sm">
                        <div className="px-6 h-16 flex items-center justify-between">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
                            >
                                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>

                            <div className="flex items-center gap-4 ml-auto">
                                {/* Hiển thị thời gian đăng nhập */}
                                <div className="hidden sm:block text-[9px] text-neutral-400 tracking-wider">
                                    <span className="mr-2">🕐</span>
                                    {new Date().toLocaleDateString('vi-VN')}
                                </div>

                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
                                >
                                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>

                                {user && (
                                    <div className="flex items-center gap-3 text-xs">
                                        <span className="text-neutral-400 uppercase tracking-wider hidden sm:inline">
                                            {user.role || 'Admin'}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                            {user.name?.charAt(0) || 'A'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="p-6">
                        {children}
                    </main>
                </div>
            </div>
        </AdminContext.Provider>
    );
}