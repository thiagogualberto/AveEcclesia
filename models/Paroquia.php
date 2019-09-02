<?php
namespace Sistema\Models;

class Paroquia extends Model
{
	static $belongs_to = 'diocese';
	static $delegate = [
		['nome', 'to' => 'diocese', 'prefix' => 'diocese']
	];

	static function get_logo($paroquia) {

		if ($paroquia->logo) {
			return 'uploads/logo/'.$paroquia->logo;
		}
		
		return 'static/img/icone.png';
	}
}
