<?php include_once('includes/Verify.php'); ?>

<!DOCTYPE html>
<html>

<head>
	<!--favicon code-->
	<!--Favicon Start-->
	<link rel="apple-touch-icon" sizes="180x180" href="../assets/Favicons/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="../assets/Favicons/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="../assets/Favicons/favicon-16x16.png">
	<!--Favicon End-->
</head>

<body>
	<!--Web Header-->
	<div class="topnav" id="myTopnav">
	</div>
	<!--Web Header-->

	<div id="row_usr">
		<div id="right_row">
			<img id="LogoHead"
				src="https://support.combilift.net/wp-content/uploads/2020/09/Combilift-Master-logo-opt.png">
			<br />
			<h3 style="font-weight:100;" id="InstructionsText">Click the download button to save the exported file into
				your device. <h3 style="font-weight:100;" id="ConcatName"></h3>
			</h3> <br /><br />
			<button id="$start">Download file</button>
			<!--test-->
		</div>
	</div>
	<script src="assets/js/download.js"></script>
	<script>
		$start.onclick = () => {
			const blob = new Blob([sessionStorage.getItem('Export_data').replace(/^\s*[\r\n]/gm, '')], { type: 'text/plain' })
			download(blob, sessionStorage.getItem('Export_filename'), "text/plain");
		}
	</script>

</body>

</html>