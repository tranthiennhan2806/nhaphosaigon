// src/hooks/useAutoLogout.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAutoLogout() {
    const router = useRouter();

    useEffect(() => {
        const checkSession = () => {
            const token = localStorage.getItem('admin_token');
            const loginDate = localStorage.getItem('admin_login_date');
            const loginTime = localStorage.getItem('admin_login_time');

            if (!token) return;

            // Nếu không có thông tin ngày đăng nhập, coi như chưa login
            if (!loginDate || !loginTime) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                localStorage.removeItem('admin_login_date');
                localStorage.removeItem('admin_login_time');
                window.location.href = '/admin/login';
                return;
            }

            // Kiểm tra ngày hiện tại
            const today = new Date().toDateString();
            const loginDay = loginDate;

            // Nếu ngày đăng nhập khác ngày hiện tại -> tự động logout
            if (today !== loginDay) {
                console.log('🔄 Auto logout: New day detected');

                // Xóa toàn bộ session
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                localStorage.removeItem('admin_login_date');
                localStorage.removeItem('admin_login_time');

                // Chuyển đến trang login
                window.location.href = '/admin/login';
                return;
            }

            // Kiểm tra thời gian đăng nhập (tùy chọn: nếu muốn giới hạn thêm)
            const loginTimeMs = parseInt(loginTime);
            const currentTime = Date.now();
            const sessionDuration = 24 * 60 * 60 * 1000; // 24 giờ

            if (currentTime - loginTimeMs > sessionDuration) {
                console.log('🔄 Auto logout: Session expired (24 hours)');

                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                localStorage.removeItem('admin_login_date');
                localStorage.removeItem('admin_login_time');

                window.location.href = '/admin/login';
            }
        };

        // Kiểm tra ngay khi component mount
        checkSession();

        // Kiểm tra mỗi phút (60,000 ms)
        const interval = setInterval(checkSession, 60000);

        // Kiểm tra khi tab được focus lại
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkSession();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [router]);
}