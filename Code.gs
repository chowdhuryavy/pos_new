/**
 * 🏪 Professional POS System - Google Apps Script
 * Features: Role-based access, inventory management, financial calculations, reporting
 * Author: AI Assistant
 * Version: 1.0
 */

// 🌟 Global Constants
const SHEET_NAMES = {
  LOGIN: 'Login',
  DASHBOARD: 'Dashboard', 
  SALES: 'Sales',
  INVOICES: 'Invoices',
  INVENTORY: 'Inventory',
  USERS: 'Users',
  REPORTS: 'Reports',
  SETTINGS: 'Settings',
  LOGS: 'Logs'
};

const USER_ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager', 
  CASHIER: 'Cashier'
};

// 🔐 Authentication & User Management
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🏪 POS System')
    .addItem('🔐 Login', 'showLoginDialog')
    .addItem('🏠 Dashboard', 'showDashboard')
    .addItem('🛒 Point of Sale', 'showPOSInterface')
    .addItem('📊 Reports', 'showReports')
    .addItem('⚙️ Settings', 'showSettings')
    .addSeparator()
    .addItem('🔧 Setup System', 'setupPOSSystem')
    .addItem('📋 View Logs', 'showLogs')
    .addToUi();
    
  // Hide all sheets except Login initially
  hideAllSheetsExceptLogin();
}

function showLoginDialog() {
  var htmlOutput = HtmlService.createTemplateFromFile('Login')
    .evaluate()
    .setWidth(400)
    .setHeight(350)
    .setTitle('🔐 POS Login System');
  SpreadsheetApp.getUi().showModelessDialog(htmlOutput, '🔐 Login');
}

function loginUser(email, password) {
  try {
    var usersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.USERS);
    if (!usersSheet) {
      throw new Error('Users sheet not found. Please run system setup first.');
    }
    
    var users = usersSheet.getDataRange().getValues();
    var hashedPassword = hashPassword(password);
    
    for (var i = 1; i < users.length; i++) {
      if (users[i][0] === email && users[i][1] === hashedPassword) {
        var role = users[i][2];
        
        // Store current user session
        PropertiesService.getScriptProperties().setProperties({
          'currentUser': email,
          'currentRole': role,
          'loginTime': new Date().toString()
        });
        
        // Log successful login
        logAction('Login', 'Successful login', email);
        
        // Show appropriate sheets based on role
        showSheetsByRole(role);
        
        // Update dashboard
        updateDashboard();
        
        return {
          success: true,
          message: `✅ Welcome ${role}! Login successful.`,
          role: role
        };
      }
    }
    
    // Log failed login attempt
    logAction('Login Failed', 'Invalid credentials', email);
    
    return {
      success: false,
      message: '❌ Invalid email or password. Please try again.'
    };
    
  } catch (error) {
    return {
      success: false,
      message: '🚨 Error: ' + error.message
    };
  }
}

function getCurrentUser() {
  var properties = PropertiesService.getScriptProperties();
  return {
    email: properties.getProperty('currentUser'),
    role: properties.getProperty('currentRole'),
    loginTime: properties.getProperty('loginTime')
  };
}

function logout() {
  PropertiesService.getScriptProperties().deleteProperty('currentUser');
  PropertiesService.getScriptProperties().deleteProperty('currentRole');
  PropertiesService.getScriptProperties().deleteProperty('loginTime');
  hideAllSheetsExceptLogin();
  logAction('Logout', 'User logged out');
}

// 🔒 Security Functions
function hashPassword(password) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
  return Utilities.base64Encode(digest);
}

function checkUserPermission(requiredRole) {
  var currentUser = getCurrentUser();
  if (!currentUser.role) {
    throw new Error('Please login first');
  }
  
  var roleHierarchy = {
    [USER_ROLES.ADMIN]: 3,
    [USER_ROLES.MANAGER]: 2,
    [USER_ROLES.CASHIER]: 1
  };
  
  if (roleHierarchy[currentUser.role] < roleHierarchy[requiredRole]) {
    throw new Error('Insufficient permissions');
  }
  
  return true;
}

// 🏠 Dashboard Functions
function showDashboard() {
  var currentUser = getCurrentUser();
  if (!currentUser.email) {
    showLoginDialog();
    return;
  }
  
  var htmlOutput = HtmlService.createTemplateFromFile('Dashboard')
    .evaluate()
    .setWidth(800)
    .setHeight(600)
    .setTitle('🏠 POS Dashboard');
  SpreadsheetApp.getUi().showModelessDialog(htmlOutput, '🏠 Dashboard');
}

function getDashboardData() {
  var currentUser = getCurrentUser();
  var today = new Date();
  var todayStr = Utilities.formatDate(today, Session.getScriptTimeZone(), 'MM/dd/yyyy');
  
  var salesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.SALES);
  var salesData = salesSheet ? salesSheet.getDataRange().getValues() : [];
  
  var todaySales = 0;
  var todayTransactions = 0;
  var todayProfit = 0;
  var productCounts = {};
  
  for (var i = 1; i < salesData.length; i++) {
    var saleDate = Utilities.formatDate(new Date(salesData[i][0]), Session.getScriptTimeZone(), 'MM/dd/yyyy');
    if (saleDate === todayStr) {
      todaySales += parseFloat(salesData[i][7]) || 0; // Subtotal
      todayTransactions++;
      
      // Calculate profit (assuming cost price is available)
      var productName = salesData[i][1];
      var quantity = parseInt(salesData[i][3]) || 0;
      var unitPrice = parseFloat(salesData[i][4]) || 0;
      var costPrice = getCostPrice(salesData[i][2]); // Product ID
      
      todayProfit += (unitPrice - costPrice) * quantity;
      
      // Track product popularity
      productCounts[productName] = (productCounts[productName] || 0) + quantity;
    }
  }
  
  var bestSellingProduct = 'N/A';
  var maxCount = 0;
  for (var product in productCounts) {
    if (productCounts[product] > maxCount) {
      maxCount = productCounts[product];
      bestSellingProduct = product;
    }
  }
  
  return {
    user: currentUser,
    todaySales: todaySales.toFixed(2),
    todayTransactions: todayTransactions,
    todayProfit: todayProfit.toFixed(2),
    bestSellingProduct: bestSellingProduct,
    lowStockItems: getLowStockItems()
  };
}

function getCostPrice(productId) {
  var inventorySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.INVENTORY);
  if (!inventorySheet) return 0;
  
  var inventory = inventorySheet.getDataRange().getValues();
  for (var i = 1; i < inventory.length; i++) {
    if (inventory[i][0] === productId) {
      return parseFloat(inventory[i][3]) || 0; // Cost Price column
    }
  }
  return 0;
}

function getLowStockItems() {
  var inventorySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.INVENTORY);
  if (!inventorySheet) return [];
  
  var inventory = inventorySheet.getDataRange().getValues();
  var lowStockItems = [];
  
  for (var i = 1; i < inventory.length; i++) {
    var stock = parseInt(inventory[i][5]) || 0;
    var reorderLevel = parseInt(inventory[i][6]) || 0;
    
    if (stock <= reorderLevel) {
      lowStockItems.push({
        productId: inventory[i][0],
        productName: inventory[i][1],
        currentStock: stock,
        reorderLevel: reorderLevel
      });
    }
  }
  
  return lowStockItems;
}

// 🛒 Point of Sale Functions
function showPOSInterface() {
  var currentUser = getCurrentUser();
  if (!currentUser.email) {
    showLoginDialog();
    return;
  }
  
  var htmlOutput = HtmlService.createTemplateFromFile('POS')
    .evaluate()
    .setWidth(900)
    .setHeight(700)
    .setTitle('🛒 Point of Sale');
  SpreadsheetApp.getUi().showModelessDialog(htmlOutput, '🛒 Point of Sale');
}

function getProducts() {
  var inventorySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.INVENTORY);
  if (!inventorySheet) return [];
  
  var products = inventorySheet.getDataRange().getValues();
  var productList = [];
  
  for (var i = 1; i < products.length; i++) {
    if (products[i][0]) { // Check if Product ID exists
      productList.push({
        productId: products[i][0],
        productName: products[i][1],
        category: products[i][2],
        costPrice: parseFloat(products[i][3]) || 0,
        sellPrice: parseFloat(products[i][4]) || 0,
        stock: parseInt(products[i][5]) || 0,
        reorderLevel: parseInt(products[i][6]) || 0
      });
    }
  }
  
  return productList;
}

function submitSale(saleData) {
  try {
    var currentUser = getCurrentUser();
    if (!currentUser.email) {
      throw new Error('Please login first');
    }
    
    var salesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.SALES);
    var now = new Date();
    
    var total = 0;
    var saleItems = [];
    
    // Process each item in the sale
    for (var i = 0; i < saleData.items.length; i++) {
      var item = saleData.items[i];
      var quantity = parseInt(item.quantity) || 0;
      var unitPrice = parseFloat(item.unitPrice) || 0;
      var discount = parseFloat(item.discount) || 0;
      var taxRate = getSettingValue('Tax (%)') / 100;
      
      // Calculate subtotal with discount and tax
      var subtotal = quantity * unitPrice;
      var discountAmount = subtotal * (discount / 100);
      var afterDiscount = subtotal - discountAmount;
      var taxAmount = afterDiscount * taxRate;
      var finalSubtotal = afterDiscount + taxAmount;
      
      total += finalSubtotal;
      
      // Add to sales sheet
      salesSheet.appendRow([
        now,
        item.productName,
        item.productId,
        quantity,
        unitPrice,
        discount + '%',
        (taxRate * 100) + '%',
        finalSubtotal.toFixed(2)
      ]);
      
      // Update inventory
      updateInventoryStock(item.productId, -quantity);
      
      saleItems.push({
        productName: item.productName,
        quantity: quantity,
        unitPrice: unitPrice,
        subtotal: finalSubtotal.toFixed(2)
      });
    }
    
    // Generate invoice
    var invoiceNumber = generateInvoice(saleData, saleItems, total, currentUser.email);
    
    // Log the sale
    logAction('Sale', `Invoice ${invoiceNumber} - Total: $${total.toFixed(2)}`, currentUser.email);
    
    // Update dashboard
    updateDashboard();
    
    return {
      success: true,
      message: `✅ Sale completed successfully! Invoice: ${invoiceNumber}`,
      invoiceNumber: invoiceNumber,
      total: total.toFixed(2)
    };
    
  } catch (error) {
    return {
      success: false,
      message: '🚨 Error: ' + error.message
    };
  }
}

function updateInventoryStock(productId, quantityChange) {
  var inventorySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.INVENTORY);
  if (!inventorySheet) return;
  
  var inventory = inventorySheet.getDataRange().getValues();
  for (var i = 1; i < inventory.length; i++) {
    if (inventory[i][0] === productId) {
      var currentStock = parseInt(inventory[i][5]) || 0;
      var newStock = currentStock + quantityChange;
      inventorySheet.getRange(i + 1, 6).setValue(Math.max(0, newStock));
      break;
    }
  }
}

function generateInvoice(saleData, saleItems, total, cashier) {
  var invoicesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.INVOICES);
  var now = new Date();
  var invoiceNumber = 'INV-' + Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyyMMdd') + '-' + (invoicesSheet.getLastRow());
  
  var productsText = saleItems.map(function(item) {
    return item.productName + ' (x' + item.quantity + ')';
  }).join(', ');
  
  invoicesSheet.appendRow([
    invoiceNumber,
    now,
    saleData.customerName || 'Walk-in Customer',
    productsText,
    '$' + total.toFixed(2),
    saleData.paymentMethod || 'Cash',
    cashier
  ]);
  
  return invoiceNumber;
}

// ⚙️ Settings Functions
function getSettingValue(settingName) {
  var settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.SETTINGS);
  if (!settingsSheet) return null;
  
  var settings = settingsSheet.getDataRange().getValues();
  for (var i = 0; i < settings.length; i++) {
    if (settings[i][0] === settingName) {
      return parseFloat(settings[i][1]) || settings[i][1];
    }
  }
  return null;
}

function updateSetting(settingName, value) {
  try {
    checkUserPermission(USER_ROLES.ADMIN);
    
    var settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.SETTINGS);
    var settings = settingsSheet.getDataRange().getValues();
    
    for (var i = 0; i < settings.length; i++) {
      if (settings[i][0] === settingName) {
        settingsSheet.getRange(i + 1, 2).setValue(value);
        logAction('Settings Update', `${settingName} changed to ${value}`);
        return { success: true, message: 'Setting updated successfully' };
      }
    }
    
    // If setting doesn't exist, add it
    settingsSheet.appendRow([settingName, value]);
    logAction('Settings Add', `New setting: ${settingName} = ${value}`);
    return { success: true, message: 'New setting added successfully' };
    
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// 📊 Reports Functions
function showReports() {
  try {
    checkUserPermission(USER_ROLES.MANAGER);
    
    var htmlOutput = HtmlService.createTemplateFromFile('Reports')
      .evaluate()
      .setWidth(800)
      .setHeight(600)
      .setTitle('📊 Sales Reports');
    SpreadsheetApp.getUi().showModelessDialog(htmlOutput, '📊 Reports');
  } catch (error) {
    SpreadsheetApp.getUi().alert('Access Denied', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

function generateSalesReport(startDate, endDate) {
  try {
    checkUserPermission(USER_ROLES.MANAGER);
    
    var salesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.SALES);
    if (!salesSheet) return { success: false, message: 'Sales sheet not found' };
    
    var salesData = salesSheet.getDataRange().getValues();
    var report = {
      totalSales: 0,
      totalProfit: 0,
      transactionCount: 0,
      productSales: {},
      dailySales: {}
    };
    
    var start = new Date(startDate);
    var end = new Date(endDate);
    
    for (var i = 1; i < salesData.length; i++) {
      var saleDate = new Date(salesData[i][0]);
      
      if (saleDate >= start && saleDate <= end) {
        var subtotal = parseFloat(salesData[i][7]) || 0;
        var productName = salesData[i][1];
        var quantity = parseInt(salesData[i][3]) || 0;
        var productId = salesData[i][2];
        var unitPrice = parseFloat(salesData[i][4]) || 0;
        
        report.totalSales += subtotal;
        report.transactionCount++;
        
        // Calculate profit
        var costPrice = getCostPrice(productId);
        var profit = (unitPrice - costPrice) * quantity;
        report.totalProfit += profit;
        
        // Track product sales
        if (!report.productSales[productName]) {
          report.productSales[productName] = { quantity: 0, revenue: 0 };
        }
        report.productSales[productName].quantity += quantity;
        report.productSales[productName].revenue += subtotal;
        
        // Track daily sales
        var dayKey = Utilities.formatDate(saleDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        if (!report.dailySales[dayKey]) {
          report.dailySales[dayKey] = 0;
        }
        report.dailySales[dayKey] += subtotal;
      }
    }
    
    return { success: true, data: report };
    
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// 📋 Logging Functions
function logAction(action, details, user) {
  var logsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.LOGS);
  if (!logsSheet) return;
  
  var currentUser = user || getCurrentUser().email || 'System';
  var now = new Date();
  
  logsSheet.appendRow([
    now,
    currentUser,
    action,
    details || ''
  ]);
}

function showLogs() {
  try {
    checkUserPermission(USER_ROLES.ADMIN);
    
    var htmlOutput = HtmlService.createTemplateFromFile('Logs')
      .evaluate()
      .setWidth(800)
      .setHeight(600)
      .setTitle('📋 System Logs');
    SpreadsheetApp.getUi().showModelessDialog(htmlOutput, '📋 Logs');
  } catch (error) {
    SpreadsheetApp.getUi().alert('Access Denied', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

function getRecentLogs(limit) {
  try {
    checkUserPermission(USER_ROLES.ADMIN);
    
    var logsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.LOGS);
    if (!logsSheet) return [];
    
    var logs = logsSheet.getDataRange().getValues();
    var recentLogs = logs.slice(-limit || -50).reverse(); // Get last 50 logs, most recent first
    
    return recentLogs.map(function(log) {
      return {
        date: log[0],
        user: log[1],
        action: log[2],
        details: log[3]
      };
    });
    
  } catch (error) {
    return [];
  }
}

// 🔒 Sheet Visibility Functions
function hideAllSheetsExceptLogin() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    if (sheet.getName() !== SHEET_NAMES.LOGIN) {
      sheet.hideSheet();
    } else {
      sheet.showSheet();
      ss.setActiveSheet(sheet);
    }
  }
}

function showSheetsByRole(role) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  
  var allowedSheets = {
    [USER_ROLES.ADMIN]: [SHEET_NAMES.DASHBOARD, SHEET_NAMES.SALES, SHEET_NAMES.INVOICES, 
                         SHEET_NAMES.INVENTORY, SHEET_NAMES.USERS, SHEET_NAMES.REPORTS, 
                         SHEET_NAMES.SETTINGS, SHEET_NAMES.LOGS],
    [USER_ROLES.MANAGER]: [SHEET_NAMES.DASHBOARD, SHEET_NAMES.SALES, SHEET_NAMES.INVOICES, 
                           SHEET_NAMES.INVENTORY, SHEET_NAMES.REPORTS],
    [USER_ROLES.CASHIER]: [SHEET_NAMES.DASHBOARD, SHEET_NAMES.SALES, SHEET_NAMES.INVOICES]
  };
  
  var userAllowedSheets = allowedSheets[role] || [];
  
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    var sheetName = sheet.getName();
    
    if (userAllowedSheets.indexOf(sheetName) > -1) {
      sheet.showSheet();
    } else if (sheetName !== SHEET_NAMES.LOGIN) {
      sheet.hideSheet();
    }
  }
  
  // Set Dashboard as active sheet after login
  var dashboardSheet = ss.getSheetByName(SHEET_NAMES.DASHBOARD);
  if (dashboardSheet && userAllowedSheets.indexOf(SHEET_NAMES.DASHBOARD) > -1) {
    ss.setActiveSheet(dashboardSheet);
  }
}

// 👥 User Management Functions
function addUser(email, password, role) {
  try {
    checkUserPermission(USER_ROLES.ADMIN);
    
    var usersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.USERS);
    var hashedPassword = hashPassword(password);
    
    // Check if user already exists
    var users = usersSheet.getDataRange().getValues();
    for (var i = 1; i < users.length; i++) {
      if (users[i][0] === email) {
        return { success: false, message: 'User already exists' };
      }
    }
    
    usersSheet.appendRow([email, hashedPassword, role]);
    logAction('User Management', `New user added: ${email} (${role})`);
    
    return { success: true, message: 'User added successfully' };
    
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function updateDashboard() {
  var dashboardSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.DASHBOARD);
  if (!dashboardSheet) return;
  
  var data = getDashboardData();
  
  // Update dashboard cells with current data
  dashboardSheet.getRange('B1').setValue(data.user.email || 'Not logged in');
  dashboardSheet.getRange('B2').setValue(data.user.role || 'N/A');
  dashboardSheet.getRange('B3').setValue('$' + data.todaySales);
  dashboardSheet.getRange('B4').setValue(data.todayTransactions);
  dashboardSheet.getRange('B5').setValue(data.bestSellingProduct);
  dashboardSheet.getRange('B6').setValue('$' + data.todayProfit);
}

// 🔧 System Setup Functions
function setupPOSSystem() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Create all required sheets
    createSheet(ss, SHEET_NAMES.LOGIN, [['Email', 'Password', 'Role']]);
    
    createSheet(ss, SHEET_NAMES.DASHBOARD, [
      ['👋 Welcome,', ''],
      ['Role:', ''],
      ['Total Sales Today 💰', '$0.00'],
      ['Total Transactions 📄', '0'],
      ['Best-Selling Product 🏆', 'N/A'],
      ['Profit Today 📈', '$0.00']
    ]);
    
    createSheet(ss, SHEET_NAMES.SALES, [
      ['Date', 'Product Name', 'Product ID', 'Quantity', 'Unit Price', 'Discount', 'Tax (%)', 'Subtotal']
    ]);
    
    createSheet(ss, SHEET_NAMES.INVOICES, [
      ['Invoice#', 'Date', 'Customer', 'Products', 'Total 💵', 'Payment Type', 'Cashier 👤']
    ]);
    
    createSheet(ss, SHEET_NAMES.INVENTORY, [
      ['Product ID', 'Product Name', 'Category', 'Cost Price', 'Sell Price', 'Stock 🔄', 'Reorder 📉']
    ]);
    
    createSheet(ss, SHEET_NAMES.USERS, [
      ['Email', 'Password', 'Role']
    ]);
    
    createSheet(ss, SHEET_NAMES.REPORTS, [
      ['Date', 'Total Sales', 'Total Profit', 'Top Product']
    ]);
    
    createSheet(ss, SHEET_NAMES.SETTINGS, [
      ['Setting', 'Value'],
      ['Tax (%)', '8'],
      ['Currency', 'USD'],
      ['Default Discount', '5'],
      ['Payment Methods', 'Cash, Card, UPI']
    ]);
    
    createSheet(ss, SHEET_NAMES.LOGS, [
      ['Date', 'User', 'Action', 'Details']
    ]);
    
    // Create default admin user
    var usersSheet = ss.getSheetByName(SHEET_NAMES.USERS);
    var adminPassword = hashPassword('admin123');
    usersSheet.appendRow(['admin@pos.com', adminPassword, USER_ROLES.ADMIN]);
    
    // Add sample inventory
    var inventorySheet = ss.getSheetByName(SHEET_NAMES.INVENTORY);
    inventorySheet.appendRow(['PROD-001', 'Apple Juice', 'Beverage', 2.00, 5.00, 100, 20]);
    inventorySheet.appendRow(['PROD-002', 'Sandwich', 'Food', 3.50, 7.00, 50, 10]);
    inventorySheet.appendRow(['PROD-003', 'Coffee', 'Beverage', 1.00, 3.00, 75, 15]);
    
    // Apply formatting
    formatSheets();
    
    // Hide all sheets except Login
    hideAllSheetsExceptLogin();
    
    logAction('System Setup', 'POS System initialized successfully', 'System');
    
    SpreadsheetApp.getUi().alert('✅ Setup Complete!', 
      'POS System has been set up successfully!\n\n' +
      'Default Admin Login:\n' +
      'Email: admin@pos.com\n' +
      'Password: admin123\n\n' +
      'Please change the password after first login.',
      SpreadsheetApp.getUi().ButtonSet.OK);
      
  } catch (error) {
    SpreadsheetApp.getUi().alert('❌ Setup Failed', 'Error: ' + error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

function createSheet(spreadsheet, name, headers) {
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  } else {
    sheet.clear();
  }
  
  if (headers && headers.length > 0) {
    sheet.getRange(1, 1, headers.length, headers[0].length).setValues(headers);
  }
  
  return sheet;
}

function formatSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Format header rows
  var sheets = [SHEET_NAMES.SALES, SHEET_NAMES.INVOICES, SHEET_NAMES.INVENTORY, 
                SHEET_NAMES.USERS, SHEET_NAMES.REPORTS, SHEET_NAMES.LOGS];
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (sheet) {
      sheet.getRange(1, 1, 1, sheet.getLastColumn())
        .setBackground('#4285f4')
        .setFontColor('white')
        .setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  });
  
  // Format Dashboard sheet
  var dashboardSheet = ss.getSheetByName(SHEET_NAMES.DASHBOARD);
  if (dashboardSheet) {
    dashboardSheet.getRange('A:A').setFontWeight('bold');
    dashboardSheet.getRange('A3:A6').setBackground('#e8f0fe');
  }
}

// 🔧 Utility Functions
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function testFunction() {
  Logger.log('POS System is working correctly!');
  return 'System operational ✅';
}