# Perchick API (`perchick-api`)

Backend REST API untuk website **Perchick Store** yang dibangun menggunakan **NestJS**, **Prisma ORM**, dan **PostgreSQL**.

## Fitur Utama
- **Manajemen Kategori (`/categories`)**: Endpoint CRUD untuk kategori produk olahan ayam.
- **Manajemen Produk (`/products`)**: Endpoint CRUD produk lengkap dengan relasi kategori.
- **Filter, Pencarian & Pengurutan**: Mendukung filter kategori, pencarian kata kunci (`search`/`q`), produk unggulan (`featured`), serta pengurutan (`popular`, `rating`, `price-asc`, `price-desc`, `newest`).

## Menjalankan Proyek
```bash
npm install
npx prisma migrate dev
node prisma/seed.ts
npm run start:dev
```
API berjalan secara default pada `http://localhost:8000` (konfigurasi database diatur melalui `.env` pada `DATABASE_URL`).
