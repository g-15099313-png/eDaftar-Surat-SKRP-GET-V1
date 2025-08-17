// Konfigurasi Aplikasi EDAFTAR SURAT SKRP GET
// Ganti nilai-nilai ini dengan maklumat anda sendiri

const CONFIG = {
    // Google Apps Script Web App URL
    // Ganti dengan URL yang anda dapat selepas deploy Google Apps Script
    GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbynhC3BmxyDbhxUgHnd3xQzF8LgNxii6Nh06bCwekon13gt5YFb9WLoYQJ0t8Zva5dtcA/exec',
    
    // Maklumat Sekolah
    SCHOOL_INFO: {
        name: 'SEKOLAH KEBANGSAAN RANTAU PANJANG',
        address: '17200 RANTAU PANJANG,KELANTAN',
        phone: '09-7950258',
        email: 'dba3227@moe.edu.my',
        website: 'https://bit.ly/skrpget'
    },
    
    // Konfigurasi Pengguna
    USERS: {
        'Guru Besar': {
            icon: 'fas fa-user-tie',
            permissions: ['add', 'update', 'delete', 'view', 'upload'],
            color: '#667eea'
        },
        'GPKP': {
            icon: 'fas fa-user-graduate',
            permissions: ['add', 'update', 'view', 'upload'],
            color: '#74b9ff'
        },
        'GPKHEM': {
            icon: 'fas fa-user-cog',
            permissions: ['add', 'update', 'view', 'upload'],
            color: '#00b894'
        },
        'GPKKO': {
            icon: 'fas fa-user-shield',
            permissions: ['add', 'update', 'view', 'upload'],
            color: '#fdcb6e'
        },
        'PT': {
            icon: 'fas fa-user',
            permissions: ['add', 'view', 'upload'],
            color: '#a29bfe'
        },
        'PO': {
            icon: 'fas fa-user-friends',
            permissions: ['view', 'upload'],
            color: '#fd79a8'
        }
    },
    
    // Status Surat Masuk
    SURAT_MASUK_STATUS: [
        { value: 'Baru', label: 'Baru', color: '#ffeaa7', textColor: '#d63031' },
        { value: 'Dalam Proses', label: 'Dalam Proses', color: '#74b9ff', textColor: 'white' },
        { value: 'Selesai', label: 'Selesai', color: '#00b894', textColor: 'white' },
        { value: 'Tolak', label: 'Tolak', color: '#fd79a8', textColor: 'white' }
    ],
    
    // Status Surat Keluar
    SURAT_KELUAR_STATUS: [
        { value: 'Draf', label: 'Draf', color: '#a29bfe', textColor: 'white' },
        { value: 'Hantar', label: 'Hantar', color: '#fdcb6e', textColor: '#2d3436' },
        { value: 'Selesai', label: 'Selesai', color: '#00b894', textColor: 'white' }
    ],
    
    // Konfigurasi Fail
    FILE_CONFIG: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        allowedExtensions: ['.pdf', '.doc', '.docx']
    },
    
    // Konfigurasi Antara Muka
    UI_CONFIG: {
        itemsPerPage: 10,
        autoRefreshInterval: 30000, // 30 saat
        notificationDuration: 3000, // 3 saat
        dateFormat: 'dd/MM/yyyy',
        timeFormat: 'HH:mm:ss'
    },
    
    // Konfigurasi API
    API_CONFIG: {
        timeout: 30000, // 30 saat
        retryAttempts: 3,
        retryDelay: 1000 // 1 saat
    },
    
    // Konfigurasi Keselamatan
    SECURITY_CONFIG: {
        sessionTimeout: 30 * 60 * 1000, // 30 minit
        maxLoginAttempts: 3,
        lockoutDuration: 15 * 60 * 1000 // 15 minit
    },
    
    // Konfigurasi Backup
    BACKUP_CONFIG: {
        autoBackup: true,
        backupInterval: 24 * 60 * 60 * 1000, // 24 jam
        keepBackups: 7 // Simpan 7 backup terakhir
    },
    
    // Konfigurasi Email
    EMAIL_CONFIG: {
        enabled: false,
        smtpServer: 'smtp.gmail.com',
        smtpPort: 587,
        fromEmail: 'noreply@skrpget.edu.my',
        fromName: 'EDAFTAR SURAT SKRP GET'
    },
    
    // Konfigurasi Laporan
    REPORT_CONFIG: {
        defaultPeriod: 'month',
        exportFormats: ['pdf', 'excel', 'csv'],
        includeCharts: true,
        autoGenerate: false
    }
};

// Fungsi untuk mendapatkan konfigurasi
function getConfig(key) {
    return key.split('.').reduce((obj, k) => obj && obj[k], CONFIG);
}

// Fungsi untuk mengesahkan konfigurasi
function validateConfig() {
    const requiredFields = [
        'GOOGLE_APPS_SCRIPT_URL'
    ];
    
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!CONFIG[field] || CONFIG[field] === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
            errors.push(`Sila isi ${field} dalam config.js`);
        }
    });
    
    if (errors.length > 0) {
        console.error('Konfigurasi tidak lengkap:', errors);
        return false;
    }
    
    return true;
}

// Fungsi untuk mendapatkan kebenaran pengguna
function getUserPermissions(user) {
    const userConfig = CONFIG.USERS[user];
    return userConfig ? userConfig.permissions : [];
}

// Fungsi untuk mengesahkan kebenaran
function hasPermission(user, action) {
    const permissions = getUserPermissions(user);
    return permissions.includes(action);
}

// Fungsi untuk mendapatkan status config
function getStatusConfig(suratType, status) {
    const statusList = suratType === 'surat-masuk' ? 
        CONFIG.SURAT_MASUK_STATUS : 
        CONFIG.SURAT_KELUAR_STATUS;
    
    return statusList.find(s => s.value === status) || statusList[0];
}

// Fungsi untuk mengesahkan fail
function validateFile(file) {
    const config = CONFIG.FILE_CONFIG;
    
    // Periksa saiz
    if (file.size > config.maxSize) {
        return {
            valid: false,
            message: `Saiz fail tidak boleh melebihi ${config.maxSize / (1024 * 1024)}MB`
        };
    }
    
    // Periksa jenis fail
    if (!config.allowedTypes.includes(file.type)) {
        return {
            valid: false,
            message: `Jenis fail tidak dibenarkan. Hanya ${config.allowedExtensions.join(', ')} yang dibenarkan`
        };
    }
    
    return { valid: true };
}

// Fungsi untuk format tarikh
function formatDate(date, format = CONFIG.UI_CONFIG.dateFormat) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return format
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', year);
}

// Fungsi untuk format masa
function formatTime(date, format = CONFIG.UI_CONFIG.timeFormat) {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

// Export untuk kegunaan dalam fail lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        getConfig,
        validateConfig,
        getUserPermissions,
        hasPermission,
        getStatusConfig,
        validateFile,
        formatDate,
        formatTime
    };
}

