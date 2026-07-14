# Frontend API Integration Prompt

## Context

Backend API untuk **Portal HIMA IF** sudah selesai disesuaikan dengan struktur data yang sebelumnya menggunakan dummy data.

Tugasmu adalah **mengintegrasikan frontend dengan backend**, **tanpa mengubah tampilan maupun behavior yang sudah ada**.

Sebelum mulai mengerjakan, **WAJIB** membaca project terlebih dahulu.

---

# Langkah Pertama (WAJIB)

Sebelum menulis kode apa pun:

1. Baca keseluruhan project.
2. Fokus pada **Modules Portal**.
3. Pahami struktur project.
4. Cari:
   - Service API yang sudah ada.
   - Axios instance.
   - TanStack Query (jika digunakan).
   - Custom hooks.
   - Folder `modules/portal`.
   - Routing Portal.
   - Components yang menggunakan dummy data.
5. Ikuti coding style dan arsitektur project yang sudah ada.

Jangan membuat struktur atau pattern baru apabila project sudah memiliki standar sendiri.

---

# Tujuan

Mengganti seluruh data dummy menjadi data dari backend **tanpa mengubah UI maupun UX**.

Targetnya adalah agar seluruh komponen tetap berjalan seperti sebelumnya, hanya source datanya yang berubah dari:

```
constants/*.ts
```

menjadi data dari Backend API.

---

# Endpoint Backend

## BPH

```
GET /bph
```

---

## Department List

```
GET /departemens
```

---

## Department Detail

```
GET /departemens/{slug}
```

Gunakan endpoint detail apabila halaman membutuhkan informasi lengkap suatu department.

---

# Yang Harus Dilakukan

## 1. Jangan Ubah UI

- Jangan mengubah layout.
- Jangan mengubah styling.
- Jangan mengubah animation.
- Jangan mengubah component structure.
- Jangan mengubah behavior yang sudah berjalan dengan baik.

Yang berubah hanya source datanya.

---

## 2. Ganti Dummy Data

Cari penggunaan:

- `BPH_DATA`
- `DEPARTMENT_DATA`

Kemudian ganti menggunakan data dari API.

Hapus dependency terhadap dummy data apabila sudah tidak digunakan lagi.

---

## 3. Gunakan Pattern Project

Apabila project sudah memiliki:

- API Service
- Axios Instance
- TanStack Query
- Repository
- Custom Hook

Gunakan pattern tersebut.

Jangan membuat cara baru apabila sudah ada standar pada project.

---

## 4. Loading State

Tambahkan **loading state yang halus dan profesional** saat data sedang diambil dari API.

Apabila project sudah memiliki:

- Skeleton Loader
- Placeholder
- Shimmer
- Spinner Component

Gunakan komponen tersebut agar konsisten.

Jika belum ada, buat loading yang sederhana namun tetap modern dan tidak mengganggu UX.

Usahakan perpindahan dari loading ke data terasa smooth (misalnya dengan skeleton atau placeholder dibanding halaman kosong).

---

## 5. Error Handling

Tambahkan handling apabila request gagal.

Minimal:

- `console.error()`

Apabila project sudah memiliki Error UI atau Empty State, gunakan komponen tersebut.

Jangan sampai halaman crash karena API gagal.

---

## 6. TypeScript

Pastikan seluruh response API memiliki typing yang jelas.

Hindari penggunaan:

```ts
any
```

sebisa mungkin.

Gunakan interface/type sesuai response backend.

---

## 7. Performance

Gunakan cache/query sesuai pattern project.

Hindari request berulang yang tidak diperlukan.

Manfaatkan fitur caching TanStack Query apabila project sudah menggunakannya.

---

## 8. Clean Code

Tulis kode yang bersih dan konsisten dengan project.

- Jangan menambahkan komentar yang tidak diperlukan.
- Hindari komentar yang menjelaskan hal-hal yang sudah jelas dari nama variabel atau fungsi.
- Gunakan nama variabel, function, dan component yang deskriptif sehingga kode tetap mudah dipahami tanpa banyak komentar.
- Tambahkan komentar hanya jika benar-benar diperlukan untuk menjelaskan business logic yang kompleks.

---

# Hasil Akhir

Setelah selesai:

- Seluruh data BPH berasal dari API.
- Seluruh data Department berasal dari API.
- Tidak ada lagi penggunaan dummy data.
- UI tetap sama seperti sebelumnya.
- UX tetap nyaman.
- Loading terlihat profesional dan smooth.
- Error handling tersedia.
- TypeScript tetap rapi.
- Mengikuti arsitektur dan coding style project.
- Tidak banyak komentar yang tidak diperlukan.
- Kode bersih, mudah dibaca, dan mudah di-maintain.

---

# Catatan Penting

Prioritaskan **membaca project terlebih dahulu**, terutama **Modules Portal**, sebelum mulai implementasi.

Jangan berasumsi mengenai struktur project. Ikuti arsitektur, pattern, dan coding style yang sudah ada agar hasil integrasi tetap konsisten dengan keseluruhan aplikasi.
