import ModuleCertificateVerifyPage from '@/modules/certificates/pages/certificate-verify.page'
import { Metadata } from 'next'

type PageProps = {
    params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { code } = await params
    return {
        title: `Sertifikat ${code} | HIMA-IF UBSI Sukabumi`,
        description: 'Halaman rincian dan verifikasi sertifikat resmi Himpunan Mahasiswa Informatika (HIMA-IF) UBSI PSDKU Sukabumi.',
    }
}

export default async function CertificatePage({ params }: PageProps) {
    const { code } = await params
    return <ModuleCertificateVerifyPage code={code} />
}
