# Perchick Store (`perchick-store`)

Frontend aplikasi web katalog dan manajemen produk olahan ayam siap masak (frozen food) untuk **Perchick**, dibangun dengan **Next.js**, **React**, **TypeScript**, dan **Tailwind CSS**.

## Fitur Utama
- **Beranda & Katalog Produk**: Menampilkan daftar produk olahan ayam, filter kategori, pencarian, dan pengurutan.
- **Detail Produk**: Informasi lengkap produk (berat, stok, deskripsi) dengan tombol pemesanan langsung via WhatsApp.
- **Admin Product Management**: Halaman `/product-managements` untuk mengelola data produk (tambah, edit, hapus) yang terhubung ke backend `perchick-api`.

## Menjalankan Proyek
```bash
npm install
npm run dev
```
Pastikan backend `perchick-api` berjalan di `http://localhost:8000` (atau sesuaikan `NEXT_PUBLIC_API_URL`).
