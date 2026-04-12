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
                name: 'Gladisya Harumi Negeri',
                img: '/assets/dummy-bph.png',
                isLeader: true,
                division: 'Ketua Departmen'
            },
            {
                name: 'Gladisya Harumi Negeri',
                img: '/assets/dummy-bph.png',
                isLeader: false,
                division: 'Divisi 1'
            },
            {
                name: 'Gladisya Harumi Negeri',
                img: '/assets/dummy-bph.png',
                isLeader: false,
                division: 'Divisi 1'
            },
            {
                name: 'Gladisya Harumi Negeri',
                img: '/assets/dummy-bph.png',
                isLeader: false,
                division: 'Divisi 1'
            },
            {
                name: 'Gladisya Harumi Negeri',
                img: '/assets/dummy-bph.png',
                isLeader: false,
                division: 'Divisi 2'
            },
            {
                name: 'Gladisya Harumi Negeri',
                img: '/assets/dummy-bph.png',
                isLeader: false,
                division: 'Divisi 2'
            },
            {
                name: 'Gladisya Harumi Negeri',
                img: '/assets/dummy-bph.png',
                isLeader: false,
                division: 'Divisi 2'
            },
        ]
    },
    {
        title: 'Humanika',
        slug: 'humanika',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod nisi nulla, sed condimentum nulla laoreet at. Nunc vestibulum posuere felis a pulvinar.',
        logo: '/assets/department/humanika.svg',
        color: '#F97316'
    },
    {
        title: 'Intelektual',
        slug: 'intelektual',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod nisi nulla, sed condimentum nulla laoreet at. Nunc vestibulum posuere felis a pulvinar.',
        logo: '/assets/department/intelektual.svg',
        color: '#10B981'
    },
    {
        title: 'Smartlink',
        slug: 'smartlink',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod nisi nulla, sed condimentum nulla laoreet at. Nunc vestibulum posuere felis a pulvinar.',
        logo: '/assets/department/smartlink.svg',
        color: '#A855F7'
    }
]