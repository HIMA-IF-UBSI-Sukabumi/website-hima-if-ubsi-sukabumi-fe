import type {Metadata} from "next";
import "./globals.css";

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
            {children}
        </div>
        </body>
        </html>
    );
}
