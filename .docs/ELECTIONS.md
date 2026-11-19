# Elections API Documentation

Dokumentasi ini merangkum fitur **Elections (Pemilu)** dari backend untuk kebutuhan integrasi frontend.

## Ringkasan Arsitektur

Sistem pemilu menggunakan mekanisme **Secret Ballot (Suara Rahasia)**:
- **Eligibilitas (`election_eligibilities`)**: Menentukan user mana saja yang berhak memilih pada suatu pemilu.
- **Partisipasi (`voter_participations`)**: Hanya mencatat *siapa* yang sudah memilih dan kapan (`voted_at`), tanpa menyimpan pilihan kandidatnya.
- **Surat Suara (`ballots`)**: Hanya menyimpan `election_id` dan `candidate_id` secara anonim (tidak ada kolom `user_id`), dengan `created_at` diset ke waktu mulai pemilu agar urutan waktu tidak dapat dikorelasikan dengan waktu voting user.
- Pemilu berstatus `draft` **tidak pernah** diekspos ke API publik (mengembalikan `404`).

---

## Autentikasi

Endpoint publik dapat diakses tanpa token. Endpoint terkait status pemilih dan voting menggunakan **Laravel Sanctum Bearer Token**:

```http
Authorization: Bearer <token>
Accept: application/json
```

Token diperoleh dari endpoint login:
- `POST /api/auth/login` dengan body `{ "nim": "...", "password": "..." }` → mengembalikan `{ "token": "...", "user": { "id", "name", "nim" } }`.

---

## Enum & Nilai Status

### `status`
- `draft` — Belum dipublikasikan (tidak muncul di API).
- `active` — Pemilu aktif (voting terbuka jika waktu sekarang berada di antara `starts_at` dan `ends_at`).
- `closed` — Pemilu telah ditutup.

### `result_visibility`
- `hidden` — Hasil tidak pernah ditampilkan ke publik.
- `after_closed` — Hasil baru bisa diakses setelah `status === "closed"`.
- `scheduled` — Hasil baru bisa diakses jika waktu sekarang `>= show_results_at`.

### `voter_status.reason`
- `null` — User boleh memilih (`can_vote: true`).
- `"not_eligible"` — User tidak terdaftar sebagai pemilih pada pemilu ini.
- `"already_voted"` — User sudah pernah memberikan suara.
- `"not_active"` — Status pemilu bukan `active`.
- `"not_started"` — Waktu sekarang masih sebelum `starts_at`.
- `"ended"` — Waktu sekarang sudah melewati `ends_at`.

---

## Daftar Endpoint

| Method | Endpoint | Auth | Rate Limit | Deskripsi |
| --- | --- | --- | --- | --- |
| `GET` | `/api/elections` | Public | `60/menit` | Daftar pemilu (selain `draft`), cursor paginated |
| `GET` | `/api/elections/{slug}` | Public | `60/menit` | Detail pemilu beserta daftar kandidat |
| `GET` | `/api/elections/{slug}/results` | Public | `60/menit` | Hasil agregat suara per kandidat |
| `GET` | `/api/me/elections` | Sanctum | `60/menit` | Daftar pemilu yang eligible untuk user login |
| `GET` | `/api/elections/{slug}/my-status` | Sanctum | - | Status eligibilitas & partisipasi user pada pemilu |
| `POST` | `/api/elections/{slug}/vote` | Sanctum | `10/menit` | Mengirimkan suara untuk kandidat |

---

## Detail Endpoint

### 1. Daftar Pemilu (Publik)

`GET /api/elections`

**Query Parameters (Opsional):**
- `status`: Filter berdasarkan status (`active` atau `closed`).
- `cursor`: Cursor pagination untuk halaman berikutnya.

**Response `200 OK` (Cursor Paginated, 15 item/halaman):**
```json
{
  "data": [
    {
      "id": "01a1e776-62f6-7d70-b20e-821efe3e9f2b",
      "title": "Pemilihan jamal",
      "slug": "pemilihan-jamal",
      "description": "a;sfkajsd;fkdljsa;kldf",
      "status": "active",
      "starts_at": "2026-11-17T03:04:00.000000Z",
      "ends_at": "2026-11-30T03:04:00.000000Z",
      "result_visibility": "hidden",
      "show_results_at": null,
      "is_voting_open": true,
      "can_show_results": false,
      "candidates_count": 2,
      "participations_count": 0,
      "created_at": "2026-11-17T03:04:17.000000Z",
      "updated_at": "2026-11-17T03:13:37.000000Z"
    }
  ],
  "path": "http://localhost:8080/api/elections",
  "per_page": 15,
  "next_cursor": null,
  "next_page_url": null,
  "prev_cursor": null,
  "prev_page_url": null
}
```

---

### 2. Detail Pemilu & Kandidat (Publik)

`GET /api/elections/{slug}`

Mengembalikan detail pemilu beserta daftar kandidat yang diurutkan berdasarkan `number` (nomor urut).

**Response `200 OK`:**
```json
{
  "election": {
    "id": "01a1e776-62f6-7d70-b20e-821efe3e9f2b",
    "title": "Pemilihan jamal",
    "slug": "pemilihan-jamal",
    "description": "a;sfkajsd;fkdljsa;kldf",
    "status": "active",
    "starts_at": "2026-11-17T03:04:00.000000Z",
    "ends_at": "2026-11-30T03:04:00.000000Z",
    "result_visibility": "hidden",
    "show_results_at": null,
    "is_voting_open": true,
    "can_show_results": false,
    "candidates_count": 2,
    "participations_count": 0,
    "created_at": "2026-11-17T03:04:17.000000Z",
    "updated_at": "2026-11-17T03:13:37.000000Z",
    "candidates": [
      {
        "id": "01a1e77b-9aec-7f89-a233-fd225e43007c",
        "name": "asdfasdf",
        "number": 1,
        "photo": "elections/candidates/Nmu7htw2AU3KH2vTV7IPJ0cu0vZLroB06xiVZcWh.jpg",
        "photo_url": "http://localhost:8080/storage/elections/candidates/Nmu7htw2AU3KH2vTV7IPJ0cu0vZLroB06xiVZcWh.jpg",
        "vision_mission": "<ol start=\"1\"><li><p>nadhif</p></li><li><p>jamala</p></li></ol>"
      },
      {
        "id": "01a1e785-9607-7a8f-882a-7a1ac2a8e748",
        "name": "nadih2",
        "number": 2,
        "photo": "elections/candidates/GfOn0d5cSqN3XozfadusrjPKcmdf8yHzVYqZHCQK.jpg",
        "photo_url": "http://localhost:8080/storage/elections/candidates/GfOn0d5cSqN3XozfadusrjPKcmdf8yHzVYqZHCQK.jpg",
        "vision_mission": "<p>adfasdf</p>"
      }
    ]
  }
}
```

> **Catatan Frontend:**
> - `vision_mission` berisi HTML dari RichEditor (sanitasi sebelum render jika diperlukan).
> - `photo_url` sudah berbentuk URL lengkap (bernilai `null` jika kandidat tidak memiliki foto).

**Error:**
- `404 Not Found` jika `slug` tidak ditemukan atau status pemilu masih `draft`.

---

### 3. Hasil Pemilu (Publik, sesuai `result_visibility`)

`GET /api/elections/{slug}/results`

Hanya dapat diakses jika `can_show_results === true`.

**Response `200 OK`:**
```json
{
  "election": {
    "id": "01a1e776-62f6-7d70-b20e-821efe3e9f2b",
    "title": "Pemilihan jamal",
    "slug": "pemilihan-jamal",
    "description": "a;sfkajsd;fkdljsa;kldf",
    "status": "closed",
    "starts_at": "2026-11-17T03:04:00.000000Z",
    "ends_at": "2026-11-30T03:04:00.000000Z",
    "result_visibility": "after_closed",
    "show_results_at": null,
    "is_voting_open": false,
    "can_show_results": true,
    "candidates_count": 2,
    "participations_count": 45,
    "created_at": "2026-11-17T03:04:17.000000Z",
    "updated_at": "2026-11-17T03:13:37.000000Z"
  },
  "results": [
    {
      "candidate_id": "01a1e77b-9aec-7f89-a233-fd225e43007c",
      "name": "asdfasdf",
      "number": 1,
      "photo": "elections/candidates/Nmu7htw2AU3KH2vTV7IPJ0cu0vZLroB06xiVZcWh.jpg",
      "votes": 30
    },
    {
      "candidate_id": "01a1e785-9607-7a8f-882a-7a1ac2a8e748",
      "name": "nadih2",
      "number": 2,
      "photo": "elections/candidates/GfOn0d5cSqN3XozfadusrjPKcmdf8yHzVYqZHCQK.jpg",
      "votes": 15
    }
  ],
  "total_votes": 45
}
```

> **Catatan Frontend:** Pada endpoint `/results`, field foto di item `results` berupa path relatif `photo` (bukan `photo_url`). Jika ingin menampilkan gambar dari endpoint ini, gabungkan dengan `<APP_URL>/storage/{photo}` atau ambil `photo_url` dari endpoint detail pemilu.

**Response `403 Forbidden` (ketika `can_show_results === false`):**
```json
{
  "message": "Hasil pemilu belum dipublikasikan."
}
```
- `404 Not Found`: Pemilu tidak ditemukan atau masih `draft`.

---

### 4. Daftar Pemilu Saya (Auth Required)

`GET /api/me/elections`

Mengembalikan daftar pemilu berstatus `active` atau `closed` di mana user yang sedang login terdaftar sebagai pemilih (`eligible`), lengkap dengan `voter_status` masing-masing.

**Response `200 OK`:**
```json
{
  "elections": [
    {
      "id": "0194...",
      "title": "Pemilu Raya HIMAIF 2026",
      "slug": "pemilu-raya-himaif-2026",
      "description": "Pemilihan Ketua Himpunan...",
      "status": "active",
      "starts_at": "2026-11-17T08:00:00.000000Z",
      "ends_at": "2026-11-17T17:00:00.000000Z",
      "result_visibility": "after_closed",
      "show_results_at": null,
      "is_voting_open": true,
      "can_show_results": false,
      "candidates_count": 2,
      "participations_count": 45,
      "created_at": "2026-11-16T10:00:00.000000Z",
      "updated_at": "2026-11-16T10:00:00.000000Z",
      "voter_status": {
        "is_eligible": true,
        "has_voted": false,
        "can_vote": true,
        "reason": null
      }
    }
  ]
}
```

---

### 5. Status Pemilih pada Satu Pemilu (Auth Required)

`GET /api/elections/{slug}/my-status`

Digunakan pada halaman detail pemilu untuk mengecek apakah user login berhak memilih, sudah memilih, atau alasan kenapa tombol vote dinonaktifkan.

**Response `200 OK`:**
```json
{
  "election": {
    "id": "01a1e776-62f6-7d70-b20e-821efe3e9f2b",
    "title": "Pemilihan jamal",
    "slug": "pemilihan-jamal",
    "description": "a;sfkajsd;fkdljsa;kldf",
    "status": "active",
    "starts_at": "2026-11-17T03:04:00.000000Z",
    "ends_at": "2026-11-30T03:04:00.000000Z",
    "result_visibility": "hidden",
    "show_results_at": null,
    "is_voting_open": true,
    "can_show_results": false,
    "candidates_count": 2,
    "participations_count": 0,
    "created_at": "2026-11-17T03:04:17.000000Z",
    "updated_at": "2026-11-17T03:13:37.000000Z"
  },
  "status": {
    "is_eligible": true,
    "has_voted": false,
    "can_vote": true,
    "reason": null
  }
}
```

---

### 6. Kirim Suara / Vote (Auth Required)

`POST /api/elections/{slug}/vote`

**Request Body:**
```json
{
  "candidate_id": "0194..."
}
```
Validasi: `candidate_id` wajib diisi dan harus berformat `uuid` yang termasuk dalam pemilu `{slug}`.

**Response `201 Created`:**
```json
{
  "message": "Suara berhasil direkam.",
  "has_voted": true,
  "voted_at": "2026-11-17T10:20:00.000000Z"
}
```

**Kemungkinan Error:**
- `401 Unauthorized` — Token Sanctum tidak ada atau tidak valid.
- `403 Forbidden` — Tidak eligible, pemilu tidak aktif, belum dimulai, atau sudah berakhir:
  ```json
  {
    "message": "Anda tidak terdaftar sebagai pemilih pada pemilu ini.",
    "has_voted": false
  }
  ```
- `404 Not Found` — Pemilu tidak ditemukan atau masih `draft`.
- `409 Conflict` — User sudah pernah memberikan suara pada pemilu ini:
  ```json
  {
    "message": "Anda sudah memberikan suara pada pemilu ini.",
    "has_voted": true
  }
  ```
- `422 Unprocessable Entity` — `candidate_id` kosong/bukan UUID, atau kandidat bukan bagian dari pemilu ini (`"Kandidat tidak valid untuk pemilu ini."`).
- `429 Too Many Requests` — Melebihi batas `10` request per menit.

---

## Rekomendasi Alur di Frontend

1. **Halaman List Pemilu**:
   - Jika user belum login: panggil `GET /api/elections` untuk menampilkan daftar pemilu publik.
   - Jika user sudah login: bisa memanggil `GET /api/me/elections` untuk langsung menampilkan pemilu yang relevan beserta badge status (`Belum Memilih` / `Sudah Memilih`).
2. **Halaman Detail & Bilik Suara (`/elections/:slug`)**:
   - Panggil `GET /api/elections/{slug}` untuk menampilkan info pemilu dan kartu kandidat (`photo_url`, `number`, `name`, `vision_mission`).
   - Jika user sudah login, panggil `GET /api/elections/{slug}/my-status`:
     - Tampilkan tombol pilih hanya jika `status.can_vote === true`.
     - Jika `status.can_vote === false`, tampilkan pesan sesuai `status.reason` (`already_voted`, `not_eligible`, `not_started`, `ended`, `not_active`).
   - Saat user submit pilihan, panggil `POST /api/elections/{slug}/vote` dengan `{ candidate_id }` dan perbarui state UI menjadi sudah memilih (`has_voted: true`).
3. **Halaman / Section Hasil (`Quick Count / Real Count`)**:
   - Cek flag `election.can_show_results` terlebih dahulu sebelum memanggil `GET /api/elections/{slug}/results` agar terhindar dari `403`.
