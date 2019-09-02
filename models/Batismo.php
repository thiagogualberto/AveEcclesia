<?php
namespace Sistema\Models;

class Batismo extends Model
{
	static $before_create = ['add_membro_info'];
	static $before_destroy = ['rm_membro_info'];

	static $belongs_to = ['pessoa', ['membro', 'foreign_key' => 'pessoa_id', 'primary_key' => 'pessoa_id']];

	public function add_membro_info() {
		$membro = Membro::pessoa($this->pessoa_id);
		$membro->ie_batismo = 1;
		return $membro->save();
	}

	public function rm_membro_info() {
		$membro = Membro::pessoa($this->pessoa_id);
		$membro->ie_batismo = 0;
		return $membro->save();
	}
}
