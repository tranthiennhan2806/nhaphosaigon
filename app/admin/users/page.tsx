"use client";

import React, { useState } from 'react';
import { AdminUsers } from '@/components/admin/AdminUsers';

// Mock users data
const MOCK_USERS = [
    { id: '1', email: 'admin@dreamhome.com', name: 'Admin', role: 'admin' as const, createdAt: '2024-01-01' },
    { id: '2', email: 'editor@dreamhome.com', name: 'Editor', role: 'editor' as const, createdAt: '2024-01-02' },
    { id: '3', email: 'viewer@dreamhome.com', name: 'Viewer', role: 'viewer' as const, createdAt: '2024-01-03' },
];

export default function AdminUsersPage() {
    const [users, setUsers] = useState(MOCK_USERS);

    const handleAddUser = (newUser: { email: string; password: string; name: string; role: 'admin' | 'editor' | 'viewer' }) => {
        const user = {
            id: `user-${Date.now()}`,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            createdAt: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, user]);
    };

    const handleEditUser = (updatedUser: { id: string; email: string; name: string; role: 'admin' | 'editor' | 'viewer' }) => {
        setUsers(users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    };

    const handleDeleteUser = (id: string) => {
        setUsers(users.filter(u => u.id !== id));
    };

    return (
        <AdminUsers
            users={users}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
        />
    );
}