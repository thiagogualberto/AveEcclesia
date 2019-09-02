<?php
namespace Sistema\Models;

class Membro extends Model
{
	static $belongs_to = 'pessoa';
	static $has_one = [
		['dizimista', 'foreign_key' => 'pessoa_id', 'primary_key' => 'pessoa_id', 'class_name' => 'Dizimista'],
		['batismo', 'foreign_key' => 'pessoa_id', 'primary_key' => 'pessoa_id'],
		['crisma', 'foreign_key' => 'pessoa_id', 'primary_key' => 'pessoa_id']
	];
	static $delegate = [
		['nome', 'dt_nascimento', 'rg', 'cpf_cnpj', 'tel', 'cel', 'sexo', 'estado_civil', 'to' => 'pessoa']
	];

	/**
	 * Nome do estado civil
	 */
	public function get_nmestado_civil()
	{
		$estados = [
			'M' => [ 'S' => 'solteiro', 'C' => 'casado', 'D' => 'divorciado', 'V' => 'viúvo' ],
			'F' => [ 'S' => 'solteira', 'C' => 'casada', 'D' => 'divorciada', 'V' => 'viúva' ]
		];

		$sexo = $this->sexo;
		$estado_civil = $this->estado_civil;

		return $estados[$sexo][$estado_civil];
	}

	/**
	 * Objeto de batismo
	 */
	public function get_batismo() {
		return Batismo::find_by_pessoa_id($this->pessoa_id);
	}

	public static function pessoa($pessoa_id) {
		return Membro::find_by_pessoa_id($pessoa_id);
	}
}
