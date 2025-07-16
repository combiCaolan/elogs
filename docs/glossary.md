# Glossary

## Table of Contents
- [A](#a) | [B](#b) | [C](#c) | [D](#d) | [E](#e) | [F](#f) | [G](#g) | [H](#h) | [I](#i) | [J](#j) | [K](#k) | [L](#l) | [M](#m)
- [N](#n) | [O](#o) | [P](#p) | [Q](#q) | [R](#r) | [S](#s) | [T](#t) | [U](#u) | [V](#v) | [W](#w) | [X](#x) | [Y](#y) | [Z](#z)

---

## A

### Access Control
A security mechanism that determines which users can access specific features or data within the eLog Viewer application. Access is controlled through hierarchical levels (0-8).

### Access Level
A numeric value (0-8) assigned to users that determines their permissions within the application. Higher numbers indicate greater access privileges.

### API (Application Programming Interface)
A set of programming interfaces that allow different software components to communicate with each other. In eLog Viewer, APIs handle data processing and WordPress integration.

### Application State
The current condition of the eLog Viewer application, including loaded data, user preferences, active filters, and UI state.

---

## B

### Battery Event
Log entries (300-399 series) that record battery-related activities such as charging status, temperature readings, and state of charge updates.

### Bit-mask Processing
A technique used to extract individual fault flags from binary data, particularly important for Curtis steering controller fault analysis.

### BMS (Battery Management System)
The electronic system that manages rechargeable batteries by monitoring their state, calculating secondary data, and controlling their environment.

### Bootstrap
The CSS framework (version 5.3.3) used for styling and responsive design in the eLog Viewer interface.

---

## C

### CBE
Combilift's electric forklift series. Common models include CBE3000, CBE4000, etc.

### Combilift
Irish manufacturer of multi-directional forklifts and materials handling equipment. The company for which this eLog Viewer was developed.

### CSV (Comma-Separated Values)
The file format used for log files. Contains machine data in a structured text format with semicolon delimiters.

### Curtis Controller
Electronic motor controllers manufactured by Curtis Instruments, commonly used in Combilift machines for traction and steering control.

### Curtis_S_
Prefix for steering controller fault codes. Numbers 1-64 represent different steering system faults.

### Curtis_TP_
Prefix for traction controller fault codes. Numbers 1-88+ represent different traction system faults.

---

## D

### Dealer
A Combilift authorized dealer with access level 6, permitted to view customer machine logs and perform diagnostics.

### Device ID
Numeric identifier used in log files to specify which machine component generated a particular log entry.

### Dictionary
Configuration files that map codes to human-readable descriptions, including labels, scaling factors, units, and detailed explanations.

### DOM (Document Object Model)
The programming interface for HTML documents that allows JavaScript to manipulate webpage content dynamically.

---

## E

### eCompass
Combilift's technical documentation and support system, accessible through the eLog Viewer Tools menu.

### eLog Viewer
The web-based application for viewing and analyzing Combilift machine log files.

### Epoch Time
Unix timestamp format representing seconds since January 1, 1970, used for precise time recording in log files.

### Event Code
Numeric identifier (100-599) that specifies the type of log entry, such as service events, system events, or fault conditions.

### Export
Function that converts filtered log data into a downloadable CSV file for external analysis or reporting.

---

## F

### Fault Code
Specific numeric identifier that indicates a particular error or fault condition detected by machine controllers.

### File API
Browser technology that allows web applications to read local files selected by users, essential for log file upload functionality.

### Filtering
Process of displaying only log entries that meet specific criteria, such as date ranges or text search terms.

### Firmware
Low-level software that controls electronic components in Combilift machines, often referenced in log entries.

---

## G

### GUI (Graphical User Interface)
The visual interface of the eLog Viewer application, including tables, buttons, menus, and other interactive elements.

---

## H

### Header
The first line of a log file (starting with #) that contains metadata such as machine model, serial number, and file type.

### Hourmeter
Electronic device that tracks machine operating hours, important for maintenance scheduling and usage analysis.

### HPD (High Pedal Disable)
Safety feature that prevents machine operation if throttle is pressed during startup sequence.

---

## I

### Integration
The connection between eLog Viewer and other systems, primarily WordPress for user authentication and management.

### Interlock
Safety system that prevents machine operation unless specific conditions are met, such as operator presence or proper key switch position.

---

## J

### JavaScript
Programming language used for client-side functionality in the eLog Viewer, including file processing and user interface interactions.

### JSON (JavaScript Object Notation)
Data interchange format used for storing processed log data in browser memory and configuration files.

---

## K

### Key Switch (KSI)
Main power control switch on Combilift machines that activates electrical systems and is monitored in log files.

---

## L

### Label Dictionary
Configuration file mapping that translates numeric codes into descriptive text labels for display in the user interface.

### Log Entry
Individual record in a log file representing a specific event, fault, or system state change with timestamp and associated data.

### Log Structure
Configuration that defines how log entries are parsed and which parameters are available for each event type.

---

## M

### MasterArray
JavaScript variable containing all processed log entries in memory, serving as the primary data source for table display.

### MoCAS
Combilift's internal system for software updates and configuration management, referenced in some log entries.

### Modal
UI component (popup dialog) used for displaying detailed information or secondary interfaces without leaving the main page.

---

## N

### Node ID
Identifier used in CAN bus communication to specify which electronic control unit is sending or receiving messages.

---

## O

### Operator
User with basic access level (0-3) who can view operational logs but has limited access to diagnostic or service information.

### Over-temperature
Fault condition that occurs when controller or motor temperatures exceed safe operating limits.

---

## P

### Parameter
Configurable setting or measured value in machine controllers, often recorded in log entries for diagnostic purposes.

### Parsing
Process of analyzing raw log file content and converting it into structured data for display and analysis.

### PDO (Process Data Object)
CAN bus communication protocol used for real-time data exchange between machine controllers.

### PHP
Server-side programming language used for user authentication, access control, and WordPress integration.

### Pre-operation Check
Safety procedure performed before machine operation, ensuring all systems are functioning correctly.

---

## Q

### Query
Search term or filter criteria used to find specific log entries or information within the dataset.

---

## R

### Responsive Design
Web design approach that ensures the application interface adapts to different screen sizes and devices.

### Role-based Access Control (RBAC)
Security model where user permissions are determined by their assigned role within the organization.

---

## S

### Scale Factor
Numeric multiplier used to convert raw values from log files into human-readable measurements with appropriate units.

### Serial Number
Unique identifier assigned to each Combilift machine, used to prevent mixing logs from different machines.

### Service Event
Log entries (100-199 series) related to maintenance activities, service intervals, and maintenance reset operations.

### Session Storage
Browser technology for temporarily storing data during a user session, used extensively for log data and configuration.

### Sidebar
Left panel of the eLog Viewer interface containing filters, machine information, and detailed entry display.

### System Event
Log entries (200-299 series) that record system-level activities such as boot/shutdown, configuration changes, and software updates.

---

## T

### Timestamp
Date and time when a log entry was recorded, typically stored in epoch format and displayed in human-readable form.

### Traction Controller
Electronic system that controls drive motor operation in Combilift machines, identified by Curtis_TP_ fault codes.

---

## U

### UI (User Interface)
The visual and interactive elements of the eLog Viewer application that users interact with to view and analyze log data.

### Undervoltage
Fault condition that occurs when battery or system voltage drops below minimum operating requirements.

### Units Dictionary
Configuration file that defines measurement units (volts, amps, degrees, etc.) for values displayed in the interface.

---

## V

### Validation
Process of checking data integrity, file format correctness, and user input to ensure application reliability and security.

---

## W

### WordPress
Content management system used for user authentication and role management in the eLog Viewer application.

### Web Storage
Browser technology including sessionStorage and localStorage for client-side data persistence.

---

## X

### XAMPP
Development environment package that includes Apache, MySQL, PHP, and Perl, commonly used for local development.

---

## Y

### Year Rollover
Potential issue when processing log files that span across calendar year boundaries, requiring careful timestamp handling.

---

## Z

### Zero-based Indexing
Programming convention where counting starts from 0 instead of 1, used throughout the application's data structures and arrays.

---

## Technical Acronyms

### BMS
**Battery Management System** - Electronic system managing rechargeable battery operation and safety.

### CAN
**Controller Area Network** - Vehicle bus standard for communication between microcontrollers and devices.

### CSS
**Cascading Style Sheets** - Styling language used for describing the presentation of HTML documents.

### CSV
**Comma-Separated Values** - File format storing tabular data in plain text with delimited fields.

### DOM
**Document Object Model** - Programming interface for HTML and XML documents.

### HTML
**HyperText Markup Language** - Standard markup language for creating web pages.

### HTTP
**HyperText Transfer Protocol** - Application protocol for distributed, collaborative, hypermedia information systems.

### JSON
**JavaScript Object Notation** - Lightweight data-interchange format that is easy for humans to read and write.

### PHP
**PHP: Hypertext Preprocessor** - Server-side scripting language designed for web development.

### SQL
**Structured Query Language** - Domain-specific language used for managing data in relational databases.

### UI
**User Interface** - The space where interactions between humans and machines occur.

### URL
**Uniform Resource Locator** - Reference to a web resource that specifies its location on a computer network.

### UTF-8
**Unicode Transformation Format – 8-bit** - Character encoding capable of encoding all possible characters.

### XML
**eXtensible Markup Language** - Markup language that defines rules for encoding documents in a format that is both human-readable and machine-readable.

---

## Combilift-Specific Terms

### CBE Series
Combilift's electric forklift product line, including models like CBE3000, CBE4000, CBE5000.

### Combi-C
Combilift truck model identifier for specific configurations.

### Combi-CB
Combilift counterbalance truck series.

### Combi-CS
Combilift straddle carrier series.

### Combi-SC
Combilift sideloader series.

### Combi-WR4
Four-way reach truck in Combilift's product range.

---

## File Format Terms

### Header Line
First line in log file starting with # containing machine metadata.

### Data Line
Subsequent lines containing actual log entry data with semicolon separators.

### Delimiter
Character (semicolon ;) used to separate fields in CSV log files.

### Field
Individual data element within a log entry, such as timestamp or device ID.

### Record
Complete log entry consisting of multiple fields representing a single event.

---

## User Role Definitions

### Generic Operator (Level 0)
Basic user with minimal access to operational logs only.

### Operator Low/Standard/High (Levels 1-3)
Progressive operator access levels with increasing visibility into machine data.

### Service Technician (Level 4)
Maintenance personnel with access to service logs and fault diagnostics.

### Manager (Level 5)
Supervisory personnel with access to management reports and analytics.

### Dealer (Level 6)
Authorized Combilift dealers with customer machine access and diagnostic capabilities.

### Combilift Staff (Level 7)
Combilift employees with internal system access and full diagnostic capabilities.

### Developer (Level 8)
System developers with complete access including debugging and configuration features.

---

## Error Types and Categories

### File Format Error
Issue with log file structure, header format, or data integrity.

### Authentication Error
Problem with user login, session management, or access permissions.

### Processing Error
Failure during log file parsing, data conversion, or analysis.

### Network Error
Connectivity issue preventing file loading or server communication.

### Browser Error
Client-side issue related to browser capabilities or compatibility.

### Memory Error
Insufficient system resources for processing large files or datasets.

---

*This glossary is maintained by the Combilift Development Team and updated regularly with new terms and definitions.*