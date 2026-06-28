import React from 'react';
import { Building2, Users, Eye, TrendingUp } from 'lucide-react';

interface AdminDashboardProps {
    user: any;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
    const stats = [
        { label: 'Tổng BĐS', value: '156', icon: Building2, color: 'bg-blue-500' },
        { label: 'Đang hiển thị', value: '42', icon: Eye, color: 'bg-emerald-500' },
        { label: 'Nhân viên', value: '8', icon: Users, color: 'bg-purple-500' },
        { label: 'Lượt xem', value: '2.4K', icon: TrendingUp, color: 'bg-amber-500' },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-semibold tracking-[0.2em] uppercase dark:text-white">
                    Dashboard
                </h1>
                <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">
                    Chào mừng {user?.name} trở lại
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] tracking-widest text-neutral-400 uppercase">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-semibold mt-2 dark:text-white">
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

            {/* Thêm các phần khác của dashboard */}
        </div>
    );
}