import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Mail, Search, X } from 'lucide-react';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'editor' | 'viewer';
    createdAt: string;
    avatar?: string;
}

// Interface cho việc tạo user mới (có password)
interface NewUserInput {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'editor' | 'viewer';
}

// Interface cho việc update user (không có password)
interface UpdateUserInput {
    email: string;
    name: string;
    role: 'admin' | 'editor' | 'viewer';
}

interface AdminUsersProps {
    users: User[];
    onAddUser?: (user: NewUserInput) => void;
    onEditUser?: (user: UpdateUserInput & { id: string }) => void;
    onDeleteUser?: (id: string) => void;
}

export function AdminUsers({ users, onAddUser, onEditUser, onDeleteUser }: AdminUsersProps) {
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'viewer' as 'admin' | 'editor' | 'viewer',
    });

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const roleColors = {
        admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        editor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        viewer: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    };

    const roleLabels = {
        admin: 'Quản trị viên',
        editor: 'Biên tập viên',
        viewer: 'Người xem',
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            // Update user - không cần password
            onEditUser?.({
                id: editingUser.id,
                email: formData.email,
                name: formData.name,
                role: formData.role,
            });
        } else {
            // Add new user - cần password
            onAddUser?.({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: formData.role,
            });
        }

        resetForm();
    };

    const resetForm = () => {
        setIsFormOpen(false);
        setEditingUser(null);
        setFormData({
            email: '',
            password: '',
            name: '',
            role: 'viewer',
        });
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            email: user.email,
            password: '', // Password không được gửi lên khi edit
            name: user.name,
            role: user.role,
        });
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
            onDeleteUser?.(id);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold tracking-[0.2em] uppercase dark:text-white">
                        Quản lý nhân viên
                    </h1>
                    <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">
                        Tổng {users.length} nhân viên
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-xs tracking-wider focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white w-40 sm:w-60"
                        />
                    </div>

                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 px-4 py-2 text-xs tracking-widest uppercase font-semibold transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm nhân viên
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 overflow-hidden">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-900">
                            <th className="text-left p-4 text-[10px] tracking-widest text-neutral-400 uppercase font-normal">
                                Nhân viên
                            </th>
                            <th className="text-left p-4 text-[10px] tracking-widest text-neutral-400 uppercase font-normal">
                                Email
                            </th>
                            <th className="text-left p-4 text-[10px] tracking-widest text-neutral-400 uppercase font-normal">
                                Vai trò
                            </th>
                            <th className="text-left p-4 text-[10px] tracking-widest text-neutral-400 uppercase font-normal">
                                Ngày tạo
                            </th>
                            <th className="text-right p-4 text-[10px] tracking-widest text-neutral-400 uppercase font-normal">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b border-neutral-100 dark:border-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                user.name?.charAt(0) || 'U'
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold dark:text-white">{user.name}</p>
                                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">ID: {user.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-neutral-500 dark:text-neutral-400">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5" />
                                        {user.email}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-[9px] font-semibold tracking-widest uppercase ${roleColors[user.role]}`}>
                                        {roleLabels[user.role]}
                                    </span>
                                </td>
                                <td className="p-4 text-neutral-500 dark:text-neutral-400 text-[10px]">
                                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
                                            title="Sửa"
                                        >
                                            <Edit className="w-4 h-4 text-neutral-400" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                                            title="Xóa"
                                        >
                                            <Trash2 className="w-4 h-4 text-rose-500" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                        <p className="text-neutral-400 uppercase tracking-wider text-xs">
                            {search ? 'Không tìm thấy nhân viên nào' : 'Chưa có nhân viên nào'}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-900 p-6 flex items-center justify-between">
                            <h3 className="text-sm font-semibold tracking-widest uppercase dark:text-white">
                                {editingUser ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
                            </h3>
                            <button
                                onClick={resetForm}
                                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Tên nhân viên *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nguyễn Văn A"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="example@dreamhome.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                />
                            </div>

                            {!editingUser && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                        Mật khẩu *
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                    />
                                </div>
                            )}

                            {editingUser && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                        Mật khẩu mới (để trống nếu không đổi)
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                    Vai trò
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'editor' | 'viewer' })}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 text-xs tracking-widest uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-white dark:text-white"
                                >
                                    <option value="admin">Quản trị viên</option>
                                    <option value="editor">Biên tập viên</option>
                                    <option value="viewer">Người xem</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 py-3 text-xs tracking-widest uppercase font-semibold transition-all"
                                >
                                    {editingUser ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white py-3 text-xs tracking-widest uppercase transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}