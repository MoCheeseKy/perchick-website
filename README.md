# Perchick Store

Platform katalog dan manajemen produk olahan ayam siap masak (frozen food) untuk **Perchick**, terdiri dari aplikasi frontend (`perchick-store`) dan REST API backend (`perchick-api`).

## Struktur Proyek

### 1. Frontend — `perchick-store`
Aplikasi web berbasis **Next.js** (React + TypeScript + Tailwind CSS) yang menyediakan:
- **Halaman Utama**: Menampilkan produk unggulan dan informasi brand Perchick.
- **Katalog & Detail Produk**: Pencarian produk, filter kategori, pengurutan (populer, rating, harga), serta pemesanan langsung via WhatsApp.
- **Admin Manajemen Produk** (`/product-managements`): Antarmuka CRUD untuk menambah, mengubah, dan menghapus produk.

Menjalankan frontend:
```bash
cd perchick-store
npm install
npm run dev
```

### 2. Backend — `perchick-api`
REST API berbasis **NestJS** (TypeScript) dengan **Prisma ORM** dan database **PostgreSQL** lokal yang menyediakan:
- **CRUD Kategori** (`/categories`) dan **CRUD Produk** (`/products`).
- **Endpoint Lanjutan**: Filter berdasarkan kategori (`/products/category/:categoryId`), pencarian (`/products/search?q=...`), produk unggulan (`/products/featured`), serta pengurutan melalui query parameter (`?category=&search=&sort=`).

Menjalankan backend:
```bash
cd perchick-api
npm install
npx prisma migrate dev
node prisma/seed.ts
npm run start:dev
```
Server backend berjalan secara default di `http://localhost:8000`.
