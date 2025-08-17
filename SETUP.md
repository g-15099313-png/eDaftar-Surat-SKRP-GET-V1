# PANDUAN SETUP EDAFTAR SURAT SKRP GET

## 🚨 MASALAH YANG PERLU DISELESAIKAN

### 1. Konfigurasi Google Apps Script

#### Langkah 1: Buat Google Spreadsheet
1. Buka [Google Sheets](https://sheets.google.com)
2. Buat 2 spreadsheet baru:
   - `Surat Masuk SKRP GET`
   - `Surat Keluar SKRP GET`
3. Catat ID spreadsheet dari URL (selepas `/d/` dan sebelum `/edit`)

#### Langkah 2: Buat Google Apps Script
1. Buka [Google Apps Script](https://script.google.com)
2. Buat projek baru
3. Salin kod dari `google-apps-script.gs`
4. **PENTING**: Ganti ID spreadsheet dalam kod:
   ```javascript
   const SURAT_MASUK_SHEET_ID = 'ID_SPREADSHEET_SURAT_MASUK_ANDA';
   const SURAT_KELUAR_SHEET_ID = 'ID_SPREADSHEET_SURAT_KELUAR_ANDA';
   const FILES_FOLDER_ID = 'ID_FOLDER_GOOGLE_DRIVE_ANDA';
   ```

#### Langkah 3: Deploy sebagai Web App
1. Klik "Deploy" > "New deployment"
2. Pilih "Web app"
3. Set access to "Anyone"
4. Deploy dan catat URL

#### Langkah 4: Buat Folder Google Drive
1. Buka [Google Drive](https://drive.google.com)
2. Buat folder baru: `EDAFTAR SURAT SKRP GET - Files`
3. Catat ID folder dari URL

### 2. Kemaskini Konfigurasi Frontend

#### Langkah 1: Kemaskini config.js
Buka `config.js` dan ganti URL Google Apps Script:
```javascript
GOOGLE_APPS_SCRIPT_URL: 'URL_GOOGLE_APPS_SCRIPT_WEB_APP_ANDA'
```

#### Langkah 2: Kemaskini google-apps-script.gs
Buka `google-apps-script.gs` dan ganti ID spreadsheet:
```javascript
const SURAT_MASUK_SHEET_ID = 'ID_SPREADSHEET_SURAT_MASUK_ANDA';
const SURAT_KELUAR_SHEET_ID = 'ID_SPREADSHEET_SURAT_KELUAR_ANDA';
const FILES_FOLDER_ID = 'ID_FOLDER_GOOGLE_DRIVE_ANDA';
```

## 🔧 PENYELESAIAN MASALAH

### Masalah: Maklumat tidak boleh disimpan

#### Punca 1: URL Google Apps Script tidak betul
**Penyelesaian:**
1. Pastikan URL Google Apps Script betul dalam `config.js`
2. Pastikan Google Apps Script sudah di-deploy sebagai Web App
3. Pastikan access di-set kepada "Anyone"

#### Punca 2: ID Spreadsheet tidak betul
**Penyelesaian:**
1. Pastikan ID spreadsheet betul dalam `google-apps-script.gs`
2. Pastikan spreadsheet wujud dan boleh diakses
3. Pastikan Google Apps Script mempunyai kebenaran untuk mengakses spreadsheet

#### Punca 3: CORS Error
**Penyelesaian:**
1. Jalankan aplikasi melalui web server (bukan file://)
2. Gunakan extension seperti Live Server di VS Code
3. Atau jalankan: `python -m http.server 8000`

### Masalah: Fail tidak boleh dimuat naik

#### Punca 1: ID Folder Google Drive tidak betul
**Penyelesaian:**
1. Pastikan ID folder betul dalam `google-apps-script.gs`
2. Pastikan folder wujud dan boleh diakses
3. Pastikan Google Apps Script mempunyai kebenaran untuk mengakses folder

#### Punca 2: Saiz fail terlalu besar
**Penyelesaian:**
1. Pastikan fail tidak melebihi 5MB
2. Gunakan format fail yang dibenarkan (PDF, DOC, DOCX)

## 📋 LANGKAH-LANGKAH SETUP LENGKAP

### 1. Persediaan Google Workspace
```bash
# 1. Buat Google Spreadsheet untuk Surat Masuk
# 2. Buat Google Spreadsheet untuk Surat Keluar
# 3. Buat Google Drive Folder untuk fail
# 4. Catat semua ID
```

### 2. Setup Google Apps Script
```javascript
// 1. Buka https://script.google.com
// 2. Buat projek baru
// 3. Salin kod dari google-apps-script.gs
// 4. Ganti ID spreadsheet dan folder
// 5. Deploy sebagai Web App
```

### 3. Setup Frontend
```bash
# 1. Kemaskini config.js dengan URL Google Apps Script
# 2. Jalankan aplikasi melalui web server
# 3. Test fungsi tambah, edit, padam
```

### 4. Test Aplikasi
```bash
# 1. Test tambah surat baru
# 2. Test edit surat sedia ada
# 3. Test padam surat
# 4. Test muat naik fail
# 5. Test carian dan filter
```

## 🐛 DEBUGGING

### Periksa Console Browser
1. Buka Developer Tools (F12)
2. Lihat tab Console untuk error
3. Lihat tab Network untuk masalah API

### Periksa Google Apps Script Logs
1. Buka Google Apps Script
2. Klik "Executions" untuk lihat log
3. Periksa error yang berlaku

### Test API Secara Langsung
```javascript
// Test dalam console browser
fetch('URL_GOOGLE_APPS_SCRIPT_ANDA', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        action: 'add',
        suratType: 'surat-masuk',
        suratData: {
            noRujukan: 'TEST/2024/001',
            tarikhTerima: '2024-01-01',
            pengirim: 'Test',
            subjek: 'Test Subject',
            status: 'Baru',
            tindakanSiapa: 'Guru Besar'
        },
        user: 'Guru Besar'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 📞 BANTUAN

Jika masih menghadapi masalah:

1. **Periksa semua ID dan URL** - Pastikan semua ID spreadsheet dan folder betul
2. **Periksa kebenaran** - Pastikan Google Apps Script mempunyai kebenaran yang diperlukan
3. **Periksa console** - Lihat error dalam console browser
4. **Test API** - Test API secara langsung untuk mengesan masalah

## ✅ CHECKLIST SETUP

- [ ] Google Spreadsheet untuk Surat Masuk dibuat
- [ ] Google Spreadsheet untuk Surat Keluar dibuat
- [ ] Google Drive Folder untuk fail dibuat
- [ ] ID semua spreadsheet dan folder dicatat
- [ ] Google Apps Script dibuat dan di-deploy
- [ ] URL Google Apps Script dikemaskini dalam config.js
- [ ] ID spreadsheet dikemaskini dalam google-apps-script.gs
- [ ] Aplikasi dijalankan melalui web server
- [ ] Test fungsi tambah surat
- [ ] Test fungsi edit surat
- [ ] Test fungsi padam surat
- [ ] Test muat naik fail

---

**PENTING**: Pastikan semua ID dan URL dikemaskini dengan betul sebelum menggunakan aplikasi!

