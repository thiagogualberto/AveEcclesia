<?php
namespace Sistema\Models;

class Despesa extends ModelFinanceiro
{
	static $belongs_to = ['pessoa', ['categoria', 'foreign_key' => 'plano_contas', 'class_name' => 'PlanoContas'], 'conta'];
	static $delegate = [
		['nome', 'to' => 'pessoa', 'prefix' => 'pessoa'],
		['descricao', 'codigo', 'to' => 'categoria', 'prefix' => 'categoria'],
		['nome', 'to' => 'conta', 'prefix' => 'conta']
	];
}
