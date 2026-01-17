import Navbar from "@/modules/portal/components/Navbar";

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar/>
            <main>
                {children}
            </main>
        </>
    );
}
