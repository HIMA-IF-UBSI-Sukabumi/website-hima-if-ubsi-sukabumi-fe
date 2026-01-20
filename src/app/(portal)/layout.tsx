import type {Metadata} from 'next';
import Navbar from "@/modules/portal/components/Navbar";
import Footer from "@/modules/portal/components/Footer";

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="flex min-h-screen flex-col">
                <Navbar/>

                <main className="flex-1">
                    {children}
                </main>

                <Footer/>
            </div>
        </>
    );
}
