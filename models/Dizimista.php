<?php
namespace Sistema\Models;

class Dizimista extends Model
{
	static $before_create = ['add_membro_info'];
	static $before_destroy = ['rm_membro_info'];

	static $belongs_to = ['pessoa', 'comunidade'];
	static $has_many = [['dizimo', 'foreign_key' => 'pessoa_id', 'primary_key' => 'pessoa_id']];
	static $delegate = [
		['nome', 'to' => 'comunidade', 'prefix' => 'comunidade'],
		['nome', 'dt_nascimento', 'cep', 'cidade', 'bairro', 'endereco', 'uf', 'tel', 'cel', 'email', 'to' => 'pessoa']
	];

	public function dizimos($dizimo_id, $start_date, $end_date) {
		return Dizimo::all([
			'conditions' => [
				'paroquia_id = ? AND pessoa_id = ? AND plano_contas = ? AND dt_pagamento BETWEEN ? AND ? AND quitado = true',
				$this->paroquia_id, $this->pessoa_id, $dizimo_id, $start_date, $end_date
			]
		]);
	}

	public function add_membro_info() {
		$membro = Membro::pessoa($this->pessoa_id);
		$membro->ie_dizimista = 1;
		return $membro->save();
	}

	public function rm_membro_info() {
		$membro = Membro::pessoa($this->pessoa_id);
		$membro->ie_dizimista = 0;
		return $membro->save();
	}
}
