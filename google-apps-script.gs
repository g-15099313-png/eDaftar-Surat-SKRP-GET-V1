// Google Apps Script untuk EDAFTAR SURAT SKRP GET
// Deploy sebagai Web App untuk integrasi dengan frontend

// Spreadsheet IDs - Ganti dengan ID spreadsheet anda
// Sila buat spreadsheet baru dan ganti ID di bawah
const SURAT_MASUK_SHEET_ID = '19ZKovJe7eYS1eVXGs62EaFsOdA_1UQIbXrKFr63h_Fs';
const SURAT_KELUAR_SHEET_ID = '1mxi9rgNX237dAD70hJnKRmLVke4oFdadox2VPqwj2SU';
const FILES_FOLDER_ID = '1ukwzk7ogCNehCEUCmYlBx-_uQ27i5W_s';

// Main function to handle HTTP requests
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    let response = { success: false, message: '' };
    
    switch(action) {
      case 'add':
        response = addSurat(data);
        break;
      case 'update':
        response = updateSurat(data);
        break;
      case 'delete':
        response = deleteSurat(data);
        break;
      case 'upload':
        response = uploadFile(e);
        break;
      case 'get':
        response = getSurat(data);
        break;
      default:
        response = { success: false, message: 'Invalid action' };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Server error: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action || 'get';
    const suratType = e.parameter.type || 'surat-masuk';
    
    let response = { success: false, data: [] };
    
    if (action === 'get') {
      response = getAllSurat(suratType);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Server error: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to add new surat
function addSurat(data) {
  try {
    const sheet = getSheet(data.suratType);
    const suratData = data.suratData;
    
    // Generate new ID
    const lastRow = sheet.getLastRow();
    const newId = lastRow > 1 ? sheet.getRange(lastRow, 1).getValue() + 1 : 1;
    
    // Prepare row data
    const rowData = [
      newId,
      suratData.noRujukan,
      suratData.tarikhTerima,
      suratData.pengirim,
      suratData.subjek,
      suratData.status,
      suratData.tindakanSiapa,
      suratData.failSurat || '',
      data.user,
      new Date().toISOString()
    ];
    
    // Add to spreadsheet
    sheet.appendRow(rowData);
    
    // Log activity
    logActivity('ADD', data.user, suratData.noRujukan, data.suratType);
    
    return {
      success: true,
      message: 'Surat berjaya ditambah',
      id: newId
    };
    
  } catch (error) {
    console.error('Error adding surat:', error);
    return {
      success: false,
      message: 'Gagal menambah surat: ' + error.toString()
    };
  }
}

// Function to update existing surat
function updateSurat(data) {
  try {
    const sheet = getSheet(data.suratType);
    const suratData = data.suratData;
    
    // Find the row with the surat ID
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == suratData.id) {
        // Update the row
        const rowData = [
          suratData.id,
          suratData.noRujukan,
          suratData.tarikhTerima,
          suratData.pengirim,
          suratData.subjek,
          suratData.status,
          suratData.tindakanSiapa,
          suratData.failSurat || '',
          data.user,
          new Date().toISOString()
        ];
        
        sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
        
        // Log activity
        logActivity('UPDATE', data.user, suratData.noRujukan, data.suratType);
        
        return {
          success: true,
          message: 'Surat berjaya dikemaskini'
        };
      }
    }
    
    return {
      success: false,
      message: 'Surat tidak dijumpai'
    };
    
  } catch (error) {
    console.error('Error updating surat:', error);
    return {
      success: false,
      message: 'Gagal mengemaskini surat: ' + error.toString()
    };
  }
}

// Function to delete surat
function deleteSurat(data) {
  try {
    const sheet = getSheet(data.suratType);
    const suratData = data.suratData;
    
    // Find the row with the surat ID
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == suratData.id) {
        // Delete the row
        sheet.deleteRow(i + 1);
        
        // Log activity
        logActivity('DELETE', data.user, suratData.noRujukan, data.suratType);
        
        return {
          success: true,
          message: 'Surat berjaya dipadamkan'
        };
      }
    }
    
    return {
      success: false,
      message: 'Surat tidak dijumpai'
    };
    
  } catch (error) {
    console.error('Error deleting surat:', error);
    return {
      success: false,
      message: 'Gagal memadamkan surat: ' + error.toString()
    };
  }
}

// Function to upload file
function uploadFile(e) {
  try {
    const formData = e.parameter;
    const fileBlob = e.parameter.file;
    const suratId = formData.suratId;
    const suratType = formData.suratType || 'surat-masuk';
    
    if (!fileBlob) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Tiada fail yang dimuat naik'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Create filename
    const timestamp = new Date().getTime();
    const filename = `surat_${suratType}_${suratId}_${timestamp}.pdf`;
    
    // Upload to Google Drive
    const folder = DriveApp.getFolderById(FILES_FOLDER_ID);
    const file = folder.createFile(fileBlob);
    file.setName(filename);
    
    // Update surat record with file ID
    const sheet = getSheet(suratType);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == suratId) {
        sheet.getRange(i + 1, 8).setValue(file.getId());
        break;
      }
    }
    
    // Log activity
    logActivity('UPLOAD', formData.user || 'System', `File: ${filename}`, suratType);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Fail berjaya dimuat naik',
        filename: file.getId()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error uploading file:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Gagal memuat naik fail: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to get all surat
function getAllSurat(suratType) {
  try {
    const sheet = getSheet(suratType);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length <= 1) {
      return {
        success: true,
        data: []
      };
    }
    
    // Convert to objects
    const suratList = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      suratList.push({
        id: row[0],
        noRujukan: row[1],
        tarikhTerima: row[2],
        pengirim: row[3],
        subjek: row[4],
        status: row[5],
        tindakanSiapa: row[6],
        failSurat: row[7],
        createdBy: row[8],
        createdAt: row[9]
      });
    }
    
    return {
      success: true,
      data: suratList
    };
    
  } catch (error) {
    console.error('Error getting surat:', error);
    return {
      success: false,
      message: 'Gagal mendapatkan data surat: ' + error.toString(),
      data: []
    };
  }
}

// Function to get specific surat
function getSurat(data) {
  try {
    const sheet = getSheet(data.suratType);
    const suratId = data.suratId;
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == suratId) {
        const row = values[i];
        return {
          success: true,
          data: {
            id: row[0],
            noRujukan: row[1],
            tarikhTerima: row[2],
            pengirim: row[3],
            subjek: row[4],
            status: row[5],
            tindakanSiapa: row[6],
            failSurat: row[7],
            createdBy: row[8],
            createdAt: row[9]
          }
        };
      }
    }
    
    return {
      success: false,
      message: 'Surat tidak dijumpai'
    };
    
  } catch (error) {
    console.error('Error getting surat:', error);
    return {
      success: false,
      message: 'Gagal mendapatkan surat: ' + error.toString()
    };
  }
}

// Helper function to get the appropriate sheet
function getSheet(suratType) {
  const spreadsheetId = suratType === 'surat-masuk' ? SURAT_MASUK_SHEET_ID : SURAT_KELUAR_SHEET_ID;
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  return spreadsheet.getActiveSheet();
}

// Function to log activities
function logActivity(action, user, details, suratType) {
  try {
    // Create or get activity log sheet
    const spreadsheet = SpreadsheetApp.openById(SURAT_MASUK_SHEET_ID);
    let activitySheet = spreadsheet.getSheetByName('ActivityLog');
    
    if (!activitySheet) {
      activitySheet = spreadsheet.insertSheet('ActivityLog');
      activitySheet.getRange(1, 1, 1, 5).setValues([['Timestamp', 'Action', 'User', 'Details', 'SuratType']]);
    }
    
    // Add activity log
    activitySheet.appendRow([
      new Date().toISOString(),
      action,
      user,
      details,
      suratType
    ]);
    
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

// Function to setup spreadsheet structure
function setupSpreadsheets() {
  try {
    // Setup Surat Masuk spreadsheet
    const suratMasukSpreadsheet = SpreadsheetApp.openById(SURAT_MASUK_SHEET_ID);
    const suratMasukSheet = suratMasukSpreadsheet.getActiveSheet();
    
    // Set headers
    suratMasukSheet.getRange(1, 1, 1, 10).setValues([
      ['ID', 'No. Rujukan', 'Tarikh Terima', 'Pengirim', 'Subjek', 'Status', 'Tindakan Siapa', 'Fail Surat', 'Dicipta Oleh', 'Dicipta Pada']
    ]);
    
    // Format headers
    suratMasukSheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#667eea').setFontColor('white');
    
    // Setup Surat Keluar spreadsheet
    const suratKeluarSpreadsheet = SpreadsheetApp.openById(SURAT_KELUAR_SHEET_ID);
    const suratKeluarSheet = suratKeluarSpreadsheet.getActiveSheet();
    
    // Set headers
    suratKeluarSheet.getRange(1, 1, 1, 10).setValues([
      ['ID', 'No. Rujukan', 'Tarikh Terima', 'Pengirim', 'Subjek', 'Status', 'Tindakan Siapa', 'Fail Surat', 'Dicipta Oleh', 'Dicipta Pada']
    ]);
    
    // Format headers
    suratKeluarSheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#667eea').setFontColor('white');
    
    console.log('Spreadsheets setup completed successfully');
    
  } catch (error) {
    console.error('Error setting up spreadsheets:', error);
  }
}

// Function to create Google Drive folder for files
function createFilesFolder() {
  try {
    const folderName = 'EDAFTAR SURAT SKRP GET - Files';
    const folder = DriveApp.createFolder(folderName);
    
    console.log('Files folder created with ID:', folder.getId());
    return folder.getId();
    
  } catch (error) {
    console.error('Error creating files folder:', error);
    return null;
  }
}

// Function to generate reports
function generateReport(suratType, startDate, endDate) {
  try {
    const sheet = getSheet(suratType);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    const report = {
      totalSurat: 0,
      byStatus: {},
      byUser: {},
      byMonth: {}
    };
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const tarikhTerima = new Date(row[2]);
      const status = row[5];
      const user = row[8];
      
      // Check date range
      if (startDate && endDate) {
        if (tarikhTerima < new Date(startDate) || tarikhTerima > new Date(endDate)) {
          continue;
        }
      }
      
      report.totalSurat++;
      
      // Count by status
      report.byStatus[status] = (report.byStatus[status] || 0) + 1;
      
      // Count by user
      report.byUser[user] = (report.byUser[user] || 0) + 1;
      
      // Count by month
      const monthKey = tarikhTerima.getFullYear() + '-' + (tarikhTerima.getMonth() + 1);
      report.byMonth[monthKey] = (report.byMonth[monthKey] || 0) + 1;
    }
    
    return {
      success: true,
      data: report
    };
    
  } catch (error) {
    console.error('Error generating report:', error);
    return {
      success: false,
      message: 'Gagal menjana laporan: ' + error.toString()
    };
  }
}

// Function to backup data
function backupData() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Backup Surat Masuk
    const suratMasukSpreadsheet = SpreadsheetApp.openById(SURAT_MASUK_SHEET_ID);
    const suratMasukBackup = DriveApp.createFile(suratMasukSpreadsheet.getBlob());
    suratMasukBackup.setName(`Surat_Masuk_Backup_${timestamp}.xlsx`);
    
    // Backup Surat Keluar
    const suratKeluarSpreadsheet = SpreadsheetApp.openById(SURAT_KELUAR_SHEET_ID);
    const suratKeluarBackup = DriveApp.createFile(suratKeluarSpreadsheet.getBlob());
    suratKeluarBackup.setName(`Surat_Keluar_Backup_${timestamp}.xlsx`);
    
    console.log('Backup completed successfully');
    return {
      success: true,
      message: 'Backup berjaya dibuat',
      files: [suratMasukBackup.getId(), suratKeluarBackup.getId()]
    };
    
  } catch (error) {
    console.error('Error creating backup:', error);
    return {
      success: false,
      message: 'Gagal membuat backup: ' + error.toString()
    };
  }
}

// Function to send email notifications
function sendEmailNotification(recipient, subject, message) {
  try {
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: message
    });
    
    return {
      success: true,
      message: 'Email berjaya dihantar'
    };
    
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: 'Gagal menghantar email: ' + error.toString()
    };
  }
}

// Function to validate user permissions
function validateUser(user, action) {
  // Define user permissions
  const permissions = {
    'Guru Besar': ['add', 'update', 'delete', 'view', 'upload'],
    'GPKP': ['add', 'update', 'view', 'upload'],
    'GPKHEM': ['add', 'update', 'view', 'upload'],
    'GPKKO': ['add', 'update', 'view', 'upload'],
    'PT': ['add', 'view', 'upload'],
    'PO': ['view', 'upload']
  };
  
  const userPermissions = permissions[user] || [];
  return userPermissions.includes(action);
}

// Function to get file download URL
function getFileDownloadUrl(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    return file.getDownloadUrl();
  } catch (error) {
    console.error('Error getting file download URL:', error);
    return null;
  }
}

