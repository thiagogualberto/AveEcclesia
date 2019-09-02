<?php
namespace Sistema\Models;

class PrestadorServico extends Model
{
	static $belongs_to = 'pessoa';
	static $table_name = 'prestadores_servico';
	static $delegate = [
		['nome', 'dt_nascimento', 'rg', 'cpf_cnpj', 'tel', 'cel', 'sexo', 'estado_civil', 'to' => 'pessoa']
	];
}
