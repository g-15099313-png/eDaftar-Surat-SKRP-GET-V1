# ⚡ PENYELESAIAN CEPAT: MAKLUMAT TIDAK BOLEH DISIMPAN

## 🚨 Masalah: Maklumat tidak boleh disimpan

### ✅ Langkah 1: Periksa config.js
Buka `config.js` dan pastikan URL Google Apps Script diisi:
```javascript
GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
```

### ✅ Langkah 2: Periksa google-apps-script.gs
Buka `google-apps-script.gs` dan pastikan ID spreadsheet diisi:
```javascript
const SURAT_MASUK_SHEET_ID = 'YOUR_SPREADSHEET_ID';
const SURAT_KELUAR_SHEET_ID = 'YOUR_SPREADSHEET_ID';
const FILES_FOLDER_ID = 'YOUR_FOLDER_ID';
```

### ✅ Langkah 3: Test API
1. Buka aplikasi dalam browser
2. Tekan F12 → Console
3. Jalankan kod ini:

```javascript
fetch(CONFIG.GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
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
    if (data.success) {
        alert('✅ Berjaya!');
    } else {
        alert('❌ Error: ' + data.message);
    }
})
.catch(error => alert('❌ Error: ' + error.message));
```

### 🔧 Jika Masih Error:

#### Error "Konfigurasi tidak lengkap"
- Pastikan URL Google Apps Script diisi dalam `config.js`

#### Error "Failed to fetch"
- Pastikan Google Apps Script di-deploy sebagai Web App
- Pastikan access di-set kepada "Anyone"

#### Error "Spreadsheet not found"
- Pastikan ID spreadsheet betul dalam `google-apps-script.gs`
- Pastikan spreadsheet wujud dan boleh diakses

#### Error "CORS policy"
- Jalankan aplikasi melalui web server: `python -m http.server 8000`

### 📋 Checklist Cepat:
- [ ] URL Google Apps Script diisi
- [ ] ID spreadsheet diisi
- [ ] Google Apps Script di-deploy
- [ ] Access di-set "Anyone"
- [ ] Aplikasi dijalankan melalui web server

---

**Rujuk `SETUP.md` untuk panduan lengkap!**
