# Combilift eLog Viewer

A web-based log viewer for Combilift eLogs. This tool allows users to upload, view, filter, and export machine log files, supporting multiple languages and user access levels.

---

## Features

- **Log File Upload:** Upload `.csv` log files for viewing and analysis.
- **Dictionary Support:** Dynamic loading of log definitions, translations, and structure based on selected language.
- **User Access Levels:** Features and log structures adapt to the user's access level.
- **Filtering & Sorting:** Filter logs by time and search by keywords.
- **Export Functionality:** Export viewable logs and send to server.
- **Multi-language UI:** Interface supports multiple languages via dictionary files.

---

## Project Structure

- Download.php, index.php, Verify.php,
- assets/
- css/
- js/
- Favicons/
- ecompassLogo.png, eLogsLogo.png,
- Dictionary/
- english/
- Dictionary3.txt,
- LogDefinitionFile.txt,
- LogStructure.txt,
- LogStructure_Combi.txt,
- TranslateFile.txt,
- includes/
- dialog.html,
- HeadContent.html

- **assets/js/**: Main JavaScript logic for loading files, parsing logs, and UI interactions.
- **Dictionary/**: Contains language-specific dictionary and structure files.
- **includes/**: HTML fragments for headers and dialogs.
- **index.php**: Main entry point for the web application.

---

## Startup Logic (`assets/js/OnStart.js`)

The startup script initializes the application by loading required dictionaries and language files:

- **Language Selection:** Sets the default language in `sessionStorage` if not already set.
- **Dictionary Loading:** Loads translation, label, scale, units, and description dictionaries from text files into `sessionStorage` and global variables.
- **Log Structure:** Loads log structure definitions based on user access level.
- **Key Dictionary:** Loads additional key-value pairs for log parsing.

**Main startup function:**
```javascript
async function OnStart(accessLevelForUser = 0) {
  setDefaultLanguage();
  await loadLogDefinitionFile();
  await loadTranslateFile();
  await loadLogStructureFile(accessLevelForUser);
  await loadDictionary3File();
}

// Example usage:
OnStart(8); // Replace 8 with the actual access level of the user
```
### Getting Started

1. **Clone this repository**
  ``` git clone https://github.com/your-org/elogs.git```
2. **Deploy to your web server**
Place the project in your web server's root directory (e.g., ``` htdocs``` for XAMPP).
3. Access the application
Open ``` index.php``` in your browser.
4. Login and upload logs
- Enter your credentials.
- upload a ``` .csv``` log file.
- View,filter,and export logs as needed.

### Customisation
- **Add new languages**:
Copy the ``` english``` folder in ``` Dictionary```, translate the files, and updaate the language selection logic.
- **Change UI styles**:
Edit CSS files in ``` assets/css```

### License
This project is propietary to Combilift Ltd.

For more details, see the code in ``` assets/js/OnStart.js ``` and ``` assets/js/index.js```
