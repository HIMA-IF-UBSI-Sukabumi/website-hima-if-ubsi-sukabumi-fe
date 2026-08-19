import ModuleCertificateVerifyPage from '@/modules/certificates/pages/certificate-verify.page'
import { Metadata } from 'next'

type PageProps = {
    params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { code } = await params
    return {
        title: `Verifikasi Sertifikat (${code}) | HIMA-IF UBSI Sukabumi`,
        description: 'Halaman verifikasi keabsahan sertifikat resmi Himpunan Mahasiswa Informatika (HIMA-IF) UBSI PSDKU Sukabumi.',
        openGraph: {
            title: `Verifikasi Sertifikat (${code}) | HIMA-IF UBSI Sukabumi`,
            description: 'Verifikasi keabsahan sertifikat resmi HIMA-IF UBSI Sukabumi.',
        },
    }
}

export default async function VerifyPage({ params }: PageProps) {
    const { code } = await params
    return <ModuleCertificateVerifyPage code={code} />
}
