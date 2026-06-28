// src/app/(frontend)/layout.tsx
import Providers from '@/app/Providers';

export default function FrontendLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Providers>{children}</Providers>;
}