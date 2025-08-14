# 🚀 Panduan Pemasangan EDAFTAR SURAT SKRP GET

Panduan langkah demi langkah untuk memasang aplikasi EDAFTAR SURAT SKRP GET.

## 📋 Senarai Semak Pemasangan

- [ ] Google Spreadsheet dibuat
- [ ] Google Apps Script disediakan
- [ ] Google Drive folder dibuat
- [ ] Konfigurasi frontend dikemaskini
- [ ] Aplikasi diuji

## 🔧 Langkah 1: Persediaan Google Spreadsheet

### 1.1 Buat Spreadsheet Surat Masuk
1. Buka [Google Sheets](https://sheets.google.com)
2. Klik "Blank" untuk spreadsheet baru
3. Namakan sebagai "Surat Masuk SKRP GET"
4. Catat ID dari URL: `https://docs.google.com/spreadsheets/d/[ID_INI]/edit`

### 1.2 Buat Spreadsheet Surat Keluar
1. Buat spreadsheet baru lagi
2. Namakan sebagai "Surat Keluar SKRP GET"
3. Catat ID dari URL

### 1.3 Format Spreadsheet
Setiap spreadsheet perlu mempunyai header berikut:
```
A1: ID
B1: No. Rujukan
C1: Tarikh Terima
D1: Pengirim
E1: Subjek
F1: Status
G1: Tindakan Siapa
H1: Fail Surat
I1: Dicipta Oleh
J1: Dicipta Pada
```

## 🔧 Langkah 2: Persediaan Google Apps Script

### 2.1 Buat Projek Google Apps Script
1. Buka [Google Apps Script](https://script.google.com)
2. Klik "New project"
3. Namakan projek sebagai "EDAFTAR SURAT SKRP GET"

### 2.2 Salin Kod Backend
1. Padam kod sedia ada dalam editor
2. Salin semua kod dari fail `google-apps-script.gs`
3. Ganti ID spreadsheet dalam kod:
   ```javascript
   const SURAT_MASUK_SHEET_ID = 'ID_SPREADSHEET_SURAT_MASUK_ANDA';
   const SURAT_KELUAR_SHEET_ID = 'ID_SPREADSHEET_SURAT_KELUAR_ANDA';
   ```

### 2.3 Deploy sebagai Web App
1. Klik butang "Deploy" > "New deployment"
2. Pilih "Web app"
3. Isi maklumat:
   - **Description**: EDAFTAR SURAT SKRP GET v1.0
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Klik "Deploy"
5. Catat URL Web App yang diberikan

## 🔧 Langkah 3: Persediaan Google Drive

### 3.1 Buat Folder Fail
1. Buka [Google Drive](https://drive.google.com)
2. Klik "New" > "Folder"
3. Namakan sebagai "EDAFTAR SURAT SKRP GET - Files"
4. Catat ID folder dari URL

### 3.2 Kemaskini Google Apps Script
1. Kembali ke Google Apps Script
2. Ganti ID folder dalam kod:
   ```javascript
   const FILES_FOLDER_ID = 'ID_FOLDER_GOOGLE_DRIVE_ANDA';
   ```
3. Deploy semula Web App

## 🔧 Langkah 4: Konfigurasi Frontend

### 4.1 Kemaskini config.js
1. Buka fail `config.js`
2. Ganti URL Google Apps Script:
   ```javascript
   GOOGLE_APPS_SCRIPT_URL: 'URL_WEB_APP_ANDA'
   ```

### 4.2 Kemaskini Maklumat Sekolah (Pilihan)
1. Dalam `config.js`, kemaskini maklumat sekolah:
   ```javascript
   SCHOOL_INFO: {
       name: 'Sekolah Kebangsaan SKRP GET',
       address: 'Alamat Sekolah Anda',
       phone: '03-XXXX XXXX',
       email: 'skrpget@moe.edu.my',
       website: 'https://skrpget.edu.my'
   }
   ```

## 🔧 Langkah 5: Ujian Aplikasi

### 5.1 Jalankan Aplikasi
1. Buka fail `index.html` dalam pelayar web
2. Atau gunakan server tempatan:
   ```bash
   python -m http.server 8000
   # Buka http://localhost:8000
   ```

### 5.2 Ujian Fungsi Asas
1. **Pilih Pengguna**: Klik butang pengguna berbeza
2. **Tambah Surat**: Klik "Tambah Surat Baru"
3. **Muat Naik Fail**: Cuba muat naik fail PDF
4. **Cari & Filter**: Uji fungsi carian
5. **Edit & Padam**: Uji fungsi edit dan padam

### 5.3 Periksa Data
1. Buka Google Spreadsheet
2. Pastikan data tersimpan dengan betul
3. Periksa folder Google Drive untuk fail yang dimuat naik

## 🔧 Langkah 6: Penyelenggaraan

### 6.1 Backup Berkala
1. Jalankan fungsi backup dalam Google Apps Script:
   ```javascript
   function backupData() {
       // Kod backup automatik
   }
   ```

### 6.2 Log Aktiviti
1. Periksa sheet "ActivityLog" dalam spreadsheet
2. Pastikan semua aktiviti direkodkan

### 6.3 Kemaskini Sistem
1. Backup data sedia ada
2. Kemaskini fail frontend
3. Kemaskini Google Apps Script
4. Test semua fungsi

## 🐛 Penyelesaian Masalah

### Masalah: "Konfigurasi tidak lengkap"
**Penyelesaian**: Pastikan URL Google Apps Script diisi dalam `config.js`

### Masalah: "Gagal menyimpan data"
**Penyelesaian**: 
1. Periksa ID spreadsheet dalam Google Apps Script
2. Pastikan Web App di-deploy dengan betul
3. Periksa kebenaran Google Apps Script

### Masalah: "Fail tidak dapat dimuat naik"
**Penyelesaian**:
1. Periksa ID folder Google Drive
2. Pastikan saiz fail tidak melebihi 5MB
3. Pastikan format fail adalah PDF atau Word

### Masalah: "Antara muka tidak responsif"
**Penyelesaian**:
1. Periksa console browser (F12)
2. Pastikan semua fail dimuat dengan betul
3. Cuba refresh halaman

## 📞 Bantuan Teknikal

Jika menghadapi masalah:
1. Periksa log error dalam console browser
2. Periksa log dalam Google Apps Script
3. Rujuk dokumentasi lengkap dalam `README.md`

## ✅ Senarai Semak Akhir

- [ ] Aplikasi dapat dibuka tanpa error
- [ ] Pengguna dapat dipilih
- [ ] Surat dapat ditambah
- [ ] Fail dapat dimuat naik
- [ ] Data tersimpan dalam spreadsheet
- [ ] Fungsi carian berfungsi
- [ ] Fungsi edit dan padam berfungsi
- [ ] Antara muka responsif pada mobile

---

**Selamat menggunakan EDAFTAR SURAT SKRP GET! 🎉**
