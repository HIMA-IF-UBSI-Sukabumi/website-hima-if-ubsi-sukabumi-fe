# Panduan Implementasi Frontend — Profil Publik / Talent HIMA IF

Dokumen ini berisi spesifikasi API dan panduan implementasi halaman **Direktori Talent** dan **Portofolio Publik Mahasiswa** di frontend.

---

## 1. Rekomendasi Route Frontend

Gunakan slug `profile_slug` yang dikembalikan oleh API (format: `{nim}_{nama_slug}`, contoh: `15250100_hilal_ramadhan`).

| Halaman | Rekomendasi URL Frontend | Endpoint Backend |
|---|---|---|
| Direktori / Pencarian Talent | `/talents` | `GET /api/talents` |
| Detail Portofolio Mahasiswa | `/talents/[identifier]` (contoh: `/talents/15250100_hilal_ramadhan`) | `GET /api/talents/{identifier}` |

> **Catatan:** Backend menerima `identifier` berupa `profile_slug` (`15250100_hilal_ramadhan`), NIM saja (`15250100`), format dash (`15250100-hilal`), maupun `UUID` user.
> Jika `identifier` di URL berbeda dengan `profile.profile_slug` yang dikembalikan API (mis. user mengakses `/talents/15250100`), frontend bisa melakukan *canonical replace/redirect* ke `/talents/${profile.profile_slug}` agar URL tetap rapi.

---

## 2. Spesifikasi API

Semua endpoint bersifat **publik** (tanpa token autentikasi) dengan rate limit `60 request/menit`.

### A. List / Direktori Talent

```http
GET /api/talents
```

#### Query Parameters
| Parameter | Tipe | Keterangan |
|---|---|---|
| `search` atau `q` | `string` | Cari berdasarkan nama, NIM, headline, bio, atau skills |
| `skill` | `string` | Filter exact skill (case-insensitive, mis. `?skill=Laravel`) |
| `per_page` | `int` | Jumlah item per halaman (default `15`, max `50`) |
| `cursor` | `string` | Cursor pagination dari response `next_cursor` |

#### Contoh Response (`200 OK`)
```json
{
  "data": [
    {
      "id": "01a20763-...",
      "nim": "15250100",
      "name": "Hilal Ramadhan",
      "status": "aktif",
      "profile_slug": "15250100_hilal_ramadhan",
      "avatar": "users/profiles/avatar.jpg",
      "headline": "Informatics Student · Backend & Cloud Enthusiast",
      "skills": ["Laravel", "PostgreSQL", "Docker"],
      "social_links": {
        "instagram": "https://instagram.com/hilal",
        "linkedin": "https://linkedin.com/in/hilal",
        "github": "https://github.com/hilal"
      },
      "current_organization": {
        "kabinet": "Kabinet Sinergi",
        "departemen": "Kominfo",
        "jabatan": "Kepala Divisi"
      },
      "stats": {
        "projects_count": 3,
        "achievements_count": 2,
        "certificates_count": 5
      }
    }
  ],
  "path": "https://api.example.com/api/talents",
  "per_page": 15,
  "next_cursor": null,
  "next_page_url": null,
  "prev_cursor": null,
  "prev_page_url": null
}
```

---

### B. Detail Portofolio Talent

```http
GET /api/talents/{identifier}
```

#### Contoh Response (`200 OK`)
```json
{
  "profile": {
    "id": "01a20763-...",
    "nim": "15250100",
    "name": "Hilal Ramadhan",
    "status": "aktif",
    "profile_slug": "15250100_hilal_ramadhan",
    "avatar": "users/profiles/avatar.jpg",
    "headline": "Informatics Student · Backend & Cloud Enthusiast",
    "bio": "Mahasiswa Teknik Informatika yang fokus di pengembangan backend, API, dan DevOps.",
    "skills": ["Laravel", "PostgreSQL", "Docker"],
    "social_links": {
      "instagram": "https://instagram.com/hilal",
      "linkedin": "https://linkedin.com/in/hilal",
      "github": "https://github.com/hilal"
    }
  },
  "organization_history": [
    {
      "kabinet": "Kabinet Sinergi",
      "year": "2025/2026",
      "is_active": true,
      "departemen": "Kominfo",
      "jabatan": "Kepala Divisi",
      "is_leader": true
    }
  ],
  "projects": [
    {
      "id": "01a20763-...",
      "title": "Portal HIMA IF",
      "slug": "portal-hima-if",
      "description": "Platform informasi dan e-voting HIMA IF.",
      "project_url": "https://github.com/hima-if/portal",
      "cover_image": "projects/covers/portal.jpg",
      "role": "Backend Engineer",
      "is_author": true,
      "published_at": "2026-10-01T10:00:00.000000Z"
    }
  ],
  "achievements": [
    {
      "id": "01a20763-...",
      "title": "Juara 1 Hackathon Nasional",
      "slug": "juara-1-hackathon-nasional",
      "description": "...",
      "level": "nasional",
      "date_achieved": "2026-08-17",
      "cover_image": "achievements/covers/hack.jpg",
      "published_at": "2026-08-20T09:00:00.000000Z"
    }
  ],
  "certificates": [
    {
      "id": "01a20763-...",
      "certificate_number": "CERT/001/2026",
      "short_code": "01a207632938774f",
      "verify_url": "https://api.example.com/c/01a207632938774f",
      "issued_at": "2026-09-10T12:00:00.000000Z",
      "event": {
        "id": "01a20763-...",
        "title": "Seminar Cloud Native",
        "slug": "seminar-cloud-native"
      }
    }
  ],
  "committees": [
    {
      "id": "01a20763-...",
      "role": "Ketua Pelaksana",
      "event": {
        "id": "01a20763-...",
        "title": "IT Bootcamp 2026",
        "slug": "it-bootcamp-2026"
      }
    }
  ]
}
```

#### Response Error (`404 Not Found`)
Dikembalikan jika user tidak ditemukan atau `is_public_profile = false`:
```json
{
  "message": "Talent profile not found"
}
```

---

## 3. Tipe TypeScript (Siap Pakai)

```ts
export interface SocialLinks {
  instagram: string | null;
  linkedin: string | null;
  github: string | null;
}

export interface TalentListItem {
  id: string;
  nim: string;
  name: string;
  status: "aktif" | "alumni" | null;
  profile_slug: string;
  avatar: string | null;
  headline: string | null;
  skills: string[];
  social_links: SocialLinks;
  current_organization: {
    kabinet: string | null;
    departemen: string | null;
    jabatan: string | null;
  } | null;
  stats: {
    projects_count: number;
    achievements_count: number;
    certificates_count: number;
  };
}

export interface TalentDetailResponse {
  profile: {
    id: string;
    nim: string;
    name: string;
    status: "aktif" | "alumni" | null;
    profile_slug: string;
    avatar: string | null;
    headline: string | null;
    bio: string | null;
    skills: string[];
    social_links: SocialLinks;
  };
  organization_history: Array<{
    kabinet: string | null;
    year: string | null;
    is_active: boolean;
    departemen: string | null;
    jabatan: string | null;
    is_leader: boolean;
  }>;
  projects: Array<{
    id: string;
    title: string;
    slug: string | null;
    description: string | null;
    project_url: string | null;
    cover_image: string | null;
    role: string;
    is_author: boolean;
    published_at: string | null;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    slug: string | null;
    description: string | null;
    level: string | null;
    date_achieved: string | null;
    cover_image: string | null;
    published_at: string | null;
  }>;
  certificates: Array<{
    id: string;
    certificate_number: string;
    short_code: string;
    verify_url: string;
    issued_at: string | null;
    event: {
      id: string;
      title: string;
      slug: string | null;
    } | null;
  }>;
  committees: Array<{
    id: string;
    role: string | null;
    event: {
      id: string;
      title: string;
      slug: string | null;
    } | null;
  }>;
}
```

---

## 4. Rekomendasi UI/Layout di Frontend

### A. Halaman `/talents` (Direktori)
1. **Search Bar + Filter Skill**:
   - Input search (debounce 300ms) → kirim `?search=...`.
   - Chip/badge skill populer yang jika diklik memanggil `?skill=...`.
2. **Grid Card Talent**:
   - Avatar + badge status (`Aktif` / `Alumni`) + nama + NIM.
   - `headline` (truncate 2 baris).
   - `current_organization` (jika pengurus aktif, tampilkan badge jabatan).
   - Maksimal 3–4 pill `skills` (+ `+N` sisanya).
   - Mini counter di footer card: jumlah Project, Prestasi, Sertifikat.
   - Klik card mengarah ke `/talents/${item.profile_slug}`.
3. **Pagination**:
   - Tombol *"Muat lebih banyak"* menggunakan `next_cursor` (`?cursor=...`).

### B. Halaman `/talents/[identifier]` (Portofolio Detail)
1. **Header Card (Ala LinkedIn)**:
   - Foto profil (`avatar`), Nama lengkap, NIM, badge status (`Aktif`/`Alumni`).
   - `headline`, `bio`, tombol share link profil, dan icon link sosmed (`github`, `linkedin`, `instagram` — hanya tampilkan yang non-null).
   - Daftar pill `skills` (klik skill bisa arahkan ke `/talents?skill=...`).
2. **Tab / Section Konten** *(sembunyikan section/tab yang array-nya kosong, atau tampilkan empty state ringan)*:
   - **Projects**: Card dengan `cover_image`, `title`, badge `role` (`Author` / `Backend Engineer`, dll.), klik menuju `/projects/${project.slug}` atau link eksternal `project_url`.
   - **Achievements**: Timeline/card prestasi dengan `level`, `date_achieved`, `title`, klik menuju `/achievements/${achievement.slug}`.
   - **Certificates**: Daftar sertifikat terverifikasi dengan `certificate_number`, nama `event`, `issued_at`, dan tombol **"Verifikasi"** yang membuka `verify_url` (atau `/certificates/${cert.short_code}` jika sudah ada halaman verifikasi di frontend).
   - **Organisasi & Kepanitiaan**: Gabungkan `organization_history` (Kabinet, Departemen, Jabatan) dan `committees` (Peran kepanitiaan di Event).

---

## 5. Catatan Integrasi Aset & Deploy
- Path `avatar` dan `cover_image` mengikuti format path storage yang sama dengan endpoint `/api/projects` dan `/api/achievements` (prefix dengan base URL storage/CDN backend di frontend).
- Di backend, pastikan `php artisan migrate` sudah dijalankan sebelum menggunakan endpoint ini di local maupun production.
