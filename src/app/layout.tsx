import type {Metadata} from "next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
    title: "HIMA-IF UBSI PSDKU Sukabumi",
    description: "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`font-poppins antialiased`}
        >
        <div className={'w-full min-h-screen'}>
            <NextTopLoader color={'#2C2F91'} showSpinner={false}/>
            {children}
        </div>
        </body>
        </html>
    );
}
