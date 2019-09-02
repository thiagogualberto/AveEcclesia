<?php
namespace Sistema\Models;

class Transferencia extends Model
{
	static $belongs_to = [
		'receita', 'despesa',
		['origem', 'foreign_key' => 'conta_origem','class_name' => 'Conta'],
		['destino', 'foreign_key' => 'conta_destino','class_name' => 'Conta'],
	];

	static $delegate = [
		['nome', 'to' => 'origem', 'prefix' => 'conta_origem'],
		['nome', 'to' => 'destino', 'prefix' => 'conta_destino']
	];
}
