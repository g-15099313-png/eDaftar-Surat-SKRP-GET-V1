# EDAFTAR SURAT SKRP GET

Aplikasi pengurusan surat digital untuk Sekolah Kebangsaan SKRP GET dengan integrasi Google Apps Script.

## 📋 Ciri-ciri Utama

### 🎯 Fungsi Asas
- **Surat Masuk**: Pengurusan surat yang diterima
- **Surat Keluar**: Pengurusan surat yang dihantar
- **Muat Naik Fail**: Sokongan untuk fail PDF dan Word
- **Carian & Penapis**: Cari dan filter surat dengan mudah
- **Status Pengurusan**: Jejak status surat dari mula hingga selesai

### 👥 Pengguna Sistem
- **Guru Besar**: Akses penuh ke semua fungsi
- **GPKP**: Pengurusan kurikulum dan akademik
- **GPKHEM**: Pengurusan hal ehwal murid
- **GPKKO**: Pengurusan kokurikulum
- **PT**: Penolong Tadbir
- **PO**: Penolong Operasi

### 📊 Maklumat Surat
- No. Rujukan
- Tarikh Terima
- Pengirim
- Subjek
- Status
- Tindakan Siapa
- Muat Naik Surat
- Tindakan (Edit/Padam/Lihat)

## 🚀 Pemasangan

### 1. Persediaan Google Apps Script

#### Langkah 1: Buat Google Spreadsheet
1. Buka [Google Sheets](https://sheets.google.com)
2. Buat 2 spreadsheet baru:
   - `Surat Masuk SKRP GET`
   - `Surat Keluar SKRP GET`
3. Catat ID spreadsheet dari URL

#### Langkah 2: Buat Google Apps Script
1. Buka [Google Apps Script](https://script.google.com)
2. Buat projek baru
3. Salin kod dari `google-apps-script.gs`
4. Ganti ID spreadsheet dalam kod:
   ```javascript
   const SURAT_MASUK_SHEET_ID = 'YOUR_SURAT_MASUK_SPREADSHEET_ID';
   const SURAT_KELUAR_SHEET_ID = 'YOUR_SURAT_KELUAR_SPREADSHEET_ID';
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

### 2. Persediaan Frontend

#### Langkah 1: Muat Turun Fail
```bash
git clone [repository-url]
cd eDSKRPget
```

#### Langkah 2: Konfigurasi
1. Buka `script.js`
2. Ganti URL Google Apps Script:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
   ```

#### Langkah 3: Jalankan Aplikasi
1. Buka `index.html` dalam pelayar web
2. Atau gunakan server tempatan:
   ```bash
   python -m http.server 8000
   # Buka http://localhost:8000
   ```

## 📁 Struktur Fail

```
eDSKRPget/
├── index.html          # Antara muka utama
├── styles.css          # Styling dan reka bentuk
├── script.js           # Logik aplikasi
├── google-apps-script.gs # Backend Google Apps Script
└── README.md           # Dokumentasi
```

## 🎨 Reka Bentuk

### Warna Tema
- **Utama**: `#667eea` (Biru)
- **Sekunder**: `#764ba2` (Ungu)
- **Kejayaan**: `#00b894` (Hijau)
- **Amaran**: `#fdcb6e` (Kuning)
- **Ralat**: `#ff4757` (Merah)

### Responsif
- Desktop: 1400px max-width
- Tablet: 768px breakpoint
- Mobile: 480px breakpoint

## 🔧 Fungsi Teknikal

### Frontend (JavaScript)
- **User Management**: Pengurusan pengguna dan kebenaran
- **Data Management**: CRUD operasi untuk surat
- **File Upload**: Muat naik fail dengan drag & drop
- **Search & Filter**: Cari dan filter data secara real-time
- **Modal Management**: Antara muka untuk tambah/edit surat

### Backend (Google Apps Script)
- **doPost()**: Handle HTTP POST requests
- **doGet()**: Handle HTTP GET requests
- **addSurat()**: Tambah surat baru
- **updateSurat()**: Kemaskini surat sedia ada
- **deleteSurat()**: Padam surat
- **uploadFile()**: Muat naik fail ke Google Drive
- **logActivity()**: Log aktiviti pengguna

## 📊 Struktur Data

### Surat Masuk
| Kolum | Jenis | Penerangan |
|-------|-------|------------|
| ID | Integer | ID unik surat |
| No. Rujukan | String | Nombor rujukan surat |
| Tarikh Terima | Date | Tarikh surat diterima |
| Pengirim | String | Sumber surat |
| Subjek | String | Tajuk surat |
| Status | String | Baru/Dalam Proses/Selesai/Tolak |
| Tindakan Siapa | String | Pengguna bertanggungjawab |
| Fail Surat | String | ID fail Google Drive |
| Dicipta Oleh | String | Pengguna yang menambah |
| Dicipta Pada | DateTime | Masa dicipta |

### Surat Keluar
| Kolum | Jenis | Penerangan |
|-------|-------|------------|
| ID | Integer | ID unik surat |
| No. Rujukan | String | Nombor rujukan surat |
| Tarikh Terima | Date | Tarikh surat dibuat |
| Pengirim | String | SKRP GET |
| Subjek | String | Tajuk surat |
| Status | String | Draf/Hantar/Selesai |
| Tindakan Siapa | String | Pengguna bertanggungjawab |
| Fail Surat | String | ID fail Google Drive |
| Dicipta Oleh | String | Pengguna yang menambah |
| Dicipta Pada | DateTime | Masa dicipta |

## 🔐 Kebenaran Pengguna

| Pengguna | Tambah | Edit | Padam | Lihat | Muat Naik |
|----------|--------|------|-------|-------|-----------|
| Guru Besar | ✅ | ✅ | ✅ | ✅ | ✅ |
| GPKP | ✅ | ✅ | ❌ | ✅ | ✅ |
| GPKHEM | ✅ | ✅ | ❌ | ✅ | ✅ |
| GPKKO | ✅ | ✅ | ❌ | ✅ | ✅ |
| PT | ✅ | ❌ | ❌ | ✅ | ✅ |
| PO | ❌ | ❌ | ❌ | ✅ | ✅ |

## 📱 Penggunaan

### 1. Log Masuk
- Pilih pengguna dari butang yang tersedia
- Sistem akan menyesuaikan kebenaran mengikut peranan

### 2. Tambah Surat Baru
1. Klik "Tambah Surat Baru"
2. Isi maklumat yang diperlukan
3. Klik "Simpan"

### 3. Muat Naik Fail
1. Klik butang "Muat Naik" pada baris surat
2. Seret fail atau klik untuk memilih
3. Fail akan disimpan di Google Drive

### 4. Cari & Filter
- Gunakan kotak carian untuk mencari surat
- Gunakan dropdown status untuk filter

### 5. Edit/Padam
- Klik butang "Edit" untuk mengubah surat
- Klik butang "Padam" untuk memadamkan surat

## 🛠️ Penyelenggaraan

### Backup Data
```javascript
// Jalankan dalam Google Apps Script
function backupData() {
  // Kod backup automatik
}
```

### Log Aktiviti
Semua aktiviti pengguna direkodkan dalam sheet "ActivityLog":
- Timestamp
- Action (ADD/UPDATE/DELETE/UPLOAD)
- User
- Details
- SuratType

### Kemaskini Sistem
1. Backup data sedia ada
2. Kemaskini fail frontend
3. Kemaskini Google Apps Script
4. Test fungsi-fungsi utama

## 🐛 Penyelesaian Masalah

### Masalah: Maklumat tidak boleh disimpan

#### Punca 1: Konfigurasi tidak lengkap
**Gejala**: Mesej "Konfigurasi tidak lengkap" muncul
**Penyelesaian**:
1. Pastikan URL Google Apps Script diisi dalam `config.js`
2. Pastikan ID spreadsheet diisi dalam `google-apps-script.gs`
3. Rujuk `SETUP.md` untuk panduan lengkap

#### Punca 2: Google Apps Script tidak di-deploy
**Gejala**: Error "Failed to fetch" atau "Network error"
**Penyelesaian**:
1. Pastikan Google Apps Script di-deploy sebagai Web App
2. Pastikan access di-set kepada "Anyone"
3. Periksa URL Web App betul

#### Punca 3: ID Spreadsheet tidak betul
**Gejala**: Error "Spreadsheet not found" atau data tidak tersimpan
**Penyelesaian**:
1. Periksa ID spreadsheet dalam `google-apps-script.gs`
2. Pastikan spreadsheet wujud dan boleh diakses
3. Pastikan Google Apps Script mempunyai kebenaran

#### Punca 4: CORS Error
**Gejala**: Error "CORS policy" dalam console
**Penyelesaian**:
1. Jalankan aplikasi melalui web server (bukan file://)
2. Gunakan extension Live Server di VS Code
3. Atau jalankan: `python -m http.server 8000`

### Masalah: Fail tidak dapat dimuat naik

#### Punca 1: ID Folder Google Drive tidak betul
**Gejala**: Error "Folder not found" atau fail tidak tersimpan
**Penyelesaian**:
1. Periksa ID folder dalam `google-apps-script.gs`
2. Pastikan folder wujud dan boleh diakses
3. Pastikan Google Apps Script mempunyai kebenaran

#### Punca 2: Saiz fail terlalu besar
**Gejala**: Error "File too large"
**Penyelesaian**:
1. Pastikan fail tidak melebihi 5MB
2. Gunakan format fail yang dibenarkan (PDF, DOC, DOCX)

#### Punca 3: Format fail tidak dibenarkan
**Gejala**: Error "File type not allowed"
**Penyelesaian**:
1. Pastikan fail dalam format PDF, DOC, atau DOCX
2. Periksa extension fail

### Masalah: Antara muka tidak responsif

#### Punca 1: Fail tidak dimuat dengan betul
**Gejala**: Antara muka rosak atau tidak berfungsi
**Penyelesaian**:
1. Periksa console browser (F12) untuk error
2. Pastikan semua fail (HTML, CSS, JS) dimuat
3. Cuba refresh halaman

#### Punca 2: JavaScript error
**Gejala**: Fungsi tidak berfungsi atau error dalam console
**Penyelesaian**:
1. Buka Developer Tools (F12)
2. Lihat tab Console untuk error
3. Periksa tab Network untuk masalah API

### Debugging Langkah demi Langkah

#### Langkah 1: Periksa Console Browser
1. Buka Developer Tools (F12)
2. Lihat tab Console untuk error
3. Lihat tab Network untuk masalah API

#### Langkah 2: Periksa Google Apps Script Logs
1. Buka Google Apps Script
2. Klik "Executions" untuk lihat log
3. Periksa error yang berlaku

#### Langkah 3: Test API Secara Langsung
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

### Checklist Penyelesaian Masalah

- [ ] URL Google Apps Script betul dalam `config.js`
- [ ] ID spreadsheet betul dalam `google-apps-script.gs`
- [ ] ID folder Google Drive betul dalam `google-apps-script.gs`
- [ ] Google Apps Script di-deploy sebagai Web App
- [ ] Access di-set kepada "Anyone"
- [ ] Aplikasi dijalankan melalui web server
- [ ] Console browser tidak menunjukkan error
- [ ] Google Apps Script logs tidak menunjukkan error

## 📞 Sokongan

Untuk bantuan teknikal atau pertanyaan:
- Email: [your-email@domain.com]
- Telefon: [your-phone-number]
- Dokumentasi: [link-to-docs]

## 📄 Lesen

Projek ini dibangunkan untuk kegunaan dalaman SKRP GET.
© 2024 SKRP GET. Hak cipta terpelihara.

## 🔄 Versi

**v1.0.0** (Januari 2024)
- Pelancaran awal
- Fungsi asas CRUD
- Integrasi Google Apps Script
- Antara muka responsif
- Sistem kebenaran pengguna

---

**Dibangunkan dengan ❤️ untuk SKRP GET**

