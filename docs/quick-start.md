# Quick Start Guide

## Welcome to Combilift eLog Viewer! 🚀

This guide will get you up and running with the eLog Viewer in just a few minutes.

## Table of Contents
1. [First-Time Setup](#first-time-setup)
2. [Uploading Your First Log File](#uploading-your-first-log-file)
3. [Understanding the Interface](#understanding-the-interface)
4. [Basic Analysis](#basic-analysis)
5. [Exporting Data](#exporting-data)
6. [Getting Help](#getting-help)

---

## First-Time Setup

### Step 1: Access the Application
1. **Open your web browser** (Chrome, Firefox, Safari, or Edge)
2. **Navigate to**: `https://elogs.yourdomain.com` (your organization's URL)
3. **Login** with your provided credentials

### Step 2: Verify Your Access
After logging in, check your access level in the top-right user menu:
- **Level 0-3**: Operator access (basic logs)
- **Level 4**: Service technician (maintenance logs)
- **Level 5**: Manager (reports and analytics)
- **Level 6**: Dealer (customer diagnostics)
- **Level 7-8**: Combilift staff (full access)

> **Need different access?** Contact your administrator or Combilift support.

---

## Uploading Your First Log File

### Step 1: Get Your Log File Ready
- **File format**: Must be a `.csv` file
- **File size**: Under 10MB works best
- **Source**: Downloaded from your Combilift machine's system

### Step 2: Upload the File
1. Click **"File"** in the top navigation menu
2. Select **"Read Log File"**
3. Choose your `.csv` file from your computer
4. Wait for processing (usually 10-30 seconds)

### Step 3: Verify Upload Success
✅ **Success indicators**:
- Machine model and serial number appear in the left sidebar
- Log entries appear in the main table
- No error messages displayed

❌ **If something went wrong**:
- Check file format (must be `.csv`)
- Verify file isn't corrupted
- Try refreshing the page and uploading again
- See [Troubleshooting](troubleshooting.md) for more help

---

## Understanding the Interface

### Main Components

```
┌─────────────────────────────────────────────┐
│                 Top Menu                    │
│  File | Tools | Help | User Menu           │
├─────────────┬───────────────────────────────┤
│             │                               │
│   Sidebar   │        Main Table            │
│             │                               │
│ • Machine   │  • Log entries               │
│   Info      │  • Sortable columns          │
│ • Filters   │  • Click for details         │
│ • Details   │  • Scroll for more           │
│ • Export    │                               │
│             │                               │
└─────────────┴───────────────────────────────┘
```

### Key Interface Elements

#### 🔧 **Sidebar (Left Panel)**
- **Machine Info**: Model and serial number of your machine
- **Filters**: Date range and search options
- **Selected Entry Details**: Click any row to see detailed information
- **Export**: Download filtered results

#### 📊 **Main Table**
- **Sortable Columns**: Click headers to sort by timestamp, event, device, etc.
- **Color Coding**: Different event types may have different colors
- **Row Selection**: Click any row to see details in the sidebar

#### 🎛️ **Top Navigation**
- **File**: Upload and manage log files
- **Tools**: Access eCompass and knowledge base
- **Help**: Documentation and support links
- **User Menu**: Your info, access level, and logout

---

## Basic Analysis

### Understanding Log Entries

#### Log Entry Types
| Type | Code Range | Description | Example |
|------|------------|-------------|---------|
| **Service** | 100-199 | Maintenance events | Service interval reset |
| **System** | 200-299 | Boot/shutdown events | System startup |
| **Battery** | 300-399 | Charging and power | Connected to charger |
| **Faults** | Curtis_TP/S | Controller errors | Motor overcurrent |

#### Reading Fault Codes
**Curtis Controller Faults**:
- **Curtis_TP_15**: Traction controller overtemperature
- **Curtis_S_21**: Steering controller input fault
- **Numbers indicate specific issues** - click for details

### Quick Analysis Steps

#### 1. **Check Recent Activity**
- Table is sorted by timestamp (newest first by default)
- Look at the most recent entries first
- Identify any fault codes or unusual events

#### 2. **Look for Patterns**
- Multiple similar faults in short time periods
- Events that occur together (like temperature and overcurrent faults)
- Regular occurrences (like daily charging cycles)

#### 3. **Investigate Specific Issues**
1. **Click on any fault entry** to see detailed information
2. **Check the timestamp** - when did it occur?
3. **Look at surrounding events** - what happened before/after?
4. **Note system conditions** - battery voltage, temperature, etc.

---

## Exporting Data

### Quick Export Steps

#### 1. **Apply Filters (Optional)**
- **Date Range**: Select specific time period using "From" and "To" dates
- **Search**: Type keywords to find specific events or faults
- **Clear Filters**: Use "Clear" button to reset and export everything

#### 2. **Export the Data**
1. Click the **"Export Results"** button in the sidebar
2. Your browser will download a CSV file
3. File will be named with machine info and date

#### 3. **Open Your Export**
- **Excel**: Opens directly, choose semicolon as delimiter if prompted
- **Google Sheets**: Upload the file to Google Drive
- **Text Editor**: Any text editor can open CSV files

### What's Included in Exports
✅ **Included**:
- All visible log entries (based on your access level and filters)
- Timestamps in readable format
- Event descriptions and device information
- Machine model and serial number
- All parameter values with units

❌ **Not included**:
- Data above your access level
- Filtered-out entries
- Internal system identifiers

---

## Getting Help

### Built-in Help Features

#### 🤖 **AI Assistant**
1. Click the **"🤖 AI Chatbot"** button in the sidebar
2. Ask questions about your log data:
   - "What caused this fault?"
   - "Are there any patterns in the battery data?"
   - "What should I check for overtemperature faults?"

#### 📖 **Documentation**
- **Help Menu**: Access complete documentation
- **Tooltips**: Hover over elements for quick help
- **Error Messages**: Clear explanations when something goes wrong

### Common First-Time Questions

#### ❓ **"Why can't I see some log types?"**
**Answer**: Your access level determines which logs you can view. Contact your administrator if you need higher access.

#### ❓ **"My file won't upload - what's wrong?"**
**Answer**: Check that:
- File is `.csv` format
- File size is under 10MB
- File isn't corrupted
- File has proper log header format

#### ❓ **"What do these fault codes mean?"**
**Answer**: 
- Click on any fault row for detailed description
- Use the AI assistant for explanations
- Check the [Glossary](glossary.md) for definitions

#### ❓ **"How do I find faults from last week?"**
**Answer**:
1. Use date filters in the sidebar
2. Set "From" date to a week ago
3. Click "Search" to filter
4. Look for fault codes in the results

#### ❓ **"Can I share this data with my colleague?"**
**Answer**: 
- Export the data to CSV
- Share the CSV file (be mindful of data sensitivity)
- Each user needs their own account for the web application

### Support Resources

#### 📞 **Contact Support**
- **Combilift Technical Support**: https://support.combilift.net
- **Email**: support@combilift.net
- **Phone**: Contact your regional Combilift office

#### 📚 **Additional Documentation**
- **[User Guide](user-guide.md)**: Complete usage instructions
- **[FAQ](faq.md)**: Frequently asked questions
- **[Troubleshooting](troubleshooting.md)**: Solutions to common issues
- **[Glossary](glossary.md)**: Technical terms and definitions

#### 🛠️ **Before Contacting Support**
1. Check this quick start guide
2. Try the troubleshooting steps
3. Note any error messages
4. Have your access level and machine info ready

---

## Next Steps

### Once You're Comfortable with Basics

#### 🔍 **Advanced Analysis**
- Learn about [filtering techniques](user-guide.md#filtering--searching)
- Understand [Curtis controller diagnostics](user-guide.md#analyzing-data)
- Explore [pattern recognition](user-guide.md#pattern-recognition)

#### 📊 **Reporting & Documentation**
- Master [export options](user-guide.md#exporting-results)
- Learn [diagnostic workflows](user-guide.md#diagnostic-workflow)
- Understand [best practices](user-guide.md#best-practices)

#### 🔧 **System Integration**
- Explore [API options](api-reference.md) (for developers)
- Learn about [WordPress integration](configuration.md#wordpress-integration)
- Understand [access control](configuration.md#access-control-configuration)

### Training Resources

#### 📹 **Video Tutorials** (if available)
- Basic log analysis
- Fault code interpretation
- Export and reporting

#### 📖 **Advanced Guides**
- **[User Guide](user-guide.md)**: Complete feature documentation
- **[Configuration](configuration.md)**: Customization options
- **[Performance](performance.md)**: Optimization tips

---

## Cheat Sheet

### 🚀 **Essential Actions**
| Action | How To |
|--------|--------|
| **Upload File** | File → Read Log File |
| **Sort Table** | Click column headers |
| **Filter by Date** | Use date pickers in sidebar |
| **Search Text** | Type in search box |
| **View Details** | Click any table row |
| **Export Data** | Export Results button |
| **Get Help** | Help menu or AI chatbot |
| **Logout** | User menu → Logout |

### 🔍 **Quick Diagnostics**
| Problem | First Check |
|---------|-------------|
| **No data showing** | Check access level and filters |
| **File won't upload** | Verify .csv format and size |
| **Strange fault codes** | Click row for description |
| **Missing recent data** | Check date filters |
| **Export empty** | Clear filters first |
| **Slow performance** | Close other browser tabs |

### 📋 **Log Types Reference**
| Code | Type | Look For |
|------|------|----------|
| **100-199** | Service | Maintenance schedules |
| **200-299** | System | Boot/shutdown events |
| **300-399** | Battery | Charging issues |
| **Curtis_TP** | Traction | Drive motor faults |
| **Curtis_S** | Steering | Steering faults |

---

## 🎉 You're Ready to Go!

Congratulations! You now know the basics of using the Combilift eLog Viewer. 

**Remember**:
- Start with small files to get familiar
- Don't hesitate to click around and explore
- Use the AI assistant when you have questions
- Export data regularly for your records

**Need more help?** Check out the complete [User Guide](user-guide.md) or contact [Combilift Support](https://support.combilift.net).

Happy analyzing! 📊

---

*Quick Start Guide maintained by Combilift Support Team*  
*Last updated: July 2025*  
*For questions about this guide: support@combilift.net*