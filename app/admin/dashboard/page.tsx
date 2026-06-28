import AdminDashboardClient from "../AdminDashboardClient";

export const metadata = {
  title: 'Dashboard - Dreamhome Admin',
  description: 'Tổng quan hệ thống quản trị Dreamhome',
};

export default function DashboardPage() {
  return <AdminDashboardClient />;
}