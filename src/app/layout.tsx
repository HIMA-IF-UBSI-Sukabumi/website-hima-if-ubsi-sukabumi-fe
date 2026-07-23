import type {Metadata} from "next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
    metadataBase: (() => {
        try {
            return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://himaifubsismi.or.id')
        } catch {
            return new URL('https://himaifubsismi.or.id')
        }
    })(),
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
