<?php
namespace Sistema\Models;

class Dizimo extends Model
{
	static $belongs_to = 'pessoa';
	static $alias_attribute = ['dt_referencia' => 'dt_vencimento'];
	static $table_name = 'receitas';
	static $delegate = [
		['nome', 'to' => 'pessoa', 'prefix' => 'pessoa']
	];
}
