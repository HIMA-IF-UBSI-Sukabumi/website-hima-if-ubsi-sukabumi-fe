import type {Metadata} from "next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
    metadataBase: (() => {
        try {
            const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://himaifubsismi.or.id';
            const formattedUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') ? rawUrl : `http://${rawUrl}`;
            return new URL(formattedUrl);
        } catch {
            return new URL('https://himaifubsismi.or.id');
        }
    })(),
    title: {
        default: "HIMA-IF UBSI PSDKU Sukabumi",
        template: "%s | HIMA-IF UBSI PSDKU Sukabumi",
    },
    description: "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi. Temukan informasi seputar kegiatan, departemen, berita, dan organisasi mahasiswa informatika.",
    keywords: [
        "HIMA-IF",
        "Himpunan Mahasiswa Informatika",
        "UBSI Sukabumi",
        "PSDKU Sukabumi",
        "Universitas Bina Sarana Informatika",
        "mahasiswa informatika",
        "organisasi mahasiswa",
        "Sukabumi",
    ],
    authors: [{ name: "HIMA-IF UBSI PSDKU Sukabumi", url: "https://himaifubsismi.or.id" }],
    creator: "HIMA-IF UBSI PSDKU Sukabumi",
    publisher: "HIMA-IF UBSI PSDKU Sukabumi",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "id_ID",
        url: "https://himaifubsismi.or.id",
        siteName: "HIMA-IF UBSI PSDKU Sukabumi",
        title: "HIMA-IF UBSI PSDKU Sukabumi",
        description: "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi.",
    },
    twitter: {
        card: "summary_large_image",
        title: "HIMA-IF UBSI PSDKU Sukabumi",
        description: "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi.",
        site: "@himaifubsismi",
        creator: "@himaifubsismi",
    },
    alternates: {
        canonical: "https://himaifubsismi.or.id",
    },
};


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" suppressHydrationWarning>
        <head>
            <script
                dangerouslySetInnerHTML={{
                    __html: `(function(){try{var t=localStorage.getItem('himaif-theme');var s=t==='system'||!t;var dark=t==='dark'||(s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(dark)document.documentElement.classList.add('dark');}catch(e){}})();`,
                }}
            />
        </head>
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
