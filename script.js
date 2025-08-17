// Global Variables
let currentUser = 'Guru Besar';
let currentTab = 'surat-masuk';
let suratMasukData = [];
let suratKeluarData = [];
let editingSuratId = null;

// Google Apps Script Integration
const GOOGLE_APPS_SCRIPT_URL = CONFIG.GOOGLE_APPS_SCRIPT_URL;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Validate configuration first
    if (!validateConfig()) {
        showNotification('Konfigurasi tidak lengkap. Sila periksa config.js', 'error');
        return;
    }
    
    initializeApp();
    loadSampleData();
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
    document.getElementById('addSuratMasukBtn').addEventListener('click', () => openSuratModal('surat-masuk'));
    document.getElementById('addSuratKeluarBtn').addEventListener('click', () => openSuratModal('surat-keluar'));

    // Search and filter
    document.getElementById('searchSuratMasuk').addEventListener('input', filterSuratMasuk);
    document.getElementById('searchSuratKeluar').addEventListener('input', filterSuratKeluar);
    document.getElementById('filterStatusSuratMasuk').addEventListener('change', filterSuratMasuk);
    document.getElementById('filterStatusSuratKeluar').addEventListener('change', filterSuratKeluar);

    // Modal events
    document.getElementById('suratForm').addEventListener('submit', handleSuratSubmit);
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Upload modal events
    document.getElementById('uploadArea').addEventListener('click', () => document.getElementById('fileInput').click());
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    document.getElementById('uploadArea').addEventListener('dragover', handleDragOver);
    document.getElementById('uploadArea').addEventListener('drop', handleDrop);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal();
            closeUploadModal();
        }
    });
}

// User Management
function updateCurrentUser() {
    document.getElementById('currentUser').textContent = currentUser;
}

function updateUserButtons() {
    document.querySelectorAll('.user-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.user === currentUser) {
            btn.classList.add('active');
        }
    });
}

// Tab Management
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

// Data Management
function loadSampleData() {
    // Sample data for Surat Masuk
    suratMasukData = [
        {
            id: 1,
            noRujukan: 'SKRP/2024/001',
            tarikhTerima: '2024-01-15',
            pengirim: 'Jabatan Pendidikan Negeri',
            subjek: 'Pekeliling Pengurusan Sekolah 2024',
            status: 'Baru',
            tindakanSiapa: 'Guru Besar',
            failSurat: null
        },
        {
            id: 2,
            noRujukan: 'SKRP/2024/002',
            tarikhTerima: '2024-01-16',
            pengirim: 'Pejabat Pendidikan Daerah',
            subjek: 'Program Kecemerlangan Akademik',
            status: 'Dalam Proses',
            tindakanSiapa: 'GPKP',
            failSurat: 'surat_002.pdf'
        },
        {
            id: 3,
            noRujukan: 'SKRP/2024/003',
            tarikhTerima: '2024-01-17',
            pengirim: 'Kementerian Pendidikan',
            subjek: 'Garis Panduan Pengurusan Kewangan',
            status: 'Selesai',
            tindakanSiapa: 'GPKHEM',
            failSurat: 'surat_003.pdf'
        }
    ];

    // Sample data for Surat Keluar
    suratKeluarData = [
        {
            id: 1,
            noRujukan: 'SKRP/OUT/2024/001',
            tarikhTerima: '2024-01-15',
            pengirim: 'SKRP GET',
            subjek: 'Laporan Aktiviti Sekolah Bulanan',
            status: 'Hantar',
            tindakanSiapa: 'Guru Besar',
            failSurat: 'laporan_001.pdf'
        },
        {
            id: 2,
            noRujukan: 'SKRP/OUT/2024/002',
            tarikhTerima: '2024-01-16',
            pengirim: 'SKRP GET',
            subjek: 'Permohonan Peruntukan Tambahan',
            status: 'Draf',
            tindakanSiapa: 'GPKKO',
            failSurat: null
        }
    ];

    loadData();
}

function loadData() {
    if (currentTab === 'surat-masuk') {
        renderSuratMasukTable();
    } else {
        renderSuratKeluarTable();
    }
}

// Table Rendering
function renderSuratMasukTable() {
    const tbody = document.getElementById('suratMasukTableBody');
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
            <td>${surat.noRujukan}</td>
            <td>${formatDate(surat.tarikhTerima)}</td>
            <td>${surat.pengirim}</td>
            <td>${surat.subjek}</td>
            <td><span class="status-badge status-${getStatusClass(surat.status)}">${surat.status}</span></td>
            <td>${surat.tindakanSiapa}</td>
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
            <td>${surat.noRujukan}</td>
            <td>${formatDate(surat.tarikhTerima)}</td>
            <td>${surat.pengirim}</td>
            <td>${surat.subjek}</td>
            <td><span class="status-badge status-${getStatusClass(surat.status)}">${surat.status}</span></td>
            <td>${surat.tindakanSiapa}</td>
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

// Filtering
function filterSuratMasuk() {
    const searchTerm = document.getElementById('searchSuratMasuk').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatusSuratMasuk').value;
    
    const filteredData = suratMasukData.filter(surat => {
        const matchesSearch = surat.noRujukan.toLowerCase().includes(searchTerm) ||
                            surat.pengirim.toLowerCase().includes(searchTerm) ||
                            surat.subjek.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || surat.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    renderFilteredTable('suratMasukTableBody', filteredData);
}

function filterSuratKeluar() {
    const searchTerm = document.getElementById('searchSuratKeluar').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatusSuratKeluar').value;
    
    const filteredData = suratKeluarData.filter(surat => {
        const matchesSearch = surat.noRujukan.toLowerCase().includes(searchTerm) ||
                            surat.pengirim.toLowerCase().includes(searchTerm) ||
                            surat.subjek.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || surat.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    renderFilteredTable('suratKeluarTableBody', filteredData);
}

function renderFilteredTable(tbodyId, data) {
    const tbody = document.getElementById(tbodyId);
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
            <td>${surat.noRujukan}</td>
            <td>${formatDate(surat.tarikhTerima)}</td>
            <td>${surat.pengirim}</td>
            <td>${surat.subjek}</td>
            <td><span class="status-badge status-${getStatusClass(surat.status)}">${surat.status}</span></td>
            <td>${surat.tindakanSiapa}</td>
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

// Modal Management
function openSuratModal(type) {
    editingSuratId = null;
    document.getElementById('modalTitle').textContent = 'Tambah Surat Baru';
    document.getElementById('suratForm').reset();
    document.getElementById('suratModal').style.display = 'block';
    
    // Update status options based on type
    const statusSelect = document.getElementById('status');
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

function closeModal() {
    document.getElementById('suratModal').style.display = 'none';
    editingSuratId = null;
}

function openUploadModal(suratId) {
    window.currentUploadSuratId = suratId;
    document.getElementById('uploadModal').style.display = 'block';
}

function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
    document.getElementById('fileInput').value = '';
    window.currentUploadSuratId = null;
}

// Form Handling
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
        // Update existing surat
        updateSurat(editingSuratId, suratData);
    } else {
        // Add new surat
        addSurat(suratData);
    }

    closeModal();
}

function addSurat(suratData) {
    // Check user permissions
    if (!hasPermission(currentUser, 'add')) {
        showNotification('Anda tidak mempunyai kebenaran untuk menambah surat', 'error');
        return;
    }

    const newId = Math.max(...(currentTab === 'surat-masuk' ? suratMasukData : suratKeluarData).map(s => s.id), 0) + 1;
    suratData.id = newId;

    if (currentTab === 'surat-masuk') {
        suratMasukData.push(suratData);
    } else {
        suratKeluarData.push(suratData);
    }

    // Save to Google Apps Script
    saveToGoogleAppsScript(suratData, 'add');
    
    loadData();
    showNotification('Surat berjaya ditambah!', 'success');
}

function editSurat(suratId) {
    const data = currentTab === 'surat-masuk' ? suratMasukData : suratKeluarData;
    const surat = data.find(s => s.id === suratId);
    
    if (surat) {
        editingSuratId = suratId;
        document.getElementById('modalTitle').textContent = 'Edit Surat';
        
        // Fill form with existing data
        document.getElementById('noRujukan').value = surat.noRujukan;
        document.getElementById('tarikhTerima').value = surat.tarikhTerima;
        document.getElementById('pengirim').value = surat.pengirim;
        document.getElementById('subjek').value = surat.subjek;
        document.getElementById('status').value = surat.status;
        document.getElementById('tindakanSiapa').value = surat.tindakanSiapa;
        
        document.getElementById('suratModal').style.display = 'block';
    }
}

function updateSurat(suratId, suratData) {
    // Check user permissions
    if (!hasPermission(currentUser, 'update')) {
        showNotification('Anda tidak mempunyai kebenaran untuk mengemaskini surat', 'error');
        return;
    }

    const data = currentTab === 'surat-masuk' ? suratMasukData : suratKeluarData;
    const index = data.findIndex(s => s.id === suratId);
    
    if (index !== -1) {
        suratData.id = suratId;
        suratData.failSurat = data[index].failSurat; // Preserve existing file
        data[index] = suratData;
        
        // Save to Google Apps Script
        saveToGoogleAppsScript(suratData, 'update');
        
        loadData();
        showNotification('Surat berjaya dikemaskini!', 'success');
    }
}

function deleteSurat(suratId) {
    // Check user permissions
    if (!hasPermission(currentUser, 'delete')) {
        showNotification('Anda tidak mempunyai kebenaran untuk memadamkan surat', 'error');
        return;
    }

    if (confirm('Adakah anda pasti mahu memadamkan surat ini?')) {
        const data = currentTab === 'surat-masuk' ? suratMasukData : suratKeluarData;
        const surat = data.find(s => s.id === suratId);
        
        if (surat) {
            // Save to Google Apps Script
            saveToGoogleAppsScript(surat, 'delete');
            
            // Remove from local data
            const index = data.findIndex(s => s.id === suratId);
            data.splice(index, 1);
            
            loadData();
            showNotification('Surat berjaya dipadamkan!', 'success');
        }
    }
}

// File Upload Handling
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleFileUpload(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.style.borderColor = '#5a6fd8';
    event.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
}

function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
        handleFileUpload(file);
    }
    
    event.currentTarget.style.borderColor = '#667eea';
    event.currentTarget.style.background = 'transparent';
}

function handleFileUpload(file) {
    // Validate file using config
    const validation = validateFile(file);
    if (!validation.valid) {
        showNotification(validation.message, 'error');
        return;
    }

    // Upload to Google Apps Script
    uploadFileToGoogleAppsScript(file);
}

function uploadFileToGoogleAppsScript(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('suratId', window.currentUploadSuratId);
    formData.append('action', 'upload');

    // Show loading state
    const uploadBtn = document.querySelector('.upload-actions .btn-primary');
    const originalText = uploadBtn.innerHTML;
    uploadBtn.innerHTML = '<span class="loading"></span> Memuat Naik...';
    uploadBtn.disabled = true;

    fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update local data
            const dataArray = currentTab === 'surat-masuk' ? suratMasukData : suratKeluarData;
            const surat = dataArray.find(s => s.id === window.currentUploadSuratId);
            if (surat) {
                surat.failSurat = data.filename;
                loadData();
                showNotification('Fail berjaya dimuat naik!', 'success');
                closeUploadModal();
            }
        } else {
            showNotification('Gagal memuat naik fail: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Upload error:', error);
        showNotification('Ralat semasa memuat naik fail', 'error');
    })
    .finally(() => {
        uploadBtn.innerHTML = originalText;
        uploadBtn.disabled = false;
    });
}

// Google Apps Script Integration
function saveToGoogleAppsScript(suratData, action) {
    const payload = {
        action: action,
        suratType: currentTab,
        suratData: suratData,
        user: currentUser,
        timestamp: new Date().toISOString()
    };

    fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error('Google Apps Script error:', data.error);
        }
    })
    .catch(error => {
        console.error('Error saving to Google Apps Script:', error);
    });
}

// Utility Functions
function formatDate(dateString) {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
}

function getStatusClass(status) {
    return status.toLowerCase().replace(' ', '-');
}

function viewFile(filename) {
    // Open file in new tab (assuming files are stored in Google Drive)
    const fileUrl = `https://drive.google.com/file/d/${filename}/view`;
    window.open(fileUrl, '_blank');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00b894' : type === 'error' ? '#ff4757' : '#667eea'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after configured duration
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, CONFIG.UI_CONFIG.notificationDuration);
}

function logout() {
    if (confirm('Adakah anda pasti mahu log keluar?')) {
        // Clear any stored data
        localStorage.clear();
        // Redirect to login page or show login form
        alert('Anda telah log keluar. Sila log masuk semula.');
        location.reload();
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
