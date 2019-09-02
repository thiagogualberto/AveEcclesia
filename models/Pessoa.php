<?php
namespace Sistema\Models;

class Pessoa extends Model
{
	public function get_nmsexo()
	{
		return $this->sexo === 'M' ? 'Masculino' : 'Feminino';
	}
}
