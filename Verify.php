<?php

// test mode variable
$test_mode = True;

if ($test_mode) {
	echo ('<script> var AccessLevelForUser = "8";</script>');
	echo ('<script>sessionStorage.setItem("AccessLevel","8");</script>');
	return;
}

// load wordpress functions
include_once('../wp-load.php');

if (!is_user_logged_in()) {
	header('location: https://support.combilift.net/login-selection/');
} else {
	wp_get_current_user();
	global $current_user;
	$full_name = $current_user->first_name . ' ' . $current_user->last_name;
	echo '<script> sessionStorage.setItem("elogsloggedinusername","' . $full_name . '"); </script>';
	echo '<script> sessionStorage.setItem("elogsloggedinemail","' . $current_user->user_email . '"); </script>';

	function display_user_roles()
	{
		$user_id = get_current_user_id();
		$user_info = get_userdata($user_id);
		$user_roles_raw = implode(' , ', $user_info->roles);
		$user_roles_all = explode(' , ', $user_roles_raw);
		$user_roles = $user_roles_all[0];

		$localcurrent_user = wp_get_current_user();
		$user_email_test = $localcurrent_user->user_email;

		$string_kb = "nowledgebase";
		$string_combi = "ombilift.";

		if (strpos($user_roles_raw, $string_kb) == true) {
			if (strpos($user_email_test, $string_combi) == true) {
				$user_roles = '7';
			} else {
				$user_roles = '6';
			}
		} else {
			$user_roles = '0';
		}

		return $user_roles;
	}

	echo ('<script> var AccessLevelForUser = "' . display_user_roles() . '";</script>');
	echo ('<script>sessionStorage.setItem("AccessLevel","' . display_user_roles() . '");</script>');

	function display_user_roles_txt()
	{
		$user_roles1 = display_user_roles();

		if ($user_roles1 == '8') {
			$user_roles_disp = 'Developer';
		} elseif ($user_roles1 == '7') {
			$user_roles_disp = 'Combilift';
		} elseif ($user_roles1 == '6') {
			$user_roles_disp = 'Dealer';
		} elseif ($user_roles1 == '5') {
			$user_roles_disp = 'Manager';
		} elseif ($user_roles1 == '4') {
			$user_roles_disp = 'Service';
		} elseif ($user_roles1 == '3') {
			$user_roles_disp = 'Operator 3';
		} elseif ($user_roles1 == '2') {
			$user_roles_disp = 'Operator 2';
		} elseif ($user_roles1 == '1') {
			$user_roles_disp = 'Operator 1';
		} elseif ($user_roles1 == '0') {
			$user_roles_disp = 'Operator';
		} else {
			$user_roles_disp = 'Generic user';
		}
		return $user_roles_disp;
	}
	echo ('<script>sessionStorage.setItem("AccessLevel_disp","' . display_user_roles_txt() . '");</script>');
}

?>