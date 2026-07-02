// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
    // Lấy token từ header hoặc cookie
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    // Hoặc từ cookie
    // const token = request.cookies.get('admin_token')?.value;

    if (!token) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    // Trong thực tế, bạn sẽ verify JWT token và lấy user từ database
    // Giả lập: tìm user từ token (trong thực tế là decode JWT)
    const user = MOCK_USERS.find(u => u.id === '1'); // Giả lập

    if (!user) {
        return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
        );
    }

    // ✅ Trả về thông tin user từ SERVER (đáng tin cậy)
    return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role // ✅ Role từ server
    });
}