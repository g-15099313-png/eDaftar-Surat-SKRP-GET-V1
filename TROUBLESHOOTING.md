# 🚨 PENYELESAIAN CEPAT: MAKLUMAT TIDAK BOLEH DISIMPAN

## Masalah: Maklumat tidak boleh disimpan

### Langkah 1: Periksa Konfigurasi (5 minit)

#### 1.1 Periksa config.js
Buka fail `config.js` dan pastikan URL Google Apps Script diisi:
```javascript
GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
```

**Jika URL masih placeholder:**
1. Buka [Google Apps Script](https://script.google.com)
2. Buat projek baru
3. Salin kod dari `google-apps-script.gs`
4. Deploy sebagai Web App
5. Salin URL yang diberikan

#### 1.2 Periksa google-apps-script.gs
Buka fail `google-apps-script.gs` dan pastikan ID spreadsheet diisi:
```javascript
const SURAT_MASUK_SHEET_ID = 'YOUR_SPREADSHEET_ID';
const SURAT_KELUAR_SHEET_ID = 'YOUR_SPREADSHEET_ID';
const FILES_FOLDER_ID = 'YOUR_FOLDER_ID';
```

**Jika ID masih placeholder:**
1. Buat Google Spreadsheet baru
2. Catat ID dari URL (selepas `/d/` dan sebelum `/edit`)
3. Ganti ID dalam kod

### Langkah 2: Test Konfigurasi (2 minit)

#### 2.1 Test dalam Console Browser
1. Buka aplikasi dalam browser
2. Tekan F12 untuk buka Developer Tools
3. Pergi ke tab Console
4. Jalankan kod ini:

```javascript
// Test konfigurasi
console.log('Config URL:', CONFIG.GOOGLE_APPS_SCRIPT_URL);

// Test API
fetch(CONFIG.GOOGLE_APPS_SCRIPT_URL, {
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
.then(data => {
    console.log('API Response:', data);
    if (data.success) {
        alert('✅ Konfigurasi betul! API berfungsi.');
    } else {
        alert('❌ Masalah dengan API: ' + data.message);
    }
})
.catch(error => {
    console.error('API Error:', error);
    alert('❌ Error API: ' + error.message);
});
```

### Langkah 3: Penyelesaian Berdasarkan Error

#### Error: "Konfigurasi tidak lengkap"
**Penyelesaian:**
1. Pastikan URL Google Apps Script diisi dalam `config.js`
2. Pastikan URL tidak kosong atau masih placeholder

#### Error: "Failed to fetch" atau "Network error"
**Penyelesaian:**
1. Pastikan Google Apps Script di-deploy sebagai Web App
2. Pastikan access di-set kepada "Anyone"
3. Periksa URL Web App betul

#### Error: "Spreadsheet not found"
**Penyelesaian:**
1. Periksa ID spreadsheet dalam `google-apps-script.gs`
2. Pastikan spreadsheet wujud dan boleh diakses
3. Pastikan Google Apps Script mempunyai kebenaran

#### Error: "CORS policy"
**Penyelesaian:**
1. Jalankan aplikasi melalui web server (bukan file://)
2. Gunakan extension Live Server di VS Code
3. Atau jalankan: `python -m http.server 8000`

### Langkah 4: Setup Cepat (10 minit)

#### 4.1 Buat Google Spreadsheet
1. Buka [Google Sheets](https://sheets.google.com)
2. Buat 2 spreadsheet baru:
   - `Surat Masuk SKRP GET`
   - `Surat Keluar SKRP GET`
3. Catat ID dari URL setiap spreadsheet

#### 4.2 Buat Google Apps Script
1. Buka [Google Apps Script](https://script.google.com)
2. Buat projek baru
3. Salin kod dari `google-apps-script.gs`
4. Ganti ID spreadsheet dalam kod
5. Deploy sebagai Web App
6. Catat URL Web App

#### 4.3 Buat Google Drive Folder
1. Buka [Google Drive](https://drive.google.com)
2. Buat folder baru: `EDAFTAR SURAT SKRP GET - Files`
3. Catat ID folder dari URL

#### 4.4 Kemaskini Konfigurasi
1. Buka `config.js` dan ganti URL Google Apps Script
2. Buka `google-apps-script.gs` dan ganti ID spreadsheet dan folder

### Langkah 5: Test Aplikasi (3 minit)

#### 5.1 Jalankan Aplikasi
```bash
# Jalankan melalui web server
python -m http.server 8000
# Buka http://localhost:8000
```

#### 5.2 Test Fungsi
1. Pilih pengguna "Guru Besar"
2. Klik "Tambah Surat Baru"
3. Isi maklumat surat
4. Klik "Simpan"
5. Periksa sama ada data tersimpan

### Checklist Cepat

- [ ] URL Google Apps Script diisi dalam `config.js`
- [ ] ID spreadsheet diisi dalam `google-apps-script.gs`
- [ ] ID folder Google Drive diisi dalam `google-apps-script.gs`
- [ ] Google Apps Script di-deploy sebagai Web App
- [ ] Access di-set kepada "Anyone"
- [ ] Aplikasi dijalankan melalui web server
- [ ] Test API dalam console berjaya
- [ ] Test tambah surat berjaya

### Jika Masih Bermasalah

1. **Periksa Console Browser** - Lihat error yang muncul
2. **Periksa Google Apps Script Logs** - Lihat error di backend
3. **Test API Secara Langsung** - Pastikan API berfungsi
4. **Rujuk SETUP.md** - Panduan setup lengkap

---

**PENTING**: Pastikan semua ID dan URL dikemaskini dengan betul sebelum test!
