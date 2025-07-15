<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Combilift - eLog Viewer</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="assets/Favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/Favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/Favicons/favicon-16x16.png">

    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/index.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
</head>

<body>
    <?php include_once('Verify.php'); ?>

    <!-- Web Header (Bootstrap version) -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary px-3">
        <div class="container-fluid">
            <!-- Brand/Logo -->
            <a class="navbar-brand d-flex align-items-center">
                <img id="LogoHead" src="assets/img/eLogsLogo.png" alt="Combilift Logo" height="40"
                    onclick="location.reload()">
            </a>
            <!-- Hamburger for mobile -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar"
                aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <!-- Navbar Content -->
            <div class="collapse navbar-collapse" id="mainNavbar">
                <ul class="navbar-nav ms-auto align-items-center">
                    <!-- File Dropdown -->
                    <li class="nav-item dropdown">
                        <button class="btn nav-link dropdown-toggle HeaderFileButton" id="fileDropdown"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            File
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="fileDropdown">
                            <li><a class="dropdown-item ReadLogFile" onclick="InitialReadFile()">Read Log File</a></li>
                            <li><a class="dropdown-item CloseTheseLogs" onclick="CloseLogs()">Close all Logs</a></li>
                        </ul>
                    </li>
                    <!-- Tools Dropdown -->
                    <li class="nav-item dropdown">
                        <button class="btn nav-link dropdown-toggle HeaderFileButton" id="toolsDropdown"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Tools
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="toolsDropdown">
                            <li><a class="dropdown-item eCompassButton"
                                    href="https://support.combilift.net/ecompass">eCompass</a></li>
                            <li><a class="dropdown-item SupportButton"
                                    href="https://support.combilift.net/knowledge-base">Knowledge Base</a></li>
                        </ul>
                    </li>
                    <!-- Help Dropdown -->
                    <li class="nav-item dropdown">
                        <button class="btn nav-link dropdown-toggle" id="HeaderHelpButton" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Help
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="HeaderHelpButton">
                            <li><a class="dropdown-item SupportButton" href="https://support.combilift.net">Combilift
                                    Technical Support</a></li>
                            <li><a class="dropdown-item SupportButton" href="https://combilift.com/en/contact/">Contact
                                    Support</a></li>
                            <li><a class="dropdown-item SupportButton" href="https://combilift.com/en/about-us/">About
                                    Us</a></li>
                        </ul>
                    </li>
                    <!-- User Dropdown -->
                    <li class="nav-item dropdown">
                        <button class="btn nav-link dropdown-toggle" id="HeaderUserButtonReal" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="far fa-user"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="HeaderUserButtonReal">
                            <li>
                                <button class="dropdown-item" id="DownloadButton">
                                    <p id="FixedUsernameText" class="mb-0">User</p>
                                    <p id="UsernameLocal" class="mb-0"></p>
                                </button>
                            </li>
                            <li>
                                <button class="dropdown-item" id="DownloadButton">
                                    <p id="FixedAccessLevelText" class="mb-0">Access Level</p>
                                    <p id="AccessLevel" class="mb-0"></p>
                                </button>
                            </li>
                            <li>
                                <button class="dropdown-item" id="DownloadButton"
                                    onclick="sessionStorage.clear(); location.href=`http://support.combilift.net/wp-login.php?action=logout`;">
                                    <p id="FixedLogoutText" class="mb-0">Logout</p>
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <!-- End Web Header -->

    <div class="container-fluid" id="Wrapper">
        <div class="row">
            <!-- Desktop Sidebar -->
            <nav class="col-md-3 col-lg-2 d-none d-md-block sidebar py-3" id="SideMenu">
                <div id="CombiLogLine" class="mb-3"></div>
                <button class="btn btn-primary w-100 mb-3 FilterThroughLogs">Filter Through Logs</button>

                <div id="TimeFilter" class="card mb-3">
                    <div class="card-body">
                        <div class="mb-2">
                            <label class="form-label">From :</label>
                            <input id="StarterTime" type="date" class="form-control" disabled />
                        </div>
                        <div class="mb-2">
                            <label class="form-label">To :</label>
                            <input id="EndTime" type="date" class="form-control" disabled />
                        </div>
                        <div class="mb-2 d-flex gap-2">
                            <input type="submit" id="SearchFilterBTN" onclick="SearchFilterTime()" value="Search"
                                class="btn btn-success flex-fill" disabled />
                            <input type="submit" id="ClearFilterBTN" onclick="ClearFilterTime()" value="Clear"
                                class="btn btn-secondary flex-fill" disabled />
                        </div>
                        <ul id="DatesInLogsList" class="list-group mb-2"></ul>
                        <ul id="LogTypeLogsList" class="list-group"></ul>
                    </div>
                </div>

                <button class="btn btn-info w-100 mb-3 InfoAboutLineBTN">Info About Line</button>
                <div id="InfoAboutLine" class="mb-4"></div>

                <div id="ExportResultsDiv" class="fixed-bottom pb-3 px-3" style="z-index: 1020;">
                    <input type="submit" class="btn btn-outline-primary w-100 ExportResultsButton"
                        onclick="ExportViewable()" value="Export Results" disabled />
                </div>

                <div id="SidebarResizeHandle"></div>
            </nav>

            <!-- Main Content -->
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4" id="MainBody">
                <!-- Toggle for mobile -->
                <button class="btn btn-primary d-md-none my-3" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#MobileSidebar" aria-controls="MobileSidebar">
                    <i class="fas fa-filter"></i> Filter Logs
                </button>

                <div id="LogUserLog" class="my-3"></div>
                <p id="InstructionsText" class="lead text-muted">Open a Combilift log file to view your logs</p>
            </main>

            <!-- Offcanvas Sidebar for Mobile -->
            <div class="offcanvas offcanvas-start d-md-none" tabindex="-1" id="MobileSidebar"
                aria-labelledby="MobileSidebarLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="MobileSidebarLabel">Filter Logs</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div id="CombiLogLine" class="mb-3"></div>
                    <button class="btn btn-primary w-100 mb-3 FilterThroughLogs">Filter Through Logs</button>

                    <div id="TimeFilter" class="card mb-3">
                        <div class="card-body">
                            <div class="mb-2">
                                <label class="form-label">From :</label>
                                <input id="StarterTime" type="date" class="form-control" disabled />
                            </div>
                            <div class="mb-2">
                                <label class="form-label">To :</label>
                                <input id="EndTime" type="date" class="form-control" disabled />
                            </div>
                            <div class="mb-2 d-flex gap-2">
                                <input type="submit" id="SearchFilterBTN_M" onclick="SearchFilterTime()" value="Search"
                                    class="btn btn-success flex-fill" disabled />
                                <input type="submit" id="ClearFilterBTN_M" onclick="ClearFilterTime()" value="Clear"
                                    class="btn btn-secondary flex-fill" disabled />
                            </div>
                            <ul id="DatesInLogsList" class="list-group mb-2"></ul>
                            <ul id="LogTypeLogsList" class="list-group"></ul>
                        </div>
                    </div>

                    <button class="btn btn-info w-100 mb-3 InfoAboutLineBTN">Info About Line</button>
                    <div id="InfoAboutLine" class="mb-4"></div>

                    <div class="pb-3 px-3">
                        <input type="submit" class="btn btn-outline-primary w-100 ExportResultsButton"
                            onclick="ExportViewable()" value="Export Results" disabled />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="assets/js/OnStart.js"></script>
    <script src="assets/js/index.js"></script>
    <script src="assets/js/download.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Dialogs -->
    <div id="PopUpsDiv" style="display:none;">
        <div id="DefaultFileList" title="New File">
            <div id="DefaultFilesDiv" style="background: white; width: 100%;">
                <div id="OpenForm">
                    <div id="FileOptionBlock">
                        <label div id="ChooseLogFileLabel">Choose your log file</label>
                        <input type="submit" name="logFile" class="LogInput" onclick="readLogs()"
                            value="Choose your log file" required="required" />
                        <select class="LogInput" disabled="disabled" id="DropDownLog" required="required">
                            <option value="0">--Please Choose --</option>
                            <option value="1">Log_Msg_Centre</option>
                            <option value="2">Log_System</option>
                            <option value="3">Log_User</option>
                        </select>

                        <br />

                        <input type="submit" value="Open Logs" disabled="disabled" class="LogInput"
                            id="LogInputButtonCall" onclick="ReadLogs()" />
                    </div>
                    <br />
                </div>
            </div>
        </div>

        <div id="SearchDialog" title="Search Logs">
            <input type="text" id="SearchInput" placeholder="Search Trough Logs">
        </div>

        <div id="ChangeLanguageDialog" title="Change Language">
        </div>
    </div>
</body>

</html>