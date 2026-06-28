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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = MOCK_USERS.find(
            u => u.email === email && u.password === password
        );

        if (user) {
            return NextResponse.json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token: 'mock_token_' + Date.now()
            });
        }

        return NextResponse.json(
            { success: false, message: 'Email hoặc mật khẩu không đúng' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Lỗi server' },
            { status: 500 }
        );
    }
}