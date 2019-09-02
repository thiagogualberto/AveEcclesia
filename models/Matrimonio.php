<?php
namespace Sistema\Models;

class Matrimonio extends Model
{
	static $before_create = ['add_membro_info'];
	static $before_destroy = ['rm_membro_info'];

	static $belongs_to = [
		['noivo', 'foreign_key' => 'noivo_id', 'primary_key' => 'pessoa_id', 'class_name' => 'Membro'],
		['noiva', 'foreign_key' => 'noiva_id', 'primary_key' => 'pessoa_id', 'class_name' => 'Membro']
	];
	static $delegate = [
		['mae', 'pai', 'to' => 'noivo', 'prefix' => 'noivo'],
		['mae', 'pai', 'to' => 'noiva', 'prefix' => 'noiva']
	];

	const escolaridade = [
		'F' => 'Ensino Fundamental',
		'M' => 'Ensino Médio',
		'S' => 'Ensino Superior',
		'E' => 'Mestrado',
		'D' => 'Doutorado'
	];

	const sacramentos = [
		null,
		'Batismo',
		'1ª Comunhão',
		'Crisma'
	];

	public function add_membro_info()
	{
		$noivo = $this->noivo;
		$noiva = $this->noiva;

		$noivo->ie_matrimonio = 1;
		$noiva->ie_matrimonio = 1;

		return $noivo->save() && $noiva->save();
	}

	public function rm_membro_info()
	{
		$noivo = $this->noivo;
		$noiva = $this->noiva;

		$noivo->ie_matrimonio = 0;
		$noiva->ie_matrimonio = 0;

		return $noivo->save() && $noiva->save();
	}

	public function get_noivo() {
		return Membro::find_by_pessoa_id($this->noivo_id);
	}

	public function get_noiva() {
		return Membro::find_by_pessoa_id($this->noiva_id);
	}

	public function get_q2a_name() {
		return $this->strIdx2array($this->q2a, self::sacramentos) ?? 'Nenhum';
	}

	public function get_q2b_name() {
		return $this->strIdx2array($this->q2b, self::sacramentos) ?? 'Nenhum';
	}

	/**
	 * Membro desejado dos nubentes
	 */
	public function membro($membro_id = 'noivo_id') {
		return Membro::find_by_pessoa_id($this->$membro_id);
	}

	/**
	 * Conjuge do nubente informado
	 */
	public function conjuge($membro_id = 'noivo_id')
	{
		$conjuge_id = $membro_id == 'noivo_id' ? 'noiva_id' : 'noivo_id';
		return Membro::find_by_pessoa_id($this->$conjuge_id);
	}

	/**
	 * Pega uma string com os indexes e seleciona no array
	 */
	public function strIdx2array($str, $array)
	{
		if (empty($str) || preg_match('/[^\d,]/', $str)) {
			return null;
		}

		$ids = explode(',', $str);
		$names = [];

		foreach ($ids as $id) {
			$names[] = $array[$id];
		}

		return join(', ', $names);
	}

	public function get_q4a_name() {
		return self::escolaridade[$this->q4a] ?? '-';
	}

	public function get_q4b_name() {
		return self::escolaridade[$this->q4b] ?? '-';
	}
}
