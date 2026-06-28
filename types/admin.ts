import { Property } from './index';

export interface User {
    id: string;
    email: string;
    password: string; // Hashed
    name: string;
    role: 'admin' | 'editor' | 'viewer';
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdminState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AdminProperty extends Property {
    createdAt: string;
    updatedAt: string;
    createdBy: string; // User ID
    updatedBy: string; // User ID
    status: 'draft' | 'published' | 'archived';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
}