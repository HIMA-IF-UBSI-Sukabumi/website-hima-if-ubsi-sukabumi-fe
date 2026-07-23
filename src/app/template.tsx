// Template ini sengaja dibuat minimal.
// QueryClientProvider sudah dihandle di layout.tsx via <Providers>.
// Jangan tambahkan 'use client' di sini agar tidak memblokir metadata SSR.

export default function RootTemplate({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>
}