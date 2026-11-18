# Frontend Integration Guide: Projects API (Updated)

Dokumentasi ini merangkum pembaruan pada endpoint **Projects API** (`GET /api/projects` dan `GET /api/projects/{slug}`) berdasarkan [ProjectController.php](file:///Volumes/Macintosh%20HD%20-%20Data/Development/HIMAIF/website-hima-if-ubsi-sukabumi-be/app/Http/Controllers/Api/ProjectController.php).

---

## Ringkasan Perubahan Response

1. **`author` kini menyertakan `prodi`, `profile_picture`, dan `social_media`:**
   - `prodi`: selalu `"Informatika"` (karena author terdaftar di sistem)
   - `profile_picture`: relative path (contoh: `"users/profiles/abc.jpg"`) atau `null` — gabungkan dengan `${API_URL}/storage/`
   - `social_media`: object `{ instagram: string | null, linkedin: string | null, github: string | null }` (diisi dari Pengaturan Akun user)
2. **Field baru `contributors` (array):**
   - Mendukung **2 tipe kontributor**:
     - `type: "internal"` — Mahasiswa Informatika yang terdaftar di sistem (`user_id` terisi, `nim` terisi, `prodi: "Informatika"`, `profile_picture` bisa berisi path atau `null`)
     - `type: "external"` — Kolaborator eksternal/non-IF (`user_id: null`, `nim: null`, `prodi` opsional/nullable, `profile_picture: null`)
   - Urutan sudah disesuaikan dengan `sort_order` dari admin panel.
3. **Optimasi Gambar Project (`cover_image`, `carousel_images`, `gallery_images`):**
   - Gambar baru otomatis dikompresi ke `.webp` (atau `.jpg` di environment lokal tanpa `libwebp`) dan tetap mengembalikan **relative path** (contoh: `"projects/covers/<uuid>.webp"`), sehingga logic `${API_URL}/storage/${path}` di frontend tetap sama.

---

## 1. List Projects

`GET /api/projects`

- **Auth:** Public
- **Query Params:**
  - `search` atau `q` (optional): Pencarian pada `title` dan `description`
  - `author_id` (optional): Filter berdasarkan UUID author
  - `per_page` (optional, default `15`, maksimal `50`)
  - `cursor` (optional): Cursor pagination

**Success Response (`200 OK`):**
```json
{
  "data": [
    {
      "id": "uuid-project",
      "title": "Sistem Informasi HIMAIF",
      "description": "<p>Portal resmi HIMAIF...</p>",
      "project_url": "https://himaif.example.com",
      "published_at": "2026-11-18T10:00:00.000000Z",
      "status": "published",
      "slug": "sistem-informasi-himaif",
      "cover_image": "projects/covers/01a1ee15-xxxx.webp",
      "author": {
        "id": "uuid-author",
        "name": "Andi Pratama",
        "prodi": "Informatika",
        "profile_picture": "users/profiles/andi.jpg",
        "social_media": {
          "instagram": "https://instagram.com/andipratama",
          "linkedin": null,
          "github": "https://github.com/andipratama"
        }
      },
      "contributors": [
        {
          "type": "internal",
          "user_id": "uuid-user",
          "name": "Budi Santoso",
          "nim": "12240002",
          "prodi": "Informatika",
          "profile_picture": "users/profiles/budi.jpg",
          "role": "Backend Developer",
          "profile_url": null,
          "social_media": {
            "instagram": null,
            "linkedin": "https://linkedin.com/in/budisantoso",
            "github": "https://github.com/budisantoso"
          }
        },
        {
          "type": "external",
          "user_id": null,
          "name": "Siti Aminah",
          "nim": null,
          "prodi": "Sistem Informasi",
          "profile_picture": null,
          "role": "UI/UX Designer",
          "profile_url": "https://github.com/sitiaminah",
          "social_media": null
        }
      ],
      "created_at": "2026-11-18T09:00:00.000000Z",
      "updated_at": "2026-11-18T10:00:00.000000Z"
    }
  ],
  "path": "https://api.example.com/api/projects",
  "per_page": 15,
  "next_cursor": null,
  "next_page_url": null,
  "prev_cursor": null,
  "prev_page_url": null
}
```

---

## 2. Project Detail

`GET /api/projects/{slug}`

- **Auth:** Public
- **Path Param:** `slug` (mendukung slug aktif, slug lama/riwayat, maupun fallback UUID project)

**Success Response (`200 OK`):**
```json
{
  "project": {
    "id": "uuid-project",
    "title": "Sistem Informasi HIMAIF",
    "description": "<p>Portal resmi HIMAIF...</p>",
    "project_url": "https://himaif.example.com",
    "published_at": "2026-11-18T10:00:00.000000Z",
    "status": "published",
    "slug": "sistem-informasi-himaif",
    "cover_image": "projects/covers/01a1ee15-xxxx.webp",
    "carousel_images": {
      "1": "projects/carousel/01a1ee15-1.webp",
      "2": "projects/carousel/01a1ee15-2.webp"
    },
    "gallery_images": {
      "1": "projects/gallery/01a1ee15-1.webp"
    },
    "author": {
      "id": "uuid-author",
      "name": "Andi Pratama",
      "prodi": "Informatika",
      "profile_picture": "users/profiles/andi.jpg",
      "social_media": {
        "instagram": "https://instagram.com/andipratama",
        "linkedin": null,
        "github": "https://github.com/andipratama"
      }
    },
    "contributors": [
      {
        "type": "internal",
        "user_id": "uuid-user",
        "name": "Budi Santoso",
        "nim": "12240002",
        "prodi": "Informatika",
        "profile_picture": "users/profiles/budi.jpg",
        "role": "Backend Developer",
        "profile_url": null,
        "social_media": {
          "instagram": null,
          "linkedin": "https://linkedin.com/in/budisantoso",
          "github": "https://github.com/budisantoso"
        }
      },
      {
        "type": "external",
        "user_id": null,
        "name": "Siti Aminah",
        "nim": null,
        "prodi": "Sistem Informasi",
        "profile_picture": null,
        "role": "UI/UX Designer",
        "profile_url": "https://github.com/sitiaminah",
        "social_media": null
      }
    ],
    "created_at": "2026-11-18T09:00:00.000000Z",
    "updated_at": "2026-11-18T10:00:00.000000Z",
    "other_projects": [
      {
        "id": "uuid-other",
        "title": "Project Lainnya",
        "slug": "project-lainnya",
        "project_url": "https://other.example.com",
        "published_at": "2026-11-10T08:00:00.000000Z",
        "cover_image": "projects/covers/other.webp"
      }
    ]
  }
}
```

**Error Response (`404 Not Found`):**
```json
{
  "message": "Project not found"
}
```

---

## TypeScript Interfaces (Siap Pakai di Frontend)

```ts
export interface SocialMediaLinks {
  instagram: string | null;
  linkedin: string | null;
  github: string | null;
}

export interface ProjectAuthor {
  id: string;
  name: string;
  prodi: string; // "Informatika"
  profile_picture: string | null;
  social_media: SocialMediaLinks;
}

export interface ProjectContributor {
  type: 'internal' | 'external';
  user_id: string | null;
  name: string;
  nim: string | null;
  prodi: string | null; // Selalu "Informatika" untuk internal, opsional untuk external
  profile_picture: string | null; // null untuk external atau jika belum upload foto
  role: string | null;
  profile_url: string | null; // Untuk external contributor
  social_media: SocialMediaLinks | null; // Terisi untuk internal contributor, null untuk external
}

export interface ProjectSummary {
  id: string;
  title: string;
  description: string | null;
  project_url: string;
  published_at: string | null;
  status: 'published';
  slug: string | null;
  cover_image: string | null;
  author: ProjectAuthor | null;
  contributors: ProjectContributor[];
  created_at: string;
  updated_at: string;
}

export interface ProjectDetail extends ProjectSummary {
  carousel_images: Record<string, string>;
  gallery_images: Record<string, string>;
  other_projects: Array<{
    id: string;
    title: string;
    slug: string | null;
    project_url: string;
    published_at: string | null;
    cover_image: string | null;
  }>;
}
```

---

## Catatan Implementasi UI Frontend

1. **Helper URL Gambar:**
   Semua path gambar (`cover_image`, `carousel_images`, `gallery_images`, `author.profile_picture`, `contributors[i].profile_picture`) masih berupa path relatif terhadap `/storage/`. Gunakan helper:
   ```ts
   export const storageUrl = (path: string | null) =>
     path ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${path}` : null;
   ```
2. **Menampilkan Avatar Author & Contributors:**
   - Jika `profile_picture === null` (mis. kolaborator eksternal atau mahasiswa belum upload foto), tampilkan avatar inisial dari `name`.
   - Jika `prodi` bernilai `null` pada kontributor eksternal, sembunyikan badge/label prodi (jangan tampilkan teks kosong).
3. **Link Profil Kontributor:**
   - Jika `profile_url` tidak `null`, jadikan nama/kartu kontributor bisa diklik menuju `profile_url` (`target="_blank" rel="noopener noreferrer"`).
4. **Carousel & Gallery:**
   - `carousel_images` dan `gallery_images` berbentuk object keyed by `sort_order` (`{ "1": "...", "2": "..." }`). Gunakan `Object.values(project.carousel_images)` untuk render array berurutan.

---

## 3. Endpoint Lain yang Menyertakan `social_media`

Selain endpoint Projects, field `social_media` (`{ instagram, linkedin, github }`) juga ditambahkan pada endpoint lain yang mengembalikan data user/pengurus:

### `GET /api/bph`
```json
[
  {
    "id": "uuid-pengurus",
    "title": "Ketua Umum",
    "name": "Andi Pratama",
    "image": "users/profiles/andi.jpg",
    "social_media": {
      "instagram": "https://instagram.com/andipratama",
      "linkedin": "https://linkedin.com/in/andipratama",
      "github": null
    }
  }
]
```

### `GET /api/departemens` & `GET /api/departemens/{slug}`
Setiap item pada array `team` kini menyertakan `social_media`:
```json
{
  "team": [
    {
      "name": "Budi Santoso",
      "img": "users/profiles/budi.jpg",
      "isLeader": true,
      "division": "Kepala Departemen Kominfo",
      "social_media": {
        "instagram": "https://instagram.com/budisantoso",
        "linkedin": null,
        "github": "https://github.com/budisantoso"
      }
    }
  ]
}
```

### `POST /api/auth/sso/exchange`
Objek `user` kini menyertakan `profile_picture` dan `social_media`:
```json
{
  "user": {
    "id": "uuid-user",
    "name": "Budi Santoso",
    "nim": "12240002",
    "status": "aktif",
    "roles": ["mahasiswa"],
    "profile_picture": "users/profiles/budi.jpg",
    "social_media": {
      "instagram": null,
      "linkedin": "https://linkedin.com/in/budisantoso",
      "github": "https://github.com/budisantoso"
    }
  }
}
```

### `GET /api/auth/me`
Mengembalikan objek model `User` langsung, sehingga otomatis menyertakan kolom `instagram_url`, `linkedin_url`, dan `github_url` (bernilai `string | null`).
