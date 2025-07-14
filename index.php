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
    <link rel="stylesheet" href="assets/css/WebMenuStyle.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <style>
        /* Flexbox layout for sidebar and main content */
        #Wrapper .row {
            display: flex;
            flex-wrap: nowrap;
            height: 100vh;
        }
        #SideMenu {
            position: relative;
            min-width: 200px;
            max-width: 600px;
            width: 250px;
            flex-shrink: 0;
            z-index: 2;
            background: #f8f9fa;
        }
        #SidebarResizeHandle {
            position: absolute;
            top: 0;
            right: 0;
            width: 8px;
            height: 100%;
            cursor: ew-resize;
            background: rgba(0,0,0,0.05);
            z-index: 1050;
        }
        #MainBody {
            flex: 1 1 0%;
            min-width: 0;
            overflow-x: auto;
            padding: 20px;
            z-index: 1;
            background: #fff;
        }
    </style>
</head>

<body>
    <?php include_once('Verify.php'); ?>
    <?php include_once('includes/ListLanguageOptions.php'); ?>
    <?php include_once('includes/indexwebheader.html'); ?>

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
    <?php include_once('includes/dialog.html'); ?>
</body>
</html>