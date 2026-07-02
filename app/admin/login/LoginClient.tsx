"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Smartphone, Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { MOCK_USERS } from '@/types/mock_user';

export default function LoginClient() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [isPhoneSubmitted, setIsPhoneSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [userData, setUserData] = useState<{ id: string; name: string; role: string } | null>(null);

    // Gửi OTP
    const sendOTP = async (phoneNumber: string) => {
        try {
            const user = MOCK_USERS.find(u => u.phone === phoneNumber);
            
            if (!user) {
                setError('❌ Số điện thoại không tồn tại trong hệ thống');
                setIsLoading(false);
                return false;
            }

            setUserData({
                id: user.id,
                name: user.name,
                role: user.role
            });

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            
            localStorage.setItem('admin_otp_' + phoneNumber, otp);
            localStorage.setItem('admin_otp_time_' + phoneNumber, Date.now().toString());

            const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL_3;
            
            if (webhookUrl) {
                const message = {
                    content: `🔐 **MÃ XÁC THỰC 2FA**\n\n` +
                             `👤 **Người dùng:** ${user.name}\n` +
                             `📱 **SĐT:** ${phoneNumber}\n` +
                             `🔑 **Mã OTP:** \`${otp}\`\n` +
                             `⏰ **Hiệu lực:** 5 phút\n\n` +
                             `⚠️ Vui lòng không chia sẻ mã này với bất kỳ ai!`
                };

                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(message)
                });
            }

            setResendCooldown(60);
            const interval = setInterval(() => {
                setResendCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            setError('');
            setIsPhoneSubmitted(true);
            return true;

        } catch (error) {
            console.error('Error sending OTP:', error);
            setError('❌ Lỗi gửi mã xác thực. Vui lòng thử lại.');
            return false;
        }
    };

    // Xác thực OTP
    const verifyOTP = async () => {
        if (!otpCode || otpCode.length !== 6) {
            setError('⚠️ Vui lòng nhập đúng mã 6 chữ số');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const savedOTP = localStorage.getItem('admin_otp_' + phone);
            const savedTime = localStorage.getItem('admin_otp_time_' + phone);
            
            if (!savedOTP || !savedTime) {
                setError('❌ Mã OTP đã hết hạn. Vui lòng yêu cầu lại.');
                setIsLoading(false);
                return;
            }

            const elapsed = Date.now() - parseInt(savedTime);
            if (elapsed > 5 * 60 * 1000) {
                setError('⏰ Mã OTP đã hết hạn. Vui lòng yêu cầu lại.');
                localStorage.removeItem('admin_otp_' + phone);
                localStorage.removeItem('admin_otp_time_' + phone);
                setIsLoading(false);
                return;
            }

            if (otpCode === savedOTP) {
                localStorage.removeItem('admin_otp_' + phone);
                localStorage.removeItem('admin_otp_time_' + phone);

                const user = MOCK_USERS.find(u => u.phone === phone);
                if (user) {
                    const token = 'mock_token_' + Date.now();
                    localStorage.setItem('admin_token', token);
                    localStorage.setItem('admin_user', JSON.stringify({
                        id: user.id,
                        name: user.name,
                        phone: user.phone,
                        role: user.role
                    }));
                    
                    // ✅ Lưu thời gian đăng nhập để kiểm tra tự động logout
                    localStorage.setItem('admin_login_time', Date.now().toString());
                    localStorage.setItem('admin_login_date', new Date().toDateString());
                    
                    window.location.href = '/admin/dashboard';
                }
            } else {
                setError('❌ Mã OTP không đúng. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError('❌ Lỗi xác thực. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;
        setIsLoading(true);
        await sendOTP(phone);
        setIsLoading(false);
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!phone || phone.length < 10) {
            setError('⚠️ Vui lòng nhập số điện thoại hợp lệ (10 số)');
            setIsLoading(false);
            return;
        }

        await sendOTP(phone);
        setIsLoading(false);
    };

    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await verifyOTP();
    };

    const handleBackToPhone = () => {
        setIsPhoneSubmitted(false);
        setOtpCode('');
        setError('');
        setUserData(null);
        localStorage.removeItem('admin_otp_' + phone);
        localStorage.removeItem('admin_otp_time_' + phone);
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
                            {isPhoneSubmitted ? 'Nhập mã xác thực 2FA' : 'Quản trị hệ thống'}
                        </p>
                    </div>

                    {!isPhoneSubmitted ? (
                        <form onSubmit={handlePhoneSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 p-3 text-rose-600 dark:text-rose-400 text-xs tracking-wider flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Số điện thoại
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="0901234567"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 pl-10 pr-4 py-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                        maxLength={10}
                                    />
                                </div>
                                <p className="text-[9px] text-neutral-400 tracking-wider">
                                    💡 Nhập số điện thoại đã đăng ký để nhận mã OTP
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !phone || phone.length < 10}
                                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 py-3.5 text-xs tracking-widest uppercase font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        ĐANG GỬI...
                                    </>
                                ) : (
                                    <>
                                        <Smartphone className="w-4 h-4" />
                                        GỬI MÃ XÁC THỰC
                                    </>
                                )}
                            </button>

                            <div className="text-center text-[9px] text-neutral-400 tracking-wider">
                                <span>🔒 Hệ thống sẽ gửi mã OTP 6 chữ số</span>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleOTPSubmit} className="space-y-6">
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3 text-emerald-600 dark:text-emerald-400 text-xs tracking-wider flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                Đã gửi mã OTP đến số điện thoại {phone}
                            </div>

                            {error && (
                                <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 p-3 text-rose-600 dark:text-rose-400 text-xs tracking-wider flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {userData && (
                                <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-900 p-3 text-center">
                                    <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                        Đăng nhập với
                                    </p>
                                    <p className="text-sm font-semibold dark:text-white">
                                        {userData.name}
                                    </p>
                                    <p className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                        {userData.role === 'admin' ? '🔑 Quản trị viên' : 
                                         userData.role === 'editor' ? '✏️ Biên tập viên' : 
                                         '👁️ Người xem'}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Mã xác thực (6 chữ số)
                                </label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="123456"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 pl-10 pr-4 py-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white font-mono text-center text-lg tracking-[0.5em]"
                                        maxLength={6}
                                    />
                                </div>
                                <p className="text-[9px] text-neutral-400 tracking-wider text-center">
                                    ⏰ Mã có hiệu lực trong 5 phút
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isLoading || otpCode.length !== 6}
                                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 py-3.5 text-xs tracking-widest uppercase font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            ĐANG XÁC THỰC...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-4 h-4" />
                                            XÁC NHẬN
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-900">
                                <button
                                    type="button"
                                    onClick={handleBackToPhone}
                                    className="text-[9px] text-neutral-400 hover:text-neutral-900 dark:hover:text-white uppercase tracking-wider transition-colors"
                                >
                                    ← Quay lại
                                </button>

                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={resendCooldown > 0 || isLoading}
                                    className="text-[9px] text-neutral-400 hover:text-neutral-900 dark:hover:text-white uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resendCooldown > 0 
                                        ? `Gửi lại sau ${resendCooldown}s` 
                                        : 'Gửi lại mã'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}