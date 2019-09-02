<?php
namespace Sistema;

class LocalAuth extends \ExpressPHP\Auth\Auth {

	public function get_user() {
		if (isset($_SESSION['user'])) {
			$user = (object) $_SESSION['user'];
			$user->paroquia = (object) $user->paroquia;
			return $user;
		} else {
			return null;
		}
	}

	public function set_user($user) {

	}

	public function is_authenticated() : bool {
		return false;
	}

	public function authenticate($user, $pass) {

	}

	public function use_strategie($req, $res) : bool {
		return true;
	}
}
