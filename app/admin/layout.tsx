import type { Metadata } from 'next';
import AdminClientLayout from './AdminClientLayout';

export const metadata: Metadata = {
    title: 'Dreamhome - Quản trị hệ thống',
    description: 'Quản trị bất động sản Dreamhome',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminClientLayout>{children}</AdminClientLayout>;
}