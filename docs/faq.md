# Frequently Asked Questions (FAQ)

## Table of Contents
1. [General Questions](#general-questions)
2. [File Upload & Processing](#file-upload--processing)
3. [User Access & Permissions](#user-access--permissions)
4. [Data Analysis & Interpretation](#data-analysis--interpretation)
5. [Export & Reporting](#export--reporting)
6. [Technical Issues](#technical-issues)
7. [Security & Privacy](#security--privacy)
8. [Mobile & Browser Support](#mobile--browser-support)
9. [Integration & API](#integration--api)
10. [Troubleshooting](#troubleshooting)

---

## General Questions

### What is the Combilift eLog Viewer?
The Combilift eLog Viewer is a web-based application designed to view, analyze, and manage machine log files from Combilift industrial vehicles and equipment. It provides comprehensive diagnostic capabilities for technical support, dealers, and operators.

### Who can use the eLog Viewer?
The application is designed for multiple user types:
- **Operators** (Levels 0-3): Basic operational logs
- **Service Technicians** (Level 4): Maintenance and service logs
- **Managers** (Level 5): Management reports and analytics
- **Dealers** (Level 6): Customer machine diagnostics
- **Combilift Staff** (Level 7-8): Full system access

### Is there a cost to use the eLog Viewer?
The eLog Viewer is provided as part of Combilift's support services. Access is typically included with machine purchases and service contracts. Contact your Combilift representative for specific details.

### Can I use the eLog Viewer offline?
No, the eLog Viewer requires an internet connection for:
- User authentication through WordPress
- Loading dictionary files
- Accessing help documentation
- Security and access control validation

However, once loaded, file processing occurs locally in your browser.

---

## File Upload & Processing

### What file formats are supported?
**Supported Format**: CSV (Comma-Separated Values) files with semicolon delimiters
**File Extension**: `.csv`
**Maximum Size**: 10MB (recommended for optimal performance)

### Why won't my log file upload?
Common reasons for upload failures:
1. **Wrong file format**: Only .csv files are accepted
2. **File too large**: Files over 10MB may cause issues
3. **Corrupted file**: File may be damaged or incomplete
4. **Missing header**: Log files must start with a header line beginning with `#`
5. **Browser issues**: Try refreshing the page or clearing cache

### How long does file processing take?
Processing time depends on several factors:
- **Small files** (<1MB): 1-5 seconds
- **Medium files** (1-5MB): 10-30 seconds
- **Large files** (5-10MB): 30-60 seconds
- **Browser performance**: Newer browsers process faster
- **Computer specs**: More RAM and faster processors help

### Can I upload multiple log files?
Yes, you can upload multiple files from the same machine. The system will:
- Combine compatible log files automatically
- Verify all files are from the same machine (serial number)
- Warn if files are from different machines
- Process them in chronological order

### What happens to my log files after upload?
**Security Note**: Log files are processed entirely in your browser and are never stored permanently on Combilift servers:
- Files are processed locally in browser memory
- Data is stored temporarily in browser session storage
- All data is automatically cleared when you close the browser
- No log data is transmitted to external servers

---

## User Access & Permissions

### How do I get access to the eLog Viewer?
1. **Contact your Combilift representative** to request access
2. **Provide your email address** for account setup
3. **Specify your role** (operator, service tech, dealer, etc.)
4. **Wait for account activation** (typically 1-2 business days)
5. **Login using WordPress credentials** provided by Combilift

### Why can't I see certain log data?
Your access level determines which logs you can view:
- **Level 0-3**: Basic operational logs only
- **Level 4**: Service and maintenance logs
- **Level 5+**: Management and diagnostic logs
- **Level 6+**: Dealer-specific access
- **Level 7-8**: Full internal system access

Contact your administrator if you need higher access levels.

### How do I change my access level?
Access levels are controlled by Combilift administrators:
1. **Contact Combilift support** to request access level changes
2. **Provide business justification** for higher access
3. **Complete any required training** for elevated access
4. **Wait for approval** from Combilift management

### Can I share my login credentials?
**No, absolutely not**. Each user should have their own account for:
- **Security compliance**: Individual accountability
- **Audit trail**: Track who accessed what data
- **Access control**: Ensure appropriate permission levels
- **Support**: Provide better technical assistance

---

## Data Analysis & Interpretation

### What do the different fault codes mean?
**Curtis Controller Faults**:
- **Curtis_TP_X**: Traction (drive) controller faults
- **Curtis_S_X**: Steering controller faults
- **Numbers indicate specific issues**: See detailed descriptions in the application

**System Events**:
- **100-199**: Service and maintenance events
- **200-299**: System operation events (boot, shutdown, etc.)
- **300-399**: Battery and charging events
- **400-499**: Operational events

### How do I identify the root cause of a fault?
1. **Note the timestamp** when the fault occurred
2. **Look at events before the fault** for triggering conditions
3. **Check system parameters** at the time of fault (voltage, temperature, etc.)
4. **Review related faults** that may have occurred together
5. **Use the AI Assistant** for additional analysis and recommendations

### What should I do when I see a fault code I don't recognize?
1. **Click on the fault entry** to see detailed information in the sidebar
2. **Check the description field** for explanation
3. **Use the search function** to find similar faults
4. **Consult the AI Assistant** for interpretation
5. **Contact Combilift support** if the issue persists

### How accurate is the timestamp data?
Timestamps are generally very accurate:
- **Recorded in UTC**: Converted to local time for display
- **Precision**: Accurate to the second
- **Clock sync**: Machines sync with GPS when available
- **Potential drift**: Older machines may have slight clock drift

---

## Export & Reporting

### What format are exported files?
Exported files are in **CSV format** with the following characteristics:
- **Semicolon-delimited**: Compatible with Excel and other tools
- **UTF-8 encoding**: Supports international characters
- **Header included**: File contains metadata about the machine
- **Filtered data**: Only includes data visible in your current view

### Can I export all data or just filtered results?
You can export:
- **Filtered results**: Apply date range and search filters, then export
- **All visible data**: Remove all filters to export everything you have access to
- **Specific timeframes**: Use date filters to export particular periods
- **Selected events**: Use search to focus on specific fault types

### Why is my exported file smaller than expected?
Several factors can affect export size:
1. **Access level restrictions**: You may not have permission to see all data
2. **Active filters**: Date range or search filters limit results
3. **Data processing**: Some raw data may be excluded for clarity
4. **File format**: CSV compression may reduce file size

### How do I open exported files?
**Recommended applications**:
- **Microsoft Excel**: Opens CSV files directly
- **Google Sheets**: Upload to Google Drive
- **LibreOffice Calc**: Free alternative to Excel
- **Text editors**: Notepad++, VS Code for raw data viewing

**Important**: Choose semicolon as delimiter if prompted.

---

## Technical Issues

### The application is running slowly. What can I do?
**Immediate solutions**:
1. **Close other browser tabs** to free memory
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Use Chrome or Firefox** for best performance
4. **Process smaller files** if possible
5. **Restart your browser**

**System requirements**:
- **RAM**: 4GB minimum, 8GB recommended
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+
- **Internet**: Stable broadband connection

### Why do I get "out of memory" errors?
Memory errors typically occur with:
- **Very large files** (>10MB)
- **Multiple files loaded** simultaneously
- **Insufficient RAM** on your computer
- **Other memory-intensive applications** running

**Solutions**:
- Split large files into smaller chunks
- Close other applications
- Use a computer with more RAM
- Process files one at a time

### The table isn't displaying data. What's wrong?
**Common causes**:
1. **No data matches your access level**
2. **Active filters hiding all data**
3. **JavaScript errors** (check browser console)
4. **File format issues**
5. **Browser compatibility problems**

**Troubleshooting steps**:
1. Clear all filters and try again
2. Refresh the page and re-upload
3. Try a different browser
4. Check browser console for errors
5. Contact support with specific error messages

---

## Security & Privacy

### Is my data secure?
**Yes, your data is highly secure**:
- **Local processing**: All data stays in your browser
- **No server storage**: Log data never stored on remote servers
- **Encrypted connections**: HTTPS for all communications
- **Access controls**: Role-based permissions
- **Session security**: Automatic logout after 8 hours

### Can other users see my log files?
**No, log files are private**:
- **Individual sessions**: Each user has isolated data
- **No sharing between users**
- **Automatic cleanup**: Data cleared when browser closes
- **Access level restrictions**: Users only see authorized data

### What data is sent to Combilift servers?
**Minimal data transmission**:
- **Authentication**: Login credentials only
- **Access control**: User role verification
- **Activity logging**: Basic usage statistics (no log content)
- **Error reporting**: Anonymous error information for improvement

**Never transmitted**:
- Actual log file contents
- Machine operational data
- Proprietary information
- Personal information from logs

### How long is my session active?
**Session details**:
- **Duration**: 8 hours maximum
- **Idle timeout**: Session expires after 2 hours of inactivity
- **Automatic renewal**: Activity extends session
- **Manual logout**: Available in user menu
- **Browser close**: Automatically ends session

---

## Mobile & Browser Support

### Does the eLog Viewer work on mobile devices?
**Limited mobile support**:
- **Smartphones**: Basic viewing capabilities
- **Tablets**: Better experience with larger screens
- **File upload**: Supported on most mobile browsers
- **Processing**: May be slower due to device limitations
- **Recommendation**: Use desktop/laptop for best experience

### Which browsers are supported?
**Fully supported**:
- **Chrome 90+**: Recommended for best performance
- **Firefox 88+**: Full feature support
- **Safari 14+**: Mac users
- **Edge 90+**: Windows users

**Not supported**:
- Internet Explorer (any version)
- Chrome < 90
- Firefox < 88
- Safari < 14

### Why doesn't the application work in Internet Explorer?
Internet Explorer is not supported because:
- **Outdated technology**: Lacks modern web standards
- **Security vulnerabilities**: No longer receives security updates
- **Performance issues**: Cannot handle modern JavaScript
- **Microsoft recommendation**: Microsoft recommends upgrading to Edge

**Solution**: Please upgrade to a supported browser.

---

## Integration & API

### Can I integrate the eLog Viewer with other systems?
**Current integration options**:
- **WordPress**: Built-in user management integration
- **Single Sign-On**: Available for enterprise customers
- **API access**: Limited API for authorized developers

**Planned features**:
- REST API for data export
- Webhook notifications
- Third-party tool integrations

Contact Combilift support for enterprise integration options.

### Is there an API for automated log processing?
**Current status**: Limited API access available for:
- Authorized Combilift partners
- Enterprise customers with specific needs
- Internal Combilift systems

**Future plans**: Public API in development for:
- Automated log upload
- Programmatic data export
- Integration with fleet management systems

### Can I embed the eLog Viewer in my website?
**Not currently supported**:
- Security restrictions prevent iframe embedding
- Authentication requirements
- Full-page application design

**Alternative solutions**:
- Direct links to eLog Viewer
- Custom integration through API (when available)
- White-label solutions for large customers

---

## Troubleshooting

### I can't log in. What should I do?
**Common login issues**:
1. **Incorrect credentials**: Verify username and password
2. **Account not activated**: Contact Combilift support
3. **Browser issues**: Clear cache and cookies
4. **Network problems**: Check internet connection
5. **Account locked**: May be locked after failed attempts

**Solutions**:
1. Reset password through WordPress
2. Contact Combilift support
3. Try a different browser
4. Check with your IT department

### The file uploaded but no data appears. Why?
**Possible causes**:
1. **Access level restrictions**: You may not have permission for this data type
2. **Empty file**: File may contain no processable data
3. **Wrong format**: File may not be a valid log file
4. **Processing error**: Check browser console for errors

**Debugging steps**:
1. Check your access level in the user menu
2. Verify file format and content
3. Try with a known good log file
4. Contact support with specific file details

### Export isn't working. How do I fix it?
**Common export issues**:
1. **Popup blocker**: Browser blocking downloads
2. **No data selected**: Apply filters to select data
3. **Browser security**: Some browsers restrict downloads
4. **File permissions**: Check download folder permissions

**Solutions**:
1. Disable popup blocker for this site
2. Ensure data is loaded and visible
3. Try a different browser
4. Check download folder settings

### I found a bug. How do I report it?
**Bug reporting process**:
1. **Reproduce the issue** to confirm it's consistent
2. **Note the exact steps** that cause the problem
3. **Check browser console** for error messages
4. **Take screenshots** if applicable
5. **Contact Combilift support** with detailed information

**Include in your report**:
- Browser and version
- Operating system
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots or error messages
- File information (size, type, etc.)

### Who do I contact for help?
**Support channels**:
- **Combilift Technical Support**: https://support.combilift.net
- **Email**: support@combilift.net
- **Phone**: Check your regional Combilift office
- **Documentation**: This help guide and related docs

**Before contacting support**:
1. Check this FAQ
2. Try the troubleshooting steps
3. Gather relevant information (browser, file details, error messages)
4. Note your user access level and company

**Response times**:
- **Email**: 1-2 business days
- **Phone**: During business hours
- **Critical issues**: Same day response for dealers/service partners

---

## Quick Reference

### Common Shortcuts
- **Upload file**: File → Read Log File
- **Export data**: Export Results button in sidebar
- **Clear filters**: Clear button in filter section
- **Get help**: Help menu → Documentation
- **Logout**: User menu → Logout

### File Size Guidelines
- **Optimal**: Under 5MB for best performance
- **Maximum**: 10MB recommended limit
- **Large files**: Consider splitting or processing on powerful computer

### Performance Tips
- Close other browser tabs
- Use Chrome or Firefox
- Process files one at a time
- Clear browser cache regularly
- Ensure stable internet connection

### Access Level Summary
| Level | Role | Access |
|-------|------|--------|
| 0-3 | Operator | Basic operational logs |
| 4 | Service | Maintenance and service logs |
| 5 | Manager | Management reports |
| 6 | Dealer | Customer diagnostics |
| 7-8 | Combilift | Full system access |

---

*FAQ maintained by Combilift Support Team*  
*Last updated: July 2025*  
*For additional questions not covered here, contact: support@combilift.net*