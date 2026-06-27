import ModuleNewsListPage from '@/modules/news/pages/news-list.page'
import {Metadata} from 'next'

export const metadata: Metadata = {
    title: 'HIMA-IF News – Portal Berita Resmi HIMA-IF UBSI PSDKU Sukabumi',
    description: 'Berita terkini seputar akademik, kegiatan, dan prestasi Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.',
}

const NewsHubPage = () => {
    return <ModuleNewsListPage/>
}

export default NewsHubPage
