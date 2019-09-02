<?php
namespace Sistema\Models;

class Usuario extends Model
{
	static $belongs_to = 'paroquia';

	static $delegate = [
		['nome', 'to' => 'paroquia', 'prefix' => 'paroquia']
	];

	static $attr_protected = ['senha'];

	public function set_raw_password($raw_password) {
 		$this->senha = base64_encode($raw_password);
	}

	public function get_raw_password() {
 		return base64_decode($this->senha);
	}
}
