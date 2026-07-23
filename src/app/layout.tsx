import type {Metadata} from "next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: "HIMA-IF UBSI PSDKU Sukabumi",
    description: "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id">
        <body
            className={`font-poppins antialiased`}
        >
        <Providers>
            <div className={'w-full min-h-screen'}>
                <NextTopLoader color={'#2C2F91'} showSpinner={false}/>
                {children}
            </div>
        </Providers>
        </body>
        </html>
    );
}
