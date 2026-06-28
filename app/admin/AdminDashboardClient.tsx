"use client";

import React, { useContext } from 'react';
import { Building2, Users, Eye, TrendingUp, Menu } from 'lucide-react';
import { AdminContext } from './AdminClientLayout';

export default function AdminDashboardClient() {
    const { user, sidebarCollapsed, toggleSidebar } = useContext(AdminContext);

    const stats = [
        { label: 'Tổng BĐS', value: '156', icon: Building2, color: 'bg-blue-500' },
        { label: 'Đang hiển thị', value: '42', icon: Eye, color: 'bg-emerald-500' },
        { label: 'Nhân viên', value: '8', icon: Users, color: 'bg-purple-500' },
        { label: 'Lượt xem', value: '2.4K', icon: TrendingUp, color: 'bg-amber-500' },
    ];

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-[0.2em] uppercase dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">
                        Chào mừng {user?.name} trở lại
                    </p>
                </div>

                {/* Nút thu phóng trên thanh tiêu đề (hiển thị trên mobile) */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-800"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] tracking-widest text-neutral-400 uppercase">
                                    {stat.label}
                                </p>
                                <p className={`text-2xl font-semibold mt-2 dark:text-white transition-all duration-300`}>
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p-3 ${stat.color} bg-opacity-10 dark:bg-opacity-20 rounded-lg`}>
                                <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6">
                    <h3 className="text-xs font-semibold tracking-widest uppercase dark:text-white border-b border-neutral-200 dark:border-neutral-900 pb-3 mb-4">
                        Hoạt động gần đây
                    </h3>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3 text-xs">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-neutral-600 dark:text-neutral-400">
                                    Cập nhật bất động sản #{i}
                                </span>
                                <span className="ml-auto text-neutral-400">2 phút trước</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6">
                    <h3 className="text-xs font-semibold tracking-widest uppercase dark:text-white border-b border-neutral-200 dark:border-neutral-900 pb-3 mb-4">
                        Thống kê nhanh
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400">BĐS đang bán</span>
                            <span className="font-semibold dark:text-white">42</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400">BĐS đã bán</span>
                            <span className="font-semibold dark:text-white">18</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400">Khách hàng tiềm năng</span>
                            <span className="font-semibold dark:text-white">37</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400">Tỷ lệ chuyển đổi</span>
                            <span className="font-semibold dark:text-white">24.5%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}