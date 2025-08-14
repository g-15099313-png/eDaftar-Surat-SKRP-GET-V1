// ========== eDaftar-Surat-SKRP-GET-V1 (Frontend) ==========
// Patch: tarik data dari Google Sheets via Google Apps Script + betulkan formatDate
// Pastikan file ini dimuat selepas config.js di index.html

// Global Variables
let currentUser = 'Guru Besar';
let currentTab = 'surat-masuk';
let suratMasukData = [];
let suratKeluarData = [];
let editingSuratId = null;

// Google Apps Script Integration
const GOOGLE_APPS_SCRIPT_URL = CONFIG?.GOOGLE_APPS_SCRIPT_URL;

// --------------- Helpers ringkas ---------------
function validateConfig() {
    return typeof CONFIG !== 'undefined' && !!CONFIG.GOOGLE_APPS_SCRIPT_URL;
}

function safeJSON(res) {
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return Promise.reject(new Error('Response bukan JSON'));
    return res.json();
}

// --------------- Initialize the application ---------------
document.addEventListener('DOMContentLoaded', function() {
    if (!validateConfig()) {
        showNotification('Konfigurasi tidak lengkap. Sila periksa config.js', 'error');
        return;
    }

    initializeApp();
    // Gantikan loadSampleData() dengan tarik data sebenar
    loadDataFromGoogleAppsScript();
});

function initializeApp() {
    // User selection
    document.querySelectorAll('.user-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentUser = this.dataset.user;
            updateCurrentUser();
            updateUserButtons();
            loadData();
        });
    });

    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentTab = this.dataset.tab;
            updateTabs();
            loadData();
        });
    });

    // Add surat buttons
    document.getElementById('addSuratMasukBtn')?.addEventListener('click', () => openSuratModal('surat-masuk'));
    document.getElementById('addSuratKeluarBtn')?.addEventListener('click', () => openSuratModal('surat-keluar'));

    // Search and filter
    document.getElementById('searchSuratMasuk')?.addEventListener('input', filterSuratMasuk);
    document.getElementById('searchSuratKeluar')?.addEventListener('input', filterSuratKeluar);
    document.getElementById('filterStatusSuratMasuk')?.addEventListener('change', filterSuratMasuk);
    document.getElementById('filterStatusSuratKeluar')?.addEventListener('change', filterSuratKeluar);

    // Modal events
    document.getElementById('suratForm')?.addEventListener('submit', handleSuratSubmit);
    document.querySelector('.close')?.addEventListener('click', closeModal);
    document.getElementById('logoutBtn')?.addEventListener('click', logout);

    // Upload modal events
    document.getElementById('uploadArea')?.addEventListener('click', () => document.getElementById('fileInput').click());
    document.getElementById('fileInput')?.addEventListener('change', handleFileSelect);
    document.getElementById('uploadArea')?.addEventListener('dragover', handleDragOver);
    document.getElementById('uploadArea')?.addEventListener('drop', handleDrop);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList?.contains('modal')) {
            closeModal();
            closeUploadModal();
        }
    });
}

// --------------- User Management ---------------
function updateCurrentUser() {
    const el = document.getElementById('currentUser');
    if (el) el.textContent = currentUser;
}

function updateUserButtons() {
    document.querySelectorAll('.user-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.user === currentUser) {
            btn.classList.add('active');
        }
    });
}

// --------------- Tab Management ---------------
function updateTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === currentTab) {
            btn.classList.add('active');
        }
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === currentTab) {
            content.classList.add('active');
        }
    });
}

// --------------- Data Loader (NEW) ---------------
async function loadDataFromGoogleAppsScript() {
    try {
        const res = await fetch(GOOGLE_APPS_SCRIPT_URL, { cache: 'no-store' });
        const data = await safeJSON(res);

        if (!data.success) {
            showNotification('Gagal memuatkan data dari Google Sheets', 'error');
            return;
        }

        // data.suratMasuk / data.suratKeluar adalah array baris (tanpa header)
        suratMasukData = (data.suratMasuk || []).map(row => ({
            id: row[0],
            noRujukan: row[1],
            tarikhTerima: row[2],
            pengirim: row[3],
            subjek: row[4],
            status: row[5],
            tindakanSiapa: row[6],
            failSurat: row[7] || null
        }));

        suratKeluarData = (data.suratKeluar || []).map(row => ({
            id: row[0],
            noRujukan: row[1],
            tarikhTerima: row[2],
            pengirim: row[3],
            subjek: row[4],
            status: row[5],
            tindakanSiapa: row[6],
            failSurat: row[7] || null
        }));

        loadData();
    } catch (err) {
        console.error('Load data error:', err);
        showNotification('Ralat memuatkan data', 'error');
    }
}

// --------------- Table Rendering ---------------
function loadData() {
    if (currentTab === 'surat-masuk') {
        renderSuratMasukTable();
    } else {
        renderSuratKeluarTable();
    }
}

function renderSuratMasukTable() {
    const tbody = document.getElementById('suratMasukTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (suratMasukData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>Tiada Surat Masuk</h3>
                        <p>Belum ada surat masuk yang direkodkan</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    suratMasukData.forEach(surat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${surat.noRujukan ?? '-'}</td>
            <td>${formatDateSafe(surat.tarikhTerima)}</td>
            <td>${surat.pengirim ?? '-'}</td>
            <td>${surat.subjek ?? '-'}</td>
            <td><span class="status-badge status-${getStatusClassSafe(surat.status)}">${surat.status ?? '-'}</span></td>
            <td>${surat.tindakanSiapa ?? '-'}</td>
            <td>
                ${surat.failSurat ? 
                    `<button class="btn-view" onclick="viewFile('${surat.failSurat}')">
                        <i class="fas fa-eye"></i> Lihat
                    </button>` :
                    `<button class="btn-upload" onclick="openUploadModal(${surat.id})">
                        <i class="fas fa-upload"></i> Muat Naik
                    </button>`
                }
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editSurat(${surat.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteSurat(${surat.id})">
                        <i class="fas fa-trash"></i> Padam
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderSuratKeluarTable() {
    const tbody = document.getElementById('suratKeluarTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (suratKeluarData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty-state">
                        <i class="fas fa-paper-plane"></i>
                        <h3>Tiada Surat Keluar</h3>
                        <p>Belum ada surat keluar yang direkodkan</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    suratKeluarData.forEach(surat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${surat.noRujukan ?? '-'}</td>
            <td>${formatDateSafe(surat.tarikhTerima)}</td>
            <td>${surat.pengirim ?? '-'}</td>
            <td>${surat.subjek ?? '-'}</td>
            <td><span class="status-badge status-${getStatusClassSafe(surat.status)}">${surat.status ?? '-'}</span></td>
            <td>${surat.tindakanSiapa ?? '-'}</td>
            <td>
                ${surat.failSurat ? 
                    `<button class="btn-view" onclick="viewFile('${surat.failSurat}')">
                        <i class="fas fa-eye"></i> Lihat
                    </button>` :
                    `<button class="btn-upload" onclick="openUploadModal(${surat.id})">
                        <i class="fas fa-upload"></i> Muat Naik
                    </button>`
                }
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editSurat(${surat.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteSurat(${surat.id})">
                        <i class="fas fa-trash"></i> Padam
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// --------------- Filtering ---------------
function filterSuratMasuk() {
    const searchTerm = (document.getElementById('searchSuratMasuk')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('filterStatusSuratMasuk')?.value || '';

    const filteredData = suratMasukData.filter(surat => {
        const matchesSearch = (surat.noRujukan || '').toLowerCase().includes(searchTerm) ||
                            (surat.pengirim || '').toLowerCase().includes(searchTerm) ||
                            (surat.subjek || '').toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || surat.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    renderFilteredTable('suratMasukTableBody', filteredData);
}

function filterSuratKeluar() {
    const searchTerm = (document.getElementById('searchSuratKeluar')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('filterStatusSuratKeluar')?.value || '';

    const filteredData = suratKeluarData.filter(surat => {
        const matchesSearch = (surat.noRujukan || '').toLowerCase().includes(searchTerm) ||
                            (surat.pengirim || '').toLowerCase().includes(searchTerm) ||
                            (surat.subjek || '').toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || surat.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    renderFilteredTable('suratKeluarTableBody', filteredData);
}

function renderFilteredTable(tbodyId, data) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>Tiada Hasil</h3>
                        <p>Tidak ada surat yang sepadan dengan carian anda</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(surat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${surat.noRujukan ?? '-'}</td>
            <td>${formatDateSafe(surat.tarikhTerima)}</td>
            <td>${surat.pengirim ?? '-'}</td>
            <td>${surat.subjek ?? '-'}</td>
            <td><span class="status-badge status-${getStatusClassSafe(surat.status)}">${surat.status ?? '-'}</span></td>
            <td>${surat.tindakanSiapa ?? '-'}</td>
            <td>
                ${surat.failSurat ? 
                    `<button class="btn-view" onclick="viewFile('${surat.failSurat}')">
                        <i class="fas fa-eye"></i> Lihat
                    </button>` :
                    `<button class="btn-upload" onclick="openUploadModal(${surat.id})">
                        <i class="fas fa-upload"></i> Muat Naik
                    </button>`
                }
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editSurat(${surat.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteSurat(${surat.id})">
                        <i class="fas fa-trash"></i> Padam
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// --------------- Modal Management ---------------
function openSuratModal(type) {
    editingSuratId = null;
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('suratForm');
    const statusSelect = document.getElementById('status');
    const modal = document.getElementById('suratModal');

    if (modalTitle) modalTitle.textContent = 'Tambah Surat Baru';
    form?.reset();
    if (modal) modal.style.display = 'block';

    if (statusSelect) {
        statusSelect.innerHTML = '';
        if (type === 'surat-masuk') {
            statusSelect.innerHTML = `
                <option value="Baru">Baru</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Selesai">Selesai</option>
                <option value="Tolak">Tolak</option>
            `;
        } else {
            statusSelect.innerHTML = `
                <option value="Draf">Draf</option>
                <option value="Hantar">Hantar</option>
                <option value="Selesai">Selesai</option>
            `;
        }
    }
}

function closeModal() {
    const modal = document.getElementById('suratModal');
    if (modal) modal.style.display = 'none';
    editingSuratId = null;
}

function openUploadModal(suratId) {
    window.currentUploadSuratId = suratId;
    const modal = document.getElementById('uploadModal');
    if (modal) modal.style.display = 'block';
}

function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) modal.style.display = 'none';
    const inp = document.getElementById('fileInput');
    if (inp) inp.value = '';
    window.currentUploadSuratId = null;
}

// --------------- Form Handling ---------------
function handleSuratSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const suratData = {
        noRujukan: formData.get('noRujukan'),
        tarikhTerima: formData.get('tarikhTerima'),
        pengirim: formData.get('pengirim'),
        subjek: formData.get('subjek'),
        status: formData.get('status'),
        tindakanSiapa: formData.get('tindakanSiapa'),
        failSurat: null
    };

    if (editingSuratId) {
        updateSurat(editingSuratId, suratData);
    } else {
        addSurat(suratData);
    }

    closeModal();
}

function addSurat(suratData) {
    if (typeof hasPermission === 'function' && !hasPermission(currentUser, 'add')) {
        showNotification('Anda tidak mempunyai kebenaran untuk menambah surat', 'error');
        return;
    }

    const sourceArray = currentTab === 'surat-masuk' ? suratMasukData : suratKeluarData;
    const newId = Math.max(...(sourceArray.map(s => Number(s.id) || 0)), 0) + 1;
    suratData.id = newId;

    if (currentTab === 'surat-masuk') {
        suratMasukData.push(suratData);
    } else {
        suratKeluarData.push(suratData);
    }

    // Simpan ke Google Apps Script
    saveToGoogleAppsScript(suratData, 'add');

    loadData();
    showNotification('Surat berjaya ditambah!', 'success');
}

function editSurat(suratId) {
    const data = currentTab === 'surat-masuk' ? suratMasukData : suratKeluarData;
    const surat = data.find(s => String(s.id) === String(suratId));

    if (surat) {
        editingSuratId = suratId;
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) modalTitle.textContent = 'Edit Surat';

        document.getElementById('noRujukan')?.setAttribute('value', surat.noRujukan || '');
        const noR = document.getElementById('noRujukan'); if (noR) noR.value = surat.noRujukan || '';
        const tt = document.getElementById('tarikhTerima'); if (tt) tt.value = surat.tarikhTerima || '';
        const pg = document.getElementById('pengirim'); if (pg) pg.value = surat.pengirim || '';
        const sb = document.getElementById('subjek'); if (sb) sb.value = surat.subjek || '';
        const st = document.getElementById('status'); if (st) st.value = surat.status || '';
        const ts = document.getElementById('tindakanSiapa'); if (ts) ts.value = surat.tindakanSiapa || '';

        const modal = document.getElementById('suratModal');
        if (modal) modal.style.display = 'block';
    }
}

function updateSurat(suratId, suratData) {
    if (typeof hasPermission === 'function' && !hasPermission(currentUser, 'update')) {
        showNotification('Anda tidak mempunyai kebenaran untuk mengemaskini surat', 'error');
        return;
    }

    const data = currentTab === 'surat-masuk' ? suratMasukData : suratKeluarData;
    const index = data.findIndex(s => String(s.id) === String(suratId));

    if (index !== -1) {
        suratData.id = suratId;
        suratData.failSurat = data[index].failSurat;
        data[index] = suratData;

        saveToGoogleAppsScript(suratData, 'update');

        loadData();
        showNotification('Surat berjaya dikemaskini!', 'success');
    }
}

function deleteSurat(suratId) {
    if (typeof hasPermission === 'function' && !hasPermission(currentUser, 'delete')) {
        showNotification('Anda tidak mempunyai kebenaran untuk memadamkan surat', 'error');
        return;
    }

    if (confirm('Adakah anda pasti mahu memadamkan surat ini?')) {
        const data = currentTab === 'surat-masuk' ? suratMasukData : suratKeluarData;
        const surat = data.find(s => String(s.id) === String(suratId));

        if (surat) {
            saveToGoogleAppsScript(surat, 'delete');
            const index = data.findIndex(s => String(s.id) === String(suratId));
            data.splice(index, 1);
            loadData();
            showNotification('Surat berjaya dipadamkan!', 'success');
        }
    }
}

// --------------- File Upload Handling ---------------
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) handleFileUpload(file);
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.style.borderColor = '#5a6fd8';
    event.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
}

function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleFileUpload(file);
    event.currentTarget.style.borderColor = '#667eea';
    event.currentTarget.style.background = 'transparent';
}

function handleFileUpload(file) {
    if (typeof validateFile === 'function') {
        const validation = validateFile(file);
        if (!validation.valid) {
            showNotification(validation.message, 'error'); return;
        }
    }
    uploadFileToGoogleAppsScript(file);
}

function uploadFileToGoogleAppsScript(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('suratId', window.currentUploadSuratId);
    formData.append('action', 'upload');

    const uploadBtn = document.querySelector('.upload-actions .btn-primary');
    const originalText = uploadBtn ? uploadBtn.innerHTML : null;
    if (uploadBtn) { uploadBtn.innerHTML = '<span class="loading"></span> Memuat Naik...'; uploadBtn.disabled = true; }

    fetch(GOOGLE_APPS_SCRIPT_URL, { method: 'POST', body: formData })
    .then(res => safeJSON(res))
    .then(data => {
        if (data.success) {
            const dataArray = currentTab === 'surat-masuk' ? suratMasukData : suratKeluarData;
            const surat = dataArray.find(s => String(s.id) === String(window.currentUploadSuratId));
            if (surat) {
                surat.failSurat = data.filename;
                loadData();
                showNotification('Fail berjaya dimuat naik!', 'success');
                closeUploadModal();
            }
            // Tarik semula data untuk sync
            loadDataFromGoogleAppsScript();
        } else {
            showNotification('Gagal memuat naik fail: ' + (data.error || 'Tidak diketahui'), 'error');
        }
    })
    .catch(error => {
        console.error('Upload error:', error);
        showNotification('Ralat semasa memuat naik fail', 'error');
    })
    .finally(() => {
        if (uploadBtn && originalText !== null) { uploadBtn.innerHTML = originalText; uploadBtn.disabled = false; }
    });
}

// --------------- Google Apps Script Integration (save) ---------------
function saveToGoogleAppsScript(suratData, action) {
    const payload = {
        action: action,
        suratType: currentTab, // 'surat-masuk' atau 'surat-keluar'
        suratData: suratData,
        user: currentUser,
        timestamp: new Date().toISOString()
    };

    fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => safeJSON(res))
    .then(data => {
        if (!data.success) {
            console.error('Google Apps Script error:', data.error);
            showNotification('Gagal menyimpan ke Google Sheets', 'error');
        } else {
            // Selepas simpan, tarik balik data sebenar
            loadDataFromGoogleAppsScript();
        }
    })
    .catch(error => {
        console.error('Error saving to Google Apps Script:', error);
        showNotification('Ralat semasa menyimpan data', 'error');
    });
}

// --------------- Utility Functions ---------------
function formatDateSafe(dateString) {
    // Elak infinite recursion bug: fungsi lama memanggil nama yang sama
    if (!dateString) return '-';
    // Jika sudah format YYYY-MM-DD, terus pulangkan
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) return dateString;
    // Cuba parse tarikh lain
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
}

function getStatusClassSafe(status) {
    try {
        if (typeof getStatusConfig === 'function') {
            const statusConfig = getStatusConfig(currentTab, status);
            return String(statusConfig.value || status || '').toLowerCase().replace(/\s+/g, '-');
        }
        return String(status || '').toLowerCase().replace(/\s+/g, '-');
    } catch {
        return String(status || '').toLowerCase().replace(/\s+/g, '-');
    }
}

function viewFile(filename) {
    // Jika apps script pulangkan gDrive fileId, gunakan view url standard
    const fileUrl = `https://drive.google.com/file/d/${filename}/view`;
    window.open(fileUrl, '_blank');
}

function showNotification(message, type = 'info') {
    // Notifikasi ringkas; boleh ganti dengan komponen UI anda
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: ${type === 'success' ? '#00b894' : type === 'error' ? '#ff4757' : '#667eea'};
        color: white; padding: 15px 20px; border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 10000; display: flex; gap: 10px;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, (CONFIG.UI_CONFIG?.notificationDuration) || 3000);
}

function logout() {
    if (confirm('Adakah anda pasti mahu log keluar?')) {
        localStorage.clear();
        alert('Anda telah log keluar. Sila log masuk semula.'); location.reload();
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
`;
document.head.appendChild(style);
