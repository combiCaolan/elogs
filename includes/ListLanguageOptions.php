<?php
	echo"<script> LanguageOptionsDir = []; </script>";
	if ($handle = opendir('Dictionary')) {
	    while (false !== ($entry = readdir($handle))) {
	        if ($entry != "." && $entry != "..") {
				if($entry !== 'index.php'){
						echo"<script> LanguageOptionsDir.push('" . $entry . "')</script>";
				}
			}
    	}
	    closedir($handle);
	}else{
		//echo('could not find dir');
	}
?>