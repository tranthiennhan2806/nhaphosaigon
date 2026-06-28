"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

// Mock users database
const MOCK_USERS = [
    {
        id: '1',
        email: 'admin@dreamhome.com',
        password: 'admin123',
        name: 'Admin',
        role: 'admin'
    },
    {
        id: '2',
        email: 'editor@dreamhome.com',
        password: 'editor123',
        name: 'Editor',
        role: 'editor'
    },
    {
        id: '3',
        email: 'viewer@dreamhome.com',
        password: 'viewer123',
        name: 'Viewer',
        role: 'viewer'
    }
];

export default function LoginClient() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const user = MOCK_USERS.find(
            u => u.email === email && u.password === password
        );

        if (user) {
            localStorage.setItem('admin_token', 'mock_token_' + Date.now());
            localStorage.setItem('admin_user', JSON.stringify({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }));
            router.push('/admin/dashboard');
        } else {
            setError('Email hoặc mật khẩu không đúng');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-8">
                    <div className="text-center mb-8">
                        <h1 className="font-light text-2xl tracking-[0.25em] uppercase text-neutral-900 dark:text-white">
                            Dream<span className="font-semibold">home</span>
                        </h1>
                        <p className="text-[11px] tracking-widest text-neutral-400 uppercase mt-2">
                            Quản trị hệ thống
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 p-3 text-rose-600 dark:text-rose-400 text-xs tracking-wider uppercase">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@dreamhome.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 pl-10 pr-4 py-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 pl-10 pr-12 py-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 py-3.5 text-xs tracking-widest uppercase font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-900">
                        <p className="text-[9px] text-neutral-400 uppercase tracking-wider text-center">
                            Tài khoản mẫu:
                        </p>
                        <div className="mt-2 space-y-1 text-[10px] text-neutral-500 font-mono text-center">
                            <div>admin@dreamhome.com / admin123</div>
                            <div>editor@dreamhome.com / editor123</div>
                            <div>viewer@dreamhome.com / viewer123</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}