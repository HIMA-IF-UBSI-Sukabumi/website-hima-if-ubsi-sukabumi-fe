type Team = {
    name: string;
    img: string;
    isLeader: boolean;
    division: string;
}

type Program = {
    name: string;
    description: string;
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
        description: 'Departemen Sinergi Publik adalah departemen yang bertanggung jawab dalam mengelola hubungan dan kerja sama dengan pihak eksternal serta menjaga citra positif organisasi di ruang publik. Departemen ini berperan sebagai penghubung utama antara kabinet dengan organisasi lain, instansi, perusahaan, maupun himpunan mahasiswa, serta mengembangkan peluang kolaborasi strategis seperti sponsorship, company visit, dan program kerja sama lainnya. Selain itu, departemen ini juga memastikan komunikasi eksternal berjalan efektif, menangani isu atau krisis hubungan publik, serta mendukung terlaksananya program pengabdian agar tepat sasaran dan berdampak luas.',
        logo: '/assets/department/sinergi_publik.svg',
        color: '#1A227F',
        team: [
            {
                name: 'Nabill Rafael',
                img: '/assets/pengurus/SP-Nabill.webp',
                isLeader: true,
                division: 'Kepala Departmen'
            },
            {
                name: 'M. Mulky Syaifani Lazuardy',
                img: '/assets/pengurus/SP-Mulky.webp',
                isLeader: false,
                division: 'Divisi Komunikasi Dan Relasi'
            },
            {
                name: 'Fathir Mananzil',
                img: '/assets/pengurus/SP-Fathir.webp',
                isLeader: false,
                division: 'Divisi Komunikasi Dan Relasi'
            },
            {
                name: 'Rangga Diandra Mahesa',
                img: '/assets/pengurus/SP-Rangga.webp',
                isLeader: false,
                division: 'Divisi Bhakti Sosial'
            },
            {
                name: 'Dhia Rizky Fadllurrahman',
                img: '/assets/pengurus/SP-Dhia.webp',
                isLeader: false,
                division: 'Divisi Bhakti Sosial'
            }
        ],
        programs: [
            {
                name: "Company Visit",
                description: "Kunjungan ke perusahaan teknologi atau industri terkait untuk menambah wawasan mahasiswa tentang dunia kerja dan praktik industri."
            },
            {
                name: "SANTAI (Safari Ngobrol Teknologi & Aspirasi Informatika)",
                description: "Forum diskusi santai untuk membahas teknologi, berbagi pengalaman, serta menampung aspirasi mahasiswa informatika."
            },
            {
                name: "Belajar Sambil Berdampak",
                description: "Program pembelajaran berbasis aksi nyata yang menggabungkan proses belajar dengan kontribusi langsung kepada masyarakat atau lingkungan."
            },
            {
                name: "HIMA-IF Got Talent (HGT)",
                description: "Ajang kompetisi bakat untuk mahasiswa informatika dalam bidang seni, teknologi, dan kreativitas."
            }
        ]
    },
    {
        title: 'Humanika',
        slug: 'humanika',
        description: 'Departemen Humanika adalah departemen yang bertanggung jawab dalam pengembangan kualitas sumber daya manusia di dalam kabinet, baik dari aspek karakter, etika, maupun pengembangan talenta anggota. Departemen ini berfokus pada pembentukan pribadi pengurus yang berintegritas, profesional, dan memiliki kompetensi yang unggul melalui pembinaan nilai-nilai organisasi serta peningkatan kemampuan individu. Selain itu, Humanika juga berperan dalam mengoordinasikan program pengembangan karakter dan talenta agar berjalan selaras, melakukan evaluasi terhadap perkembangan anggota, serta menjaga keharmonisan dan kualitas hubungan internal dalam kabinet.',
        logo: '/assets/department/humanika.svg',
        color: '#F97316',
        team: [
            {
                name: 'Fairuz Muhammad Rafa Firdaus',
                img: '/assets/pengurus/HM-Fairuz.webp',
                isLeader: true,
                division: 'Kepala Departmen'
            },
            {
                name: 'Yasmin Yusnita',
                img: '/assets/pengurus/HM-Yasmin.webp',
                isLeader: false,
                division: 'Divisi Garda Karakter'
            },
            {
                name: 'Mochamad Zaki',
                img: '/assets/pengurus/HM-Zaki.webp',
                isLeader: false,
                division: 'Divisi Garda Karakter'
            },
            {
                name: 'Muhammad Rizky Mulyadani',
                img: '/assets/pengurus/HM-Rizky.webp',
                isLeader: false,
                division: 'Divisi Bhakti Talenta'
            }
        ],
        programs: [
            {
                name: "Gathering Pengurus",
                description: "Kegiatan pertemuan internal pengurus untuk mempererat hubungan, evaluasi kinerja, dan koordinasi program kerja."
            },
            {
                name: "IKS (Informatika Keliling Sukabumi)",
                description: "Program pengabdian dan edukasi IT yang dilakukan keliling wilayah Sukabumi untuk memperkenalkan informatika ke masyarakat."
            },
            {
                name: "Triwulan",
                description: "Evaluasi rutin setiap tiga bulan untuk meninjau progres organisasi dan pencapaian program kerja."
            },
            {
                name: "Database Minat dan Bakat",
                description: "Pendataan minat dan bakat anggota untuk mempermudah pembagian divisi dan pengembangan potensi individu."
            },
            {
                name: "Anvaya Talks",
                description: "Forum diskusi dan sharing session dengan tema inspiratif seputar teknologi, organisasi, dan pengembangan diri."
            },
            {
                name: "Karnaval",
                description: "Kegiatan besar berupa perayaan atau pameran kreatif untuk memperkenalkan organisasi kepada publik."
            },
            {
                name: "Pemilu",
                description: "Proses pemilihan internal untuk menentukan kepengurusan atau jabatan organisasi secara demokratis."
            },
            {
                name: "Mubes",
                description: "Musyawarah besar sebagai forum tertinggi organisasi untuk evaluasi dan penetapan keputusan strategis."
            },
            {
                name: "Makrab dan LDKM",
                description: "Malam keakraban dan pelatihan dasar kepemimpinan untuk membangun solidaritas dan karakter anggota baru."
            },
            {
                name: "Riset Kurikulum",
                description: "Kegiatan penelitian dan pengembangan kurikulum untuk memastikan materi pembelajaran sesuai kebutuhan."
            },
            {
                name: "Pemaparan Kurikulum",
                description: "Presentasi dan sosialisasi kurikulum kepada anggota atau pihak terkait."
            },
            {
                name: "Open Recruitment",
                description: "Proses penerimaan anggota baru untuk bergabung dalam organisasi melalui seleksi terbuka."
            }
        ]
    },
    {
        title: 'Intelektual',
        slug: 'intelektual',
        description: 'Departemen Intelektual adalah departemen yang bertanggung jawab dalam mengembangkan wawasan, prestasi akademik, serta mendorong terciptanya inovasi di kalangan anggota kabinet. Departemen ini berperan sebagai pengarah utama dalam peningkatan kualitas intelektual melalui program edukasi, pengembangan keilmuan, serta fasilitasi ide-ide kreatif dan riset. Selain itu, Departemen Intelektual juga memastikan seluruh program kerja divisi di bawahnya berjalan selaras, melakukan supervisi dan evaluasi terhadap perkembangan kegiatan, serta menjadi penghubung pelaporan progres kepada pimpinan kabinet.',
        logo: '/assets/department/intelektual.svg',
        color: '#10B981',
        team: [
            {
                name: 'Dian',
                img: '/assets/pengurus/IT-Dian.webp',
                isLeader: true,
                division: 'Ketua Departmen'
            },
            {
                name: 'Muhamad Hilal',
                img: '/assets/pengurus/IT-Hilal.webp',
                isLeader: false,
                division: 'Divisi Sinergi Akademik'
            },
            {
                name: 'Riska Amelia',
                img: '/assets/pengurus/IT-Riska.webp',
                isLeader: false,
                division: 'Divisi Sinergi Akademik'
            },
            {
                name: 'Muhammad Rifaa Siraajuddin Sugandi',
                img: '/assets/pengurus/IT-Rifaa.webp',
                isLeader: false,
                division: 'Divisi Jaring Inovasi'
            },
            {
                name: 'Dhaniesya Naylasari',
                img: '/assets/pengurus/IT-Nayla.webp',
                isLeader: false,
                division: 'Divisi Jaring Inovasi'
            },
            {
                name: 'Muhammad Bijak Ad Daffa',
                img: '/assets/pengurus/IT-Bijak.webp',
                isLeader: false,
                division: 'Divisi Jaring Inovasi'
            }
        ],
        programs: [
            {
                name: "Code Survive",
                description: "Program pelatihan intensif untuk meningkatkan kemampuan coding dan problem solving melalui tantangan teknis berkelanjutan."
            },
            {
                name: "Project In",
                description: "Program pengembangan proyek berbasis tim yang berfokus pada implementasi ide menjadi produk nyata."
            },
            {
                name: "Tech Mastery",
                description: "Program peningkatan skill teknologi secara mendalam mulai dari fundamental hingga advanced untuk penguasaan bidang IT."
            },
            {
                name: "Expose",
                description: "Program publikasi dan showcase hasil karya, proyek, atau inovasi anggota kepada publik atau komunitas."
            }
        ]
    },
    {
        title: 'Smartlink',
        slug: 'smartlink',
        description: 'Departemen Smartlink adalah departemen yang bertanggung jawab dalam pengelolaan citra digital, penyebaran informasi, serta produksi konten kreatif kabinet di berbagai platform media. Departemen ini berperan sebagai penggerak utama branding digital dengan memastikan seluruh informasi yang disampaikan konsisten, profesional, dan menarik bagi publik. Selain itu, Smartlink juga menyusun strategi konten, mengelola alur produksi dari informasi hingga menjadi konten visual, serta mengikuti perkembangan tren digital untuk meningkatkan daya tarik dan jangkauan komunikasi kabinet.',
        logo: '/assets/department/smartlink.svg',
        color: '#A855F7',
        team: [
            {
                name: 'Syifa Syauqi Fauzani',
                img: '/assets/pengurus/SL-Syifa.webp',
                isLeader: true,
                division: 'Ketua Departmen'
            },
            {
                name: 'Ezra Paiq',
                img: '/assets/pengurus/SL-Ezra.webp',
                isLeader: false,
                division: 'Divisi Informedia'
            },
            {
                name: 'Muhammad Salman Alfarisy',
                img: '/assets/pengurus/SL-Salman.webp',
                isLeader: false,
                division: 'Divisi Informedia'
            },
            {
                name: 'Rifqi Maulana Ramdhan',
                img: '/assets/pengurus/SL-Rifqi.webp',
                isLeader: false,
                division: 'Divisi Content Craft'
            },
            {
                name: 'Danda Anugrah Er ZED',
                img: '/assets/pengurus/SL-Danda.webp',
                isLeader: false,
                division: 'Divisi Content Craft'
            }
        ],
        programs: [
            {
                name: "Publikasi Informasi dan Pengumuman",
                description: "Pengelolaan dan penyebaran informasi serta pengumuman resmi organisasi kepada mahasiswa secara cepat dan akurat."
            },
            {
                name: "Publikasi Kegiatan Visual",
                description: "Pembuatan dan publikasi dokumentasi visual seperti foto dan video dari setiap kegiatan organisasi."
            },
            {
                name: "Wadah Aspirasi Mahasiswa",
                description: "Sarana untuk menampung, mengelola, dan menyalurkan aspirasi mahasiswa terkait kampus maupun organisasi."
            },
            {
                name: "Content Craft",
                description: "Proses kreatif dalam pembuatan konten digital yang menarik, informatif, dan sesuai branding organisasi."
            },
            {
                name: "Konten Interaktif Mahasiswa",
                description: "Pembuatan konten yang mendorong partisipasi mahasiswa seperti polling, QnA, dan engagement media sosial."
            },
            {
                name: "Posting Flyer Hari Besar Bulan Tersebut",
                description: "Publikasi desain flyer untuk memperingati hari besar nasional atau internasional sesuai kalender bulanan."
            }
        ]
    }
]