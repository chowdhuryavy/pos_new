# 🏪 Professional POS System - Google Sheets & Apps Script

A fully functional, professional Point of Sale system built entirely with Google Sheets and Google Apps Script. Features role-based authentication, real-time inventory management, financial calculations, reporting, and a beautiful animated UI.

## ✨ Features

### 🔐 **Role-Based Authentication System**
- **Admin**: Full system access (users, settings, logs, reports)
- **Manager**: Sales, inventory, and reports access
- **Cashier**: Sales and basic dashboard access
- Secure password hashing with SHA-256
- Session management with automatic logout

### 🏠 **Dynamic Dashboard**
- Real-time business metrics
- Today's sales, profit, and transaction counts
- Best-selling product tracking
- Low stock alerts with visual indicators
- Role-based content visibility
- Auto-refresh every 5 minutes

### 🛒 **Professional Point of Sale Interface**
- Product catalog with categories and search
- Shopping cart with quantity controls
- Real-time calculations (subtotal, discount, tax)
- Multiple payment methods (Cash, Card, UPI)
- Stock validation and low-stock warnings
- Automatic invoice generation

### 💰 **Advanced Financial Calculations**
- Configurable tax rates
- Percentage-based discounts
- Profit margin calculations
- Cost vs. selling price tracking
- Automatic total calculations

### 📦 **Inventory Management**
- Product catalog with categories
- Real-time stock tracking
- Automatic stock updates on sales
- Low stock alerts and reorder levels
- Product search and filtering

### 📊 **Comprehensive Reporting**
- Date range filtering
- Sales and profit analytics
- Top-selling products charts
- Daily sales trends visualization
- CSV export functionality
- Interactive charts and graphs

### 👥 **User Management**
- Add/remove users by role
- Password management
- User activity tracking
- Role-based permissions

### 📋 **System Logs & Monitoring**
- Comprehensive activity logging
- User action tracking
- Login/logout monitoring
- Error tracking and reporting
- Filterable log viewer
- Auto-refresh capabilities

### ⚙️ **Admin Configuration**
- Tax rate configuration
- Currency settings
- Default discount rates
- Payment method management
- System-wide settings

## 🗂️ **Sheet Structure**

| Sheet Name | Purpose | Access Roles |
|------------|---------|--------------|
| **Login** | Secure user login interface | All (entry point) |
| **Dashboard** | Role-based visual summary | All (dynamic view) |
| **Sales** | POS interface to record sales | All |
| **Invoices** | Auto-generated invoices | All |
| **Inventory** | Product catalog & stock tracking | Admin, Manager |
| **Users** | User management & authentication | Admin |
| **Reports** | Sales, profit, analytics | Admin, Manager |
| **Settings** | System configuration | Admin |
| **Logs** | System activity logs | Admin |

## 🚀 **Quick Setup Guide**

### **Step 1: Create Google Sheets File**
1. Open Google Sheets
2. Create a new blank spreadsheet
3. Name it "POS System" or your preferred name

### **Step 2: Setup Apps Script**
1. In your Google Sheet, go to `Extensions` → `Apps Script`
2. Delete the default `myFunction()` code
3. Copy and paste the contents of `Code.gs` into the script editor
4. Save the project (Ctrl+S or Cmd+S)

### **Step 3: Add HTML Files**
1. In Apps Script editor, click the `+` button next to "Files"
2. Choose "HTML" and create the following files:
   - `Login.html` (copy content from Login.html)
   - `Dashboard.html` (copy content from Dashboard.html)
   - `POS.html` (copy content from POS.html)
   - `Reports.html` (copy content from Reports.html)
   - `Logs.html` (copy content from Logs.html)

### **Step 4: Initialize System**
1. Save all files in Apps Script
2. Go back to your Google Sheet
3. Refresh the page (F5)
4. You should see a new menu "🏪 POS System"
5. Click on `🏪 POS System` → `🔧 Setup System`
6. Wait for the setup to complete

### **Step 5: First Login**
1. Click on `🏪 POS System` → `🔐 Login`
2. Use the default admin credentials:
   - **Email**: `admin@pos.com`
   - **Password**: `admin123`
3. **Important**: Change the password after first login!

## 📋 **Detailed Setup Instructions**

### **Creating the Google Apps Script Project**

1. **Open Google Sheets**: Go to [sheets.google.com](https://sheets.google.com)
2. **Create New Sheet**: Click "Blank" to create a new spreadsheet
3. **Access Apps Script**: 
   - Click `Extensions` in the menu bar
   - Select `Apps Script`
4. **Setup Project**:
   - Delete the default code
   - Copy the entire content from `Code.gs`
   - Paste it into the editor
   - Click the save icon (💾) or press Ctrl+S

### **Adding HTML Files**

For each HTML file (`Login.html`, `Dashboard.html`, `POS.html`, `Reports.html`, `Logs.html`):

1. **Create HTML File**:
   - Click the `+` button next to "Files" in Apps Script
   - Select "HTML"
   - Name it exactly as specified (e.g., `Login.html`)
2. **Add Content**:
   - Delete the default HTML content
   - Copy the entire content from the corresponding HTML file
   - Paste it into the editor
   - Save the file

### **System Initialization**

1. **Save Everything**: Ensure all files are saved in Apps Script
2. **Return to Sheet**: Go back to your Google Sheets tab
3. **Refresh Page**: Press F5 or refresh the browser
4. **Run Setup**:
   - Look for the "🏪 POS System" menu in the top menu bar
   - Click `🏪 POS System` → `🔧 Setup System`
   - Wait for the success message

## 🎯 **Usage Guide**

### **For Administrators**

1. **Initial Setup**:
   - Run system setup
   - Change default admin password
   - Add additional users
   - Configure tax rates and settings

2. **User Management**:
   - Navigate to Users sheet
   - Add new users with appropriate roles
   - Monitor user activity in Logs

3. **System Configuration**:
   - Modify Settings sheet for tax rates, currency
   - Monitor system logs for issues
   - Generate reports for business insights

### **For Managers**

1. **Inventory Management**:
   - Add new products to Inventory sheet
   - Monitor stock levels
   - Set reorder points
   - View low stock alerts

2. **Sales Monitoring**:
   - Use Dashboard for real-time metrics
   - Generate sales reports
   - Monitor top-selling products
   - Track profit margins

### **For Cashiers**

1. **Processing Sales**:
   - Use POS interface for sales
   - Select products and quantities
   - Apply discounts if authorized
   - Choose payment method
   - Complete checkout

2. **Daily Operations**:
   - Check Dashboard for daily metrics
   - View recent transactions
   - Access customer invoices

## 🔧 **Configuration Options**

### **Settings Sheet Configuration**
Modify the Settings sheet to customize:

| Setting | Description | Example |
|---------|-------------|---------|
| Tax (%) | Default tax rate | 8 |
| Currency | Currency symbol | USD |
| Default Discount | Default discount percentage | 5 |
| Payment Methods | Available payment options | Cash, Card, UPI |

### **User Roles and Permissions**

| Role | Login | Dashboard | Sales | Inventory | Reports | Users | Settings | Logs |
|------|-------|-----------|-------|-----------|---------|-------|----------|------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Cashier** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## 📊 **Sample Data Structure**

### **Inventory Sheet Example**
```
Product ID | Product Name | Category | Cost Price | Sell Price | Stock | Reorder Level
PROD-001   | Apple Juice  | Beverage | 2.00       | 5.00       | 100   | 20
PROD-002   | Sandwich     | Food     | 3.50       | 7.00       | 50    | 10
PROD-003   | Coffee       | Beverage | 1.00       | 3.00       | 75    | 15
```

### **Users Sheet Example**
```
Email              | Password (Hashed)      | Role
admin@pos.com      | [SHA-256 Hash]        | Admin
manager@pos.com    | [SHA-256 Hash]        | Manager
cashier@pos.com    | [SHA-256 Hash]        | Cashier
```

## 🛠️ **Troubleshooting**

### **Common Issues**

**1. "POS System" menu not appearing**
- **Solution**: Refresh the Google Sheets page (F5)
- **Alternative**: Reopen the spreadsheet

**2. "Users sheet not found" error**
- **Solution**: Run the setup system again
- **Check**: Ensure all Apps Script files are saved

**3. Login not working**
- **Check**: Verify email and password
- **Reset**: Use setup system to recreate admin user
- **Verify**: Ensure Users sheet has proper structure

**4. HTML dialogs not opening**
- **Solution**: Check if HTML files are properly named
- **Verify**: Ensure all HTML content is copied correctly
- **Refresh**: Reload the spreadsheet

**5. Calculations not working**
- **Check**: Settings sheet for proper tax configuration
- **Verify**: Inventory sheet has valid price data
- **Update**: Refresh product data in POS interface

### **Performance Optimization**

1. **Limit Data Size**: Keep historical data in separate sheets
2. **Regular Cleanup**: Archive old logs and sales data
3. **Optimize Formulas**: Use efficient lookup functions
4. **Batch Operations**: Group multiple updates together

### **Security Best Practices**

1. **Change Default Password**: Immediately after setup
2. **Regular Password Updates**: Enforce password changes
3. **Role-Based Access**: Assign minimum required permissions
4. **Monitor Logs**: Regularly check system logs
5. **Backup Data**: Export important data regularly

## 🔄 **Data Backup & Recovery**

### **Backup Procedures**
1. **Manual Backup**: 
   - File → Download → Excel (.xlsx)
   - Save Apps Script code separately

2. **Automated Backup**:
   - Use Google Drive version history
   - Set up automated exports

### **Recovery Process**
1. **From Version History**: File → Version history → See version history
2. **From Backup File**: Upload backup and re-setup Apps Script
3. **Partial Recovery**: Copy specific sheets from backup

## 📈 **Advanced Features**

### **Custom Reports**
- Modify Reports.html for custom analytics
- Add new chart types
- Create custom date ranges
- Export to different formats

### **Integration Options**
- Connect to external databases
- API integrations for payment processing
- Email notifications for low stock
- Webhook integrations

### **Customization**
- Modify UI colors and themes
- Add new product categories
- Custom discount rules
- Multi-location support

## 🆘 **Support & Resources**

### **Documentation**
- Google Apps Script: [developers.google.com/apps-script](https://developers.google.com/apps-script)
- Google Sheets API: [developers.google.com/sheets](https://developers.google.com/sheets)

### **Common Modifications**

**Adding New Product Categories**:
```javascript
function getProductIcon(category) {
    const icons = {
        'Beverage': '🥤',
        'Food': '🍕',
        'Electronics': '📱',
        'NewCategory': '🆕'  // Add your category here
    };
    return icons[category] || '📦';
}
```

**Modifying Tax Calculation**:
```javascript
// In the submitSale function, modify tax calculation
var taxRate = getSettingValue('Tax (%)') / 100;
var taxAmount = afterDiscount * taxRate;
```

## 📝 **License & Credits**

This POS system is created as a demonstration of Google Apps Script capabilities. Feel free to modify and adapt it for your business needs.

### **Technologies Used**
- Google Apps Script (Backend)
- Google Sheets (Database)
- HTML5 & CSS3 (Frontend)
- JavaScript (Client-side logic)

---

## 🎉 **Getting Started Checklist**

- [ ] Create new Google Sheets file
- [ ] Set up Apps Script with Code.gs
- [ ] Add all HTML files
- [ ] Run system setup
- [ ] Login with default credentials
- [ ] Change default password
- [ ] Add sample products
- [ ] Create additional users
- [ ] Test POS functionality
- [ ] Configure settings
- [ ] Generate test reports

**Ready to start? Follow the Quick Setup Guide above! 🚀**