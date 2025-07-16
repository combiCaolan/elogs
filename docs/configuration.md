# Configuration Guide

## Table of Contents
1. [Application Configuration](#application-configuration)
2. [Dictionary Management](#dictionary-management)
3. [Access Control Configuration](#access-control-configuration)
4. [UI Customization](#ui-customization)
5. [Language Support](#language-support)
6. [Performance Tuning](#performance-tuning)
7. [Security Settings](#security-settings)
8. [Integration Configuration](#integration-configuration)

## Application Configuration

### Basic Settings

#### Test Mode Configuration
Control development vs production behavior in `Verify.php`:

```php
<?php
// Development/Test Mode
$test_mode = True;  // Enable for development
// $test_mode = False; // Enable for production

if ($test_mode) {
    // Set developer access level for testing
    echo '<script> var AccessLevelForUser = "8";</script>';
    echo '<script>sessionStorage.setItem("AccessLevel","8");</script>';
    return;
}
```

**Test Mode Features:**
- Bypasses WordPress authentication
- Sets developer access level (8)
- Enables all functionality
- Useful for development and testing

#### WordPress Integration Path
Configure the WordPress integration path in `Verify.php`:

```php
// Relative path (common setup)
include_once('../wp-load.php');

// Absolute path (if needed)
// include_once('/var/www/html/wordpress/wp-load.php');

// Conditional loading with error handling
if (file_exists('../wp-load.php')) {
    include_once('../wp-load.php');
} else {
    error_log('WordPress not found at expected path');
    header('HTTP/1.1 500 Internal Server Error');
    exit('WordPress integration not available');
}
```

### File Upload Limits

#### Client-Side Limits
Configure in `assets/js/index.js`:

```javascript
// File size validation (in InitialReadFile function)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

if (file.size > MAX_FILE_SIZE) {
    alert('File too large. Maximum size is 10MB.');
    return;
}
```

#### Server-Side Limits
Configure PHP settings for file uploads:

```ini
# php.ini settings
upload_max_filesize = 10M
post_max_size = 12M
max_execution_time = 300
memory_limit = 256M
```

## Dictionary Management

### Adding New Event Types

#### Step 1: LogDefinitionFile.txt
Add new event definitions:

```csv
# Format: Code,Label,Scale,Units,Description
600,Action,*,Custom Event,Custom event description
601,Measurement,1,Units,Measurement with units
602,Parameter,0.1,°C,Temperature reading scaled by 0.1
```

**Scale Types:**
- `*`: Use units field directly as value
- `!`: Key-based lookup (uses Dictionary3.txt)
- `Number`: Multiply raw value by this factor

#### Step 2: LogStructure.txt
Define data structure for new events:

```csv
# Format: EventCode,AccessLevel,Param1,Param2,Param3,Param4
600,5,empty,empty,empty,Active_User
601,4,SensorValue,SensorUnits,empty,Active_User
602,3,RawValue,ScaledValue,DeviceID,Active_User
```

**Access Levels:**
- 0-3: Operator levels
- 4: Service technician
- 5: Manager
- 6: Dealer
- 7: Combilift staff
- 8: Developer

#### Step 3: Dictionary3.txt (if needed)
Add key-value mappings for `!` scale types:

```
CustomEvent_0:Option Zero
CustomEvent_1:Option One
CustomEvent_2:Option Two
NewParameter_0:Low
NewParameter_1:Medium
NewParameter_2:High
```

### Modifying Existing Events

#### Update Event Description
Modify existing entries in `LogDefinitionFile.txt`:

```csv
# Before
Curtis_TP_1,Fault,*,38 - Main Contactor Welded,Original description

# After  
Curtis_TP_1,Fault,*,38 - Main Contactor Welded,Enhanced description with more detail
```

#### Change Access Requirements
Update access level in `LogStructure.txt`:

```csv
# Make event accessible to lower access levels
Curtis_TP_1,3,Soc,Keyswitch_Voltage,Main_State,empty  # Was level 5, now level 3
```

### Device Management

#### Adding New Devices
Add device definitions to `LogDefinitionFile.txt`:

```csv
Device_50,Device,*,LIDAR,Light Detection and Ranging sensor
Device_51,Device,*,CAM,Camera system
Device_52,Device,*,GPS,GPS positioning system
```

Update `Dictionary3.txt` with device mappings:

```
Device_50:LIDAR
Device_51:Camera
Device_52:GPS
```

## Access Control Configuration

### User Role Mapping

#### WordPress Role Integration
Configure role mapping in `Verify.php`:

```php
function display_user_roles() {
    $user_id = get_current_user_id();
    $user_info = get_userdata($user_id);
    $user_roles = $user_info->roles;
    $user_email = wp_get_current_user()->user_email;
    
    // Custom role mapping logic
    if (in_array('administrator', $user_roles)) {
        return '8'; // Developer access
    } else if (in_array('elogs_combilift', $user_roles)) {
        return '7'; // Combilift staff
    } else if (in_array('elogs_dealer', $user_roles)) {
        return '6'; // Dealer access
    } else if (in_array('elogs_manager', $user_roles)) {
        return '5'; // Manager access
    } else if (in_array('elogs_service', $user_roles)) {
        return '4'; // Service technician
    } else if (strpos($user_email, '@combilift.') !== false) {
        return '7'; // Combilift email domain
    }
    
    return '0'; // Default operator access
}
```

#### Custom Access Rules
Add domain-based or custom logic:

```php
function determine_access_level($user) {
    $email = $user->user_email;
    $roles = $user->roles;
    
    // Domain-based access
    if (strpos($email, '@combilift.com') !== false) {
        return 7;
    } else if (strpos($email, '@dealer.') !== false) {
        return 6;
    }
    
    // Role-based access
    if (in_array('service_manager', $roles)) {
        return 5;
    }
    
    // Default
    return 0;
}
```

### Creating WordPress Roles

#### Add Custom Roles
Add to WordPress `functions.php` or use a plugin:

```php
function setup_elogs_roles() {
    // Remove existing roles first (optional)
    remove_role('elogs_operator');
    remove_role('elogs_service');
    remove_role('elogs_dealer');
    remove_role('elogs_combilift');
    
    // Add eLog specific roles
    add_role('elogs_operator', 'eLog Operator', [
        'read' => true,
        'elogs_basic_access' => true
    ]);
    
    add_role('elogs_service', 'eLog Service Technician', [
        'read' => true,
        'elogs_service_access' => true
    ]);
    
    add_role('elogs_dealer', 'eLog Dealer', [
        'read' => true,
        'elogs_dealer_access' => true
    ]);
    
    add_role('elogs_combilift', 'eLog Combilift Staff', [
        'read' => true,
        'elogs_full_access' => true,
        'manage_options' => true
    ]);
}

// Run once to create roles
add_action('init', 'setup_elogs_roles');
```

## UI Customization

### Styling Configuration

#### Color Scheme
Modify primary colors in `assets/css/index.css`:

```css
/* Company branding colors */
:root {
    --primary-color: #0d6938;      /* Combilift green */
    --secondary-color: #07351c;    /* Dark green */
    --accent-color: #28a745;       /* Success green */
    --warning-color: #ffc107;      /* Warning yellow */
    --danger-color: #dc3545;       /* Error red */
}

.navbar {
    background: linear-gradient(180deg, var(--primary-color) 0, var(--secondary-color)) !important;
}

.btn-primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}
```

#### Layout Adjustments
Modify layout constraints:

```css
/* Sidebar width constraints */
#SideMenu {
    min-width: 200px;  /* Minimum sidebar width */
    max-width: 600px;  /* Maximum sidebar width */
    width: 250px;      /* Default sidebar width */
}

/* Table responsiveness */
@media (max-width: 768px) {
    #MainBody {
        padding: 10px;  /* Reduce padding on mobile */
    }
    
    table {
        font-size: 0.9em;  /* Smaller text on mobile */
    }
}
```

#### Custom Logos
Replace logos in the application:

```html
<!-- Main logo -->
<img id="LogoHead" src="assets/img/your-logo.png" alt="Your Company Logo">

<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="assets/Favicons/your-favicon.png">
```

### Interface Elements

#### Table Customization
Modify table appearance:

```css
/* Custom table styling */
table th {
    background: linear-gradient(180deg, #your-color1 0, #your-color2) !important;
    color: white;
    font-weight: 600;
}

table tr:hover {
    background-color: #your-hover-color;
}

/* Fault highlighting */
.fault-row {
    background-color: #ffebee !important;
    border-left: 4px solid #f44336;
}

.warning-row {
    background-color: #fff8e1 !important;
    border-left: 4px solid #ff9800;
}
```

#### Button Styling
Customize button appearance:

```css
.btn-custom {
    background: linear-gradient(135deg, #your-primary, #your-secondary);
    border: none;
    color: white;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-custom:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
```

## Language Support

### Adding New Languages

#### Step 1: Create Language Directory
Create new language folder structure:

```
Dictionary/
├── english/            # Existing
│   ├── Dictionary3.txt
│   ├── LogDefinitionFile.txt
│   ├── LogStructure.txt
│   └── TranslateFile.txt
└── spanish/            # New language
    ├── Dictionary3.txt
    ├── LogDefinitionFile.txt
    ├── LogStructure.txt
    └── TranslateFile.txt
```

#### Step 2: Translate Dictionary Files
Translate `TranslateFile.txt`:

```
# English version
CombiTitle:Log Viewer
FilterThroughLogs:Filter Through Logs
InfoAboutLineBTN:Info About Line
ExportResultsButton:Export Results

# Spanish version
CombiTitle:Visor de Registros
FilterThroughLogs:Filtrar Registros
InfoAboutLineBTN:Información de Línea
ExportResultsButton:Exportar Resultados
```

#### Step 3: Update Language Selection
Modify language loading logic:

```javascript
// Language detection and loading
function setLanguage() {
    const userLang = navigator.language.substring(0, 2);
    const supportedLangs = ['en', 'es', 'fr', 'de'];
    
    const selectedLang = supportedLangs.includes(userLang) ? userLang : 'en';
    sessionStorage.setItem('Language', selectedLang);
}

// Load language-specific files
async function loadTranslateFile() {
    const language = sessionStorage.getItem('Language') || 'english';
    const file = `Dictionary/${language}/TranslateFile.txt`;
    const text = await fetchTextFile(file);
    
    if (text !== null) {
        sessionStorage.setItem('LanguageFile', text);
        applyTranslations(text);
    }
}
```

### Dynamic Translation

#### Apply Translations
```javascript
function applyTranslations(translationData) {
    const translations = {};
    const lines = translationData.split('\n');
    
    lines.forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
            translations[key] = value;
        }
    });
    
    // Apply to UI elements
    Object.keys(translations).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = translations[key];
        }
    });
}
```

## Performance Tuning

### Client-Side Optimization

#### Memory Management
Configure memory usage limits:

```javascript
// Large file handling configuration
const PERFORMANCE_CONFIG = {
    MAX_ENTRIES_IN_MEMORY: 10000,    // Limit entries in memory
    CHUNK_SIZE: 1000,                // Process in chunks
    UI_UPDATE_INTERVAL: 100,         // Milliseconds between UI updates
    ENABLE_COMPRESSION: true,        // Compress stored data
    ENABLE_LAZY_LOADING: true        // Load data on demand
};

// Apply memory limits
function addLogEntry(entry) {
    if (MasterArray.length >= PERFORMANCE_CONFIG.MAX_ENTRIES_IN_MEMORY) {
        // Remove oldest entries or implement pagination
        MasterArray.shift();
    }
    MasterArray.push(entry);
}
```

#### Processing Optimization
```javascript
// Chunked processing for large files
async function processLargeFile(logData) {
    const lines = logData.split('\n');
    const chunks = chunkArray(lines, PERFORMANCE_CONFIG.CHUNK_SIZE);
    
    for (let i = 0; i < chunks.length; i++) {
        await processChunk(chunks[i]);
        
        // Update progress
        const progress = ((i + 1) / chunks.length) * 100;
        updateProgressBar(progress);
        
        // Allow UI updates
        await sleep(PERFORMANCE_CONFIG.UI_UPDATE_INTERVAL);
    }
}
```

### Server-Side Optimization

#### PHP Configuration
Optimize PHP settings for performance:

```ini
# php.ini optimizations
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000
opcache.validate_timestamps=0
opcache.save_comments=0
opcache.fast_shutdown=1
```

#### Caching Configuration
```php
// Enable static file caching
function setCacheHeaders($filename) {
    $etag = md5_file($filename);
    $lastModified = filemtime($filename);
    
    header("ETag: $etag");
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $lastModified) . ' GMT');
    header('Cache-Control: public, max-age=31536000'); // 1 year
    
    // Check if client has cached version
    if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && 
        $_SERVER['HTTP_IF_NONE_MATCH'] === $etag) {
        http_response_code(304);
        exit;
    }
}
```

## Security Settings

### Input Validation

#### File Upload Security
```javascript
// Enhanced file validation
function validateFileUpload(file) {
    // File type validation
    const allowedTypes = ['text/csv', 'application/csv'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type');
    }
    
    // File size validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        throw new Error('File too large');
    }
    
    // File name validation
    const safeFilename = /^[a-zA-Z0-9._-]+\.csv$/;
    if (!safeFilename.test(file.name)) {
        throw new Error('Invalid filename');
    }
    
    return true;
}
```

#### Content Security Policy
Add CSP headers for enhanced security:

```php
// Security headers
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com ajax.googleapis.com; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net;");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
```

### Session Security

#### Session Configuration
```php
// Secure session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_samesite', 'Strict');

// Session timeout
$timeout = 8 * 60 * 60; // 8 hours
if (isset($_SESSION['last_activity']) && 
    (time() - $_SESSION['last_activity']) > $timeout) {
    session_unset();
    session_destroy();
    header('Location: /login');
    exit;
}
$_SESSION['last_activity'] = time();
```

## Integration Configuration

### WordPress Integration

#### Custom WordPress Configuration
```php
// Advanced WordPress integration
class WordPressIntegration {
    private $wpPath;
    
    public function __construct($wpPath = '../wp-load.php') {
        $this->wpPath = $wpPath;
        $this->initializeWordPress();
    }
    
    private function initializeWordPress() {
        if (!file_exists($this->wpPath)) {
            throw new Exception('WordPress not found at: ' . $this->wpPath);
        }
        
        require_once($this->wpPath);
        
        if (!function_exists('is_user_logged_in')) {
            throw new Exception('WordPress functions not available');
        }
    }
    
    public function getAuthenticatedUser() {
        if (!is_user_logged_in()) {
            $this->redirectToLogin();
        }
        
        return wp_get_current_user();
    }
}
```

### External API Integration

#### API Configuration
```javascript
// API integration configuration
const API_CONFIG = {
    BASE_URL: '/api/v1/',
    TIMEOUT: 30000,          // 30 seconds
    RETRY_ATTEMPTS: 3,
    ENABLE_CACHING: true,
    CACHE_DURATION: 300000   // 5 minutes
};

class APIClient {
    constructor(config = API_CONFIG) {
        this.config = config;
        this.cache = new Map();
    }
    
    async request(endpoint, options = {}) {
        const url = this.config.BASE_URL + endpoint;
        const cacheKey = `${url}_${JSON.stringify(options)}`;
        
        // Check cache first
        if (this.config.ENABLE_CACHING && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.config.CACHE_DURATION) {
                return cached.data;
            }
        }
        
        // Make request with retry logic
        for (let attempt = 1; attempt <= this.config.RETRY_ATTEMPTS; attempt++) {
            try {
                const response = await fetch(url, {
                    timeout: this.config.TIMEOUT,
                    ...options
                });
                
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Cache successful response
                if (this.config.ENABLE_CACHING) {
                    this.cache.set(cacheKey, {
                        data: data,
                        timestamp: Date.now()
                    });
                }
                
                return data;
                
            } catch (error) {
                if (attempt === this.config.RETRY_ATTEMPTS) {
                    throw error;
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }
}
```

## Environment-Specific Configuration

### Development Environment
```php
// development.php
define('ELOGS_DEBUG', true);
define('ELOGS_LOG_LEVEL', 'DEBUG');
define('ELOGS_CACHE_ENABLED', false);

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', '/var/log/elogs/error.log');
```

### Production Environment
```php
// production.php
define('ELOGS_DEBUG', false);
define('ELOGS_LOG_LEVEL', 'ERROR');
define('ELOGS_CACHE_ENABLED', true);

// Disable error display
error_reporting(0);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', '/var/log/elogs/error.log');
```

### Configuration Loading
```php
// Load environment-specific configuration
$environment = $_SERVER['ELOGS_ENV'] ?? 'production';
$configFile = __DIR__ . "/config/{$environment}.php";

if (file_exists($configFile)) {
    require_once($configFile);
} else {
    // Fallback to default configuration
    require_once(__DIR__ . '/config/default.php');
}
```

---

*Configuration guide maintained by Combilift Development Team*