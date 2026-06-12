type Team = {
    name: string;
    img: string;
    isLeader: boolean;
    division: string;
}

type Program = {
    name: string;
}

export type DepartmentDataProps = {
    title: string;
    description: string;
    logo: string;
    color: string;
    slug: string;
    team?: Team[];
    programs?: Program[];
}

export const DEPARTMENT_DATA: DepartmentDataProps[] = [
    {
        title: 'Sinergi Publik',
        slug: 'sinergi-publik',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod nisi nulla, sed condimentum nulla laoreet at. Nunc vestibulum posuere felis a pulvinar.',
        logo: '/assets/department/sinergi_publik.svg',
        color: '#1A227F',
        team: [
            {
                name: 'Nabill Rafael',
                img: '/assets/pengurus/15240351-nabill-rafael.jpg',
                isLeader: true,
                division: 'Kepala Departmen'
            },
            {
                name: 'M. Mulky Syaifani Lazuardy',
                img: '/assets/pengurus/15251182-m-mulky-syaifani-lazuardy.png',
                isLeader: false,
                division: 'Divisi Komunikasi Dan Relasi'
            },
            {
                name: 'Fathir Mananzil',
                img: '/assets/pengurus/15251165-fathir-mananzil.png',
                isLeader: false,
                division: 'Divisi Komunikasi Dan Relasi'
            },
            {
                name: 'Rangga Diandra Mahesa',
                img: '/assets/pengurus/15250200-rangga-diandra-mahesa.jpg',
                isLeader: false,
                division: 'Divisi Bhakti Sosial'
            },
            {
                name: 'Dhia Rizky Fadllurrahman',
                img: '/assets/pengurus/15251168-dhia-rizky-fadlurahman.jpg',
                isLeader: false,
                division: 'Divisi Bhakti Sosial'
            }
        ]
    },
    {
        title: 'Humanika',
        slug: 'humanika',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod nisi nulla, sed condimentum nulla laoreet at. Nunc vestibulum posuere felis a pulvinar.',
        logo: '/assets/department/humanika.svg',
        color: '#F97316',
        team: [
            {
                name: 'Ridho Darmawan',
                img: '/assets/pengurus/15240216-ridho-darmawan.png',
                isLeader: true,
                division: 'Ketua Departmen'
            },
            {
                name: 'Yasmin Yusnita',
                img: '/assets/pengurus/15250886-yasmin-yusnita.png',
                isLeader: false,
                division: 'Divisi Garda Karakter'
            },
            {
                name: 'Mochamad Zaki',
                img: '/assets/pengurus/15241111-mochamad-zaki.png',
                isLeader: false,
                division: 'Divisi Garda Karakter'
            },
            {
                name: 'Yeri Yudistiar',
                img: '/assets/pengurus/15240182-yeri-yudistiar.jpg',
                isLeader: false,
                division: 'Divisi Garda Karakter'
            },
            {
                name: 'Fairuz Muhammad Rafa Firdaus',
                img: '/assets/pengurus/15250051-fairuz-muhammad-raffa-firdaus.png',
                isLeader: false,
                division: 'Divisi Bhakti Talenta'
            },
            {
                name: 'Muhammad Rizky Mulyadani',
                img: '/assets/pengurus/15250131-muhammad-rizky-mulyadani.jpg',
                isLeader: false,
                division: 'Divisi Bhakti Talenta'
            }
        ]
    },
    {
        title: 'Intelektual',
        slug: 'intelektual',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod nisi nulla, sed condimentum nulla laoreet at. Nunc vestibulum posuere felis a pulvinar.',
        logo: '/assets/department/intelektual.svg',
        color: '#10B981',
        team: [
            {
                name: 'Dian',
                img: '/assets/pengurus/15241110-dian.jpeg',
                isLeader: true,
                division: 'Ketua Departmen'
            },
            {
                name: 'Muhamad Hilal',
                img: '/assets/pengurus/15250100-muhamad-hilal.jpg',
                isLeader: false,
                division: 'Divisi Sinergi Akademik'
            },
            {
                name: 'Riska Amelia',
                img: '/assets/pengurus/15251218-riska-amelia.jpg',
                isLeader: false,
                division: 'Divisi Sinergi Akademik'
            },
            {
                name: 'Muhammad Rifaa Siraajuddin Sugandi',
                img: '/assets/pengurus/15250106-muhammad-rifaa-siraajuddin-sugandi.jpg',
                isLeader: false,
                division: 'Divisi Jaring Inovasi'
            },
            {
                name: 'Dhaniesya Naylasari',
                img: '/assets/pengurus/15251154-dhaniesya-naylasari.jpg',
                isLeader: false,
                division: 'Divisi Jaring Inovasi'
            },
            {
                name: 'Muhammad Bijak Ad Daffa',
                img: '/assets/pengurus/15250270-muhammad-bijak-ad-daffa.png',
                isLeader: false,
                division: 'Divisi Jaring Inovasi'
            }
        ]
    },
    {
        title: 'Smartlink',
        slug: 'smartlink',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod nisi nulla, sed condimentum nulla laoreet at. Nunc vestibulum posuere felis a pulvinar.',
        logo: '/assets/department/smartlink.svg',
        color: '#A855F7',
        team: [
            {
                name: 'Syifa Syauqi Fauzani',
                img: '/assets/pengurus/15250107-syifa-syauqi-fauzani.png',
                isLeader: true,
                division: 'Ketua Departmen'
            },
            {
                name: 'Ezra Paiq',
                img: '/assets/pengurus/15250144-ezra-paiq.jpg',
                isLeader: false,
                division: 'Divisi Informedia'
            },
            {
                name: 'Muhammad Salman Alfarisy',
                img: '/assets/pengurus/15250320-muhamad-salman-alfarisy.jpg',
                isLeader: false,
                division: 'Divisi Informedia'
            },
            {
                name: 'Rifqi Maulana Ramdhan',
                img: '/assets/pengurus/15250756-rifqi-maulana-ramdhan.jpg',
                isLeader: false,
                division: 'Divisi Content Craft'
            },
            {
                name: 'Danda Anugrah Er ZED',
                img: '/assets/pengurus/15251128-danda-anugrah-er-zed.jpg',
                isLeader: false,
                division: 'Divisi Content Craft'
            }
        ]
    }
]