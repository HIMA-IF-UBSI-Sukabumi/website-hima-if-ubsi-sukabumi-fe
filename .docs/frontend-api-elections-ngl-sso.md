# Frontend Integration Guide: Elections (E-Voting), NGL, & External SSO

Dokumentasi ini dibuat berdasarkan commit terbaru tanggal **16–17 November 2026** (`fb32e88` s/d `a6346d8`) pada repository `website-hima-if-ubsi-sukabumi-be`.

---

## Ringkasan Fitur Baru (16–17 Nov 2026)

1. **Elections (E-Voting)** — Sistem pemilu dengan *secret ballot* (pilihan kandidat dipisahkan dari identitas & waktu voting pemilih) dan *approval workflow* (hanya pemilu & kandidat berstatus `approved` yang tampil di API).
2. **Anonymous NGL Messaging** — Kirim pesan anonim ke mahasiswa aktif tertentu (lewat NIM -> one-time resolve token) atau pesan umum untuk admin, lengkap dengan inbox user & moderasi admin.
3. **External SSO (Single Sign-On)** — Mekanisme login terpusat dari backend ke frontend eksternal (`elections` dan `ngl`) menggunakan *short-lived authorization code* (60 detik) yang ditukar menjadi Sanctum Bearer Token dengan *scoped abilities*.

> **Catatan Non-API:** Di sisi backend/admin juga ditambahkan Filament Resource untuk Elections (beserta Approvals, Candidates, Eligibilities, Activate/Close actions), command penutupan otomatis pemilu kedaluwarsa (`CloseExpiredElections`), patch keamanan dependensi, dan aset Filament.

---

## 1. Authentication & External SSO

Frontend eksternal (`elections` dan `ngl`) dapat memperoleh Bearer Token melalui **External SSO** atau **Direct Login** (`/api/auth/login`).

### Alur External SSO

1. User membuka halaman backend `GET /sso/{audience}` (membutuhkan session login di backend).
   - `audience` yang tersedia: `elections` atau `ngl`.
2. Backend membuat `code` (64 karakter, berlaku **60 detik**, *single-use*) dan me-redirect browser ke:
   `{AUDIENCE_BASE_URL}{callback}?code={64_CHAR_CODE}`
   (Default callback: `/auth/callback`).
3. Frontend membaca query `code` di halaman callback lalu menukarnya ke API `POST /api/auth/sso/exchange`.

### `POST /api/auth/sso/exchange`

Menukar SSO authorization code menjadi Sanctum Bearer Token.

- **Auth:** Tidak perlu (Public)
- **Rate Limit:** 10 request/menit

**Request Body:**
```json
{
  "code": "64-char-random-string...",
  "audience": "elections"
}
```
- `code`: `required|string|size:64`
- `audience`: `required|string` (`"elections"` atau `"ngl"`, sesuai `services.sso` yang memiliki `url` terkonfigurasi)

**Success Response (`200 OK`):**
```json
{
  "token": "1|plainTextSanctumToken...",
  "expires_in": 3600,
  "user": {
    "id": "uuid-user",
    "name": "Budi Santoso",
    "nim": "12240001",
    "status": "aktif",
    "roles": ["mahasiswa"]
  }
}
```
- `expires_in`: Masa berlaku token dalam detik (default `3600` / 60 menit, mengikuti `SSO_TOKEN_TTL_MINUTES`).
- **Token Abilities:**
  - `audience: "elections"` → `["elections:read", "elections:vote"]`
  - `audience: "ngl"` → `["ngl:read"]` (ditambah `"ngl:admin"` jika user memiliki role `admin`)

**Error Responses:**
- `422 Unprocessable Entity` — Validasi gagal atau kode SSO tidak valid / sudah kedaluwarsa / sudah dipakai / user tidak aktif:
  ```json
  {
    "message": "Kode SSO tidak valid atau sudah kedaluwarsa."
  }
  ```

### Endpoint Auth Pendukung Lainnya
- `POST /api/auth/login` (throttle 10/min) — Login langsung dengan `{ nim, password }`, mengembalikan token dengan full abilities.
- `GET /api/auth/me` (Bearer token) — Mendapatkan profil user saat ini.
- `POST /api/auth/logout` (Bearer token) — Mencabut token aktif.

**Contoh Exchange (TypeScript / `fetch`):**
```ts
const res = await fetch(`${API_BASE_URL}/api/auth/sso/exchange`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ code, audience: 'elections' }),
});

if (!res.ok) throw new Error((await res.json()).message);
const { token, expires_in, user } = await res.json();
```

---

## 2. Elections (E-Voting) API

Semua endpoint publik & user hanya menampilkan pemilu yang **bukan `draft`** dan sudah **`approved`**, serta kandidat yang sudah **`approved`**.

### Ringkasan Enum
- `status`: `"draft"` | `"active"` | `"closed"`
- `result_visibility`:
  - `"hidden"` — Hasil tidak dipublikasikan ke publik
  - `"after_closed"` — Hasil tampil setelah `status === "closed"`
  - `"scheduled"` — Hasil tampil setelah `status === "closed"` dan waktu sekarang `>= show_results_at`

---

### `GET /api/elections`

Daftar pemilu publik (selain `draft` dan sudah `approved`), diurutkan terbaru (`starts_at` desc), menggunakan **cursor pagination** (15 item/halaman).

- **Auth:** Public
- **Rate Limit:** 60 request/menit
- **Query Params:**
  - `status` (optional): Filter status, mis. `active` atau `closed`
  - `cursor` (optional): Cursor pagination dari response sebelumnya

**Success Response (`200 OK`):**
```json
{
  "data": [
    {
      "id": "uuid-election",
      "title": "Pemilu Raya HIMAIF 2026",
      "slug": "pemilu-raya-himaif-2026",
      "description": "Pemilihan Ketua dan Wakil Ketua HIMAIF periode 2026/2027.",
      "status": "active",
      "starts_at": "2026-11-17T08:00:00.000000Z",
      "ends_at": "2026-11-20T17:00:00.000000Z",
      "result_visibility": "after_closed",
      "show_results_at": null,
      "is_voting_open": true,
      "can_show_results": false,
      "candidates_count": 3,
      "participations_count": 42,
      "created_at": "2026-11-16T10:00:00.000000Z",
      "updated_at": "2026-11-17T07:55:00.000000Z"
    }
  ],
  "path": "https://api.example.com/api/elections",
  "per_page": 15,
  "next_cursor": null,
  "next_page_url": null,
  "prev_cursor": null,
  "prev_page_url": null
}
```

---

### `GET /api/elections/{slug}`

Detail satu pemilu beserta daftar kandidat yang sudah `approved` (diurutkan berdasarkan `number`).

- **Auth:** Public
- **Rate Limit:** 60 request/menit

**Success Response (`200 OK`):**
```json
{
  "election": {
    "id": "uuid-election",
    "title": "Pemilu Raya HIMAIF 2026",
    "slug": "pemilu-raya-himaif-2026",
    "description": "Pemilihan Ketua dan Wakil Ketua HIMAIF periode 2026/2027.",
    "status": "active",
    "starts_at": "2026-11-17T08:00:00.000000Z",
    "ends_at": "2026-11-20T17:00:00.000000Z",
    "result_visibility": "after_closed",
    "show_results_at": null,
    "is_voting_open": true,
    "can_show_results": false,
    "candidates_count": 2,
    "participations_count": 42,
    "created_at": "2026-11-16T10:00:00.000000Z",
    "updated_at": "2026-11-17T07:55:00.000000Z",
    "candidates": [
      {
        "id": "uuid-candidate-1",
        "name": "Andi & Citra",
        "number": 1,
        "photo": "candidates/paslon-1.jpg",
        "photo_url": "https://api.example.com/storage/candidates/paslon-1.jpg",
        "vision_mission": "<p>Visi dan misi...</p>"
      }
    ]
  }
}
```
- **Error:** `404 Not Found` jika slug tidak ada, masih `draft`, atau belum `approved`.

---

### `GET /api/elections/{slug}/results`

Mengambil hasil agregat suara per kandidat. Hanya dapat diakses jika `can_show_results === true`.

- **Auth:** Public
- **Rate Limit:** 60 request/menit

**Success Response (`200 OK`):**
```json
{
  "election": { "...": "ringkasan election" },
  "results": [
    {
      "candidate_id": "uuid-candidate-1",
      "name": "Andi & Citra",
      "number": 1,
      "photo": "candidates/paslon-1.jpg",
      "votes": 85,
      "deleted_at": null
    }
  ],
  "total_votes": 150
}
```

**Error Responses:**
- `403 Forbidden` — Hasil belum dipublikasikan:
  ```json
  { "message": "Hasil pemilu belum dipublikasikan." }
  ```
- `404 Not Found` — Pemilu tidak ditemukan / `draft` / belum `approved`.

---

### `GET /api/elections/{slug}/my-status`

Mengecek apakah user yang login eligible dan sudah memilih pada pemilu tertentu.

- **Auth:** Bearer Token (`auth:sanctum`, ability: `elections:read`)

**Success Response (`200 OK`):**
```json
{
  "election": { "...": "ringkasan election" },
  "status": {
    "is_eligible": true,
    "has_voted": false,
    "can_vote": true,
    "reason": null
  }
}
```
Nilai `reason` yang mungkin muncul saat `can_vote === false`:
- `"not_eligible"` — User tidak terdaftar di daftar pemilih (`election_eligibilities`)
- `"already_voted"` — User sudah memberikan suara
- `"inactive"` — Status user bukan `aktif`
- `"not_active"` — Status pemilu bukan `active`
- `"not_started"` — Waktu sekarang sebelum `starts_at`
- `"ended"` — Waktu sekarang sesudah `ends_at`

---

### `GET /api/me/elections`

Daftar semua pemilu (`active` atau `closed`, serta `approved`) di mana user yang login terdaftar sebagai pemilih eligible, lengkap dengan `voter_status`.

- **Auth:** Bearer Token (`auth:sanctum`, ability: `elections:read`)
- **Rate Limit:** 60 request/menit

**Success Response (`200 OK`):**
```json
{
  "elections": [
    {
      "id": "uuid-election",
      "title": "Pemilu Raya HIMAIF 2026",
      "slug": "pemilu-raya-himaif-2026",
      "status": "active",
      "is_voting_open": true,
      "can_show_results": false,
      "candidates_count": 2,
      "participations_count": 42,
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

### `POST /api/elections/{slug}/vote`

Mengirim suara (ballot) untuk kandidat tertentu. Pilihan disimpan secara anonim tanpa relasi ke `user_id` maupun timestamp di tabel `ballots`.

- **Auth:** Bearer Token (`auth:sanctum`, ability: `elections:vote`)
- **Rate Limit:** 10 request/menit

**Request Body:**
```json
{
  "candidate_id": "uuid-candidate-1"
}
```
- `candidate_id`: `required|uuid`

**Success Response (`201 Created`):**
```json
{
  "message": "Suara berhasil direkam.",
  "has_voted": true,
  "voted_at": "2026-11-17T11:45:00.000000Z"
}
```

**Error Responses:**
- `403 Forbidden` — Tidak eligible, akun non-aktif, pemilu tidak aktif, belum mulai, atau sudah berakhir (`has_voted: false`).
- `409 Conflict` — User sudah pernah memilih pada pemilu ini:
  ```json
  {
    "message": "Anda sudah memberikan suara pada pemilu ini.",
    "has_voted": true
  }
  ```
- `422 Unprocessable Entity` — `candidate_id` invalid, bukan milik pemilu ini, pemilu belum disetujui, atau kandidat belum disetujui.

---

## 3. Anonymous NGL Messaging API

Fitur pesan anonim dengan dua mode:
- **Personal (ke Mahasiswa tertentu):** Frontend resolve NIM dulu untuk mendapat *one-time token* (berlaku 15 menit), lalu kirim pesan dengan `token`.
- **General (untuk HIMAIF / Admin):** Langsung kirim `POST /api/ngl/messages` tanpa `token`.

---

### `GET /api/ngl/resolve/{nim}`

Memvalidasi NIM mahasiswa aktif (non-admin) dan mengembalikan `display_name` yang disamarkan (nama depan + inisial nama belakang) beserta `token` sekali pakai.

- **Auth:** Public
- **Rate Limit:** 10 request/menit (global throttle) + maksimal 10 percobaan per NIM per 10 menit.

**Success Response (`200 OK`):**
```json
{
  "token": "64-char-random-string...",
  "display_name": "Budi S.",
  "expires_in": 900
}
```

**Error Responses:**
- `404 Not Found` — Mahasiswa aktif (non-admin) dengan NIM tersebut tidak ditemukan.
- `429 Too Many Requests` — Terlalu banyak percobaan untuk NIM ini / rate limit tercapai.

---

### `POST /api/ngl/messages`

Mengirim pesan anonim (ke penerima dari `token`, atau pesan umum jika `token` dikosongkan/`null`).

- **Auth:** Public
- **Rate Limit:** 5 request/menit

**Request Body:**
```json
{
  "content": "Semangat terus kuliahnya!",
  "token": "64-char-token-dari-resolve-atau-null"
}
```
- `content`: `required|string|max:2000` (otomatis di-`trim` oleh backend; string spasi saja akan ditolak `422`)
- `token`: `nullable|string|size:64` (**single-use**: langsung hangus setelah dipakai)

**Success Response (`201 Created`):**
```json
{
  "message": "Pesan NGL berhasil dikirim."
}
```

**Error Responses:**
- `422 Unprocessable Entity` — Validasi gagal atau `token` tidak valid / sudah dipakai / sudah kedaluwarsa (> 15 menit):
  ```json
  {
    "message": "Token NGL tidak valid atau sudah kedaluwarsa."
  }
  ```

---

### `GET /api/me/ngl-messages`

Mengambil daftar pesan NGL yang ditujukan ke user yang sedang login (cursor pagination, 20 item/halaman).

- **Auth:** Bearer Token (`auth:sanctum`, ability: `ngl:read`)
- **Rate Limit:** 60 request/menit
- **Query Params:**
  - `status` (optional): `"all"` (default) | `"unread"` | `"read"`
  - `cursor` (optional)

**Success Response (`200 OK`):**
```json
{
  "data": [
    {
      "id": "uuid-ngl-message",
      "content": "Semangat terus kuliahnya!",
      "read_at": null,
      "is_read": false,
      "created_at": "2026-11-17T11:30:00.000000Z"
    }
  ],
  "path": "https://api.example.com/api/me/ngl-messages",
  "per_page": 20,
  "next_cursor": null,
  "next_page_url": null,
  "prev_cursor": null,
  "prev_page_url": null
}
```

---

### `PATCH /api/me/ngl-messages/{nglMessage}/read`

Menandai pesan NGL milik user yang sedang login sebagai sudah dibaca.

- **Auth:** Bearer Token (`auth:sanctum`, ability: `ngl:read`)
- **Rate Limit:** 60 request/menit

**Success Response (`200 OK`):**
```json
{
  "data": {
    "id": "uuid-ngl-message",
    "content": "Semangat terus kuliahnya!",
    "read_at": "2026-11-17T11:35:00.000000Z",
    "is_read": true,
    "created_at": "2026-11-17T11:30:00.000000Z"
  }
}
```
- **Error:** `404 Not Found` jika pesan bukan milik user yang sedang login.

---

### Admin NGL Endpoints (General Messages)

Semua endpoint di bawah membutuhkan Bearer Token dengan ability `ngl:admin` **dan** user memiliki role `admin`. Hanya mengelola pesan **umum** (`recipient_user_id === null`).

- **Auth:** Bearer Token (`auth:sanctum`, ability: `ngl:admin`, role `admin`)
- **Rate Limit:** 60 request/menit

| Method | Endpoint | Deskripsi | Query / Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/ngl-messages` | List pesan NGL umum (cursor paginated 20) | Query `?status=all\|unread\|read` |
| `PATCH` | `/api/admin/ngl-messages/{nglMessage}/read` | Tandai pesan umum sudah dibaca | `{ "data": { id, content, read_at, is_read, created_at } }` (`404` jika bukan pesan umum) |
| `DELETE` | `/api/admin/ngl-messages/{nglMessage}` | Hapus pesan umum (dicatat ke audit log) | `{ "message": "Pesan NGL berhasil dihapus." }` (`404` jika bukan pesan umum) |

---

## Checklist Implementasi Frontend

1. **Header Wajib:** Selalu kirim `Accept: application/json` agar error validasi (`422`) dan auth (`401`/`403`) mengembalikan JSON, bukan redirect HTML.
2. **Halaman `/auth/callback` (SSO):** Tangkap `?code=...`, kirim ke `POST /api/auth/sso/exchange` dengan `audience` sesuai app (`"elections"` atau `"ngl"`), simpan `token`, lalu redirect ke halaman utama.
3. **E-Voting UX:**
   - Gunakan `GET /api/me/elections` untuk dashboard pemilih (sudah memuat `voter_status`).
   - Cek `voter_status.can_vote` sebelum mengaktifkan tombol vote; tampilkan pesan sesuai `voter_status.reason`.
   - Handle `409 Conflict` saat vote sebagai kondisi sudah memilih (`has_voted: true`).
   - Hanya panggil `/api/elections/{slug}/results` jika `election.can_show_results === true`.
4. **NGL UX:**
   - Untuk kirim ke mahasiswa: panggil `GET /api/ngl/resolve/{nim}` saat NIM diisi, tampilkan `display_name` untuk konfirmasi, simpan `token` di state (ingat: berlaku 15 menit & sekali pakai — jika gagal submit atau ganti NIM, resolve ulang).
   - Untuk kirim umum: kirim `POST /api/ngl/messages` hanya dengan `{ content }` tanpa `token`.
